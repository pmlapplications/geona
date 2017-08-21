import $ from 'jquery';
import handlebars from 'handlebars/runtime';
import * as templates from '../../templates/compiled';
import {registerHelpers} from '../../../common/hbs_helpers';

registerHelpers(handlebars);

export class Overlay {
  constructor(overlayConfigOptions, parentDiv) {
    this.config = overlayConfigOptions;
  }
}
