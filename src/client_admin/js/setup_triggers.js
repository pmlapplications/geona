/**
 * @fileoverview Adds the events and triggers for the setup page
 */
import $ from 'jquery';
import _ from 'lodash';

import * as validation from './validation';

/**
 * 
 * 
 * @export
 */
export function registerTriggers() {
  $('.js-geona-admin__setup-oauth .panel-heading :checkbox').click(/* @this HTMLElement */ function() {
    $(this.closest('.panel')).find('.panel-body').toggleClass('hidden', this.value);
  });

  $.validator.addMethod('multipleemail', function(value) {
    let emails = value.split(/,|;/);

    /* eslint max-len: 0 */
    /* eslint no-useless-escape: 0 */
    let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    for (let i = 0; i < emails.length; i++) {
      if (emails[i].trim() === '' || ! regex.test(emails[i].trim())) {
        return false;
      }
    }
    return true;
  });

  // form validation; `validationSettings` are defined in the template to allow for easy translation
  /* eslint no-undef: 0 */
  let mergedSettings = _.merge(validation.baseValidationSettings, validationSettings);

  $('#oauth_setup').validate(mergedSettings);
}


