import {Rule} from '@angular-devkit/schematics';
import {Schema as ComponentOptions} from '@schematics/angular/component/schema';
import {buildComponent} from '../utility/build-component';


export default function (options: ComponentOptions): Rule {
  return buildComponent(options, 'Add');
}
