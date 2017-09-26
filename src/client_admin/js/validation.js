/**
 * @fileoverview Defines base validation settings
 */
import $ from 'jquery';

export let baseValidationSettings = {
  errorContainer: '#feedback',
  errorLabelContainer: '#feedback-text',
  errorClass: 'has-error',
  highlight: function(element, errorClass) {
    $(element).parent().addClass(errorClass);
  },
  unhighlight: function(element, errorClass) {
    $(element).parent().removeClass(errorClass);
  },
  wrapper: 'li',
};
