import $ from 'jquery'; // Default import since $() is a function
import { throttle } from 'lodash'; // Import just throttle from lodash
import * as sharedExample from '../../common/shared_example'; // Import all from the sharedExample module

// Add click listener to paragraphs
$('p').on('click', function() {
  alert('Eeep! >_<');
});

// Add click listener to the button
$('.click-me').on('click', throttle(function() {
  console.count('ouch!');
}, 1000));

// Test the imported module
let string = 'Testing the common module on the front end!';
sharedExample.consoleLog(string);
sharedExample.reverseLog(string);
