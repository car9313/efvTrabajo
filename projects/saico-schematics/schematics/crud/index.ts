import {chain, externalSchematic, Rule, schematic} from '@angular-devkit/schematics';
import {Schema as ComponentOptions} from '@schematics/angular/component/schema';

export default function (options: ComponentOptions): Rule {
  const srvOptions = {
    flat: true,
    name: options.name,
    path: options.path,
    project: options.project,
    spec: options.spec,
    skipTests: options.skipTests,
    lintFix: options.lintFix,
  };
  return chain([
    externalSchematic('@schematics/angular', 'class', options),
    schematic('core-service', srvOptions),
    schematic('component-list', options),
    schematic('component-add', options),
    schematic('component-edit', options),
    schematic('component-view', options),
  ]);
}
