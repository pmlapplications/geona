import $ from 'jquery';
import 'jquery-validation';
import * as setup from './setup_triggers';

window.jquery = window.jQuery = window.$ = $;

setup.registerTriggers();
