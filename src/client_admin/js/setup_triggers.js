/**
 * @fileoverview Adds the events and triggers for the setup page
 */
import $ from 'jquery';

/**
 * 
 * 
 * @export
 */
export function registerTriggers() {
  $('.js-geona-admin__setup .panel-heading :checkbox').click(/* @this HTMLElement */ function() {
    $(this.closest('.panel')).find('.panel-body').toggleClass('hidden', this.value);
  });

  // form validation
  $('#oauth_setup').validate({
    errorLabelContainer: '#feedback',
    wrapper: 'li',
    errorClass: 'has-error',
    rules: {
      provider: {
        required: true,
        minlength: 1,
      },
    },
    messages: {
      provider: 'Please select at least one OAuth provider and complete the details for the selected provider(s)',
    },
    // submitHandler: function(form) {
    //   $(form).ajaxSubmit();
    // },
  });
}


