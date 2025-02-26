import {
  apply,
  applyTemplates,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicsException,
  Tree,
  url,
} from '@angular-devkit/schematics';

import {strings} from '@angular-devkit/core';
import {Schema as ComponentOptions, Style} from '@schematics/angular/component/schema';

import {addDeclarationToModule, addEntryComponentToModule, addExportToModule} from '@schematics/angular/utility/ast-utils';
import {InsertChange} from '@schematics/angular/utility/change';
import {buildRelativePath, findModuleFromOptions} from '@schematics/angular/utility/find-module';
import {parseName} from '@schematics/angular/utility/parse-name';
import {buildDefaultPath, getProject} from '@schematics/angular/utility/project';
import {validateHtmlSelector, validateName} from '@schematics/angular/utility/validation';
import {applyLintFix} from '@schematics/angular/utility/lint-fix';
import * as ts from '../third_party/github.com/Microsoft/TypeScript/lib/typescript';

function readIntoSourceFile(host: Tree, modulePath: string): ts.SourceFile {
  const text = host.read(modulePath);
  if (text === null) {
    throw new SchematicsException(`File ${modulePath} does not exist.`);
  }
  const sourceText = text.toString('utf-8');

  return ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
}

function addDeclarationToNgModule(options: ComponentOptions, componentSuffix: string): Rule {
  return (host: Tree) => {
    if (options.skipImport || !options.module) {
      return host;
    }

    const modulePath = options.module;
    const source = readIntoSourceFile(host, modulePath);

    const componentPath = `/${options.path}/`
      + (options.flat ? '' : strings.dasherize(options.name + componentSuffix) + '/')
      + strings.dasherize(options.name + componentSuffix)
      + '.component';
    const relativePath = buildRelativePath(modulePath, componentPath);
    const classifiedName = strings.classify(`${options.name}${componentSuffix}Component`);
    const declarationChanges = addDeclarationToModule(source,
      modulePath,
      classifiedName,
      relativePath);

    const declarationRecorder = host.beginUpdate(modulePath);
    for (const change of declarationChanges) {
      if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(declarationRecorder);

    if (options.export) {
      // Need to refresh the AST because we overwrote the file in the host.
      const source2 = readIntoSourceFile(host, modulePath);

      const exportRecorder = host.beginUpdate(modulePath);
      const exportChanges = addExportToModule(source2, modulePath,
        strings.classify(`${options.name}${componentSuffix}Component`),
        relativePath);

      for (const change of exportChanges) {
        if (change instanceof InsertChange) {
          exportRecorder.insertLeft(change.pos, change.toAdd);
        }
      }
      host.commitUpdate(exportRecorder);
    }

    if (options.entryComponent) {
      // Need to refresh the AST because we overwrote the file in the host.
      const source3 = readIntoSourceFile(host, modulePath);

      const entryComponentRecorder = host.beginUpdate(modulePath);
      const entryComponentChanges = addEntryComponentToModule(
        source3, modulePath,
        strings.classify(`${options.name}${componentSuffix}Component`),
        relativePath);

      for (const change of entryComponentChanges) {
        if (change instanceof InsertChange) {
          entryComponentRecorder.insertLeft(change.pos, change.toAdd);
        }
      }
      host.commitUpdate(entryComponentRecorder);
    }


    return host;
  };
}


function buildSelector(options: ComponentOptions, projectPrefix: string, componentSuffix: string) {
  let selector = strings.dasherize(options.name + componentSuffix);
  if (options.prefix) {
    selector = `${options.prefix}-${selector}`;
  } else if (options.prefix === undefined && projectPrefix) {
    selector = `${projectPrefix}-${selector}`;
  }

  return selector;
}


export function buildComponent(options: ComponentOptions, componentSuffix: string): Rule {
  return (host: Tree) => {
    if (!options.project) {
      throw new SchematicsException('Option (project) is required.');
    }
    const project = getProject(host, options.project);

    if (options.path === undefined) {
      options.path = buildDefaultPath(project);
    }

    options.module = findModuleFromOptions(host, options);

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;
    options.selector = options.selector || buildSelector(options, project.prefix, componentSuffix);

    // todo remove these when we remove the deprecations
    options.style = (
      options.style && options.style !== Style.Css
        ? options.style : options.styleext as Style
    ) || Style.Css;
    options.skipTests = options.skipTests || !options.spec;

    validateName(options.name);
    validateHtmlSelector(options.selector);

    const templateSource = apply(url(`../component-${componentSuffix.toLowerCase()}/files`), [
      options.skipTests ? filter(path => !path.endsWith('.spec.ts.template')) : noop(),
      options.inlineStyle ? filter(path => !path.endsWith('.__style__.template')) : noop(),
      options.inlineTemplate ? filter(path => !path.endsWith('.html.template')) : noop(),
      applyTemplates({
        ...strings,
        'dashsuffix': (s: string) => strings.dasherize(s + componentSuffix),
        'classsuffix': (s: string) => strings.classify(s + componentSuffix),
        'if-flat': (s: string) => options.flat ? '' : s,
        componentSuffix,
        ...options,
      }),
      move(parsedPath.path),
    ]);

    return chain([
      addDeclarationToNgModule(options, componentSuffix),
      mergeWith(templateSource),
      options.lintFix ? applyLintFix(options.path) : noop(),
    ]);
  };
}
