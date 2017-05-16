import $ from 'jquery'; // Default import since $() is a function
import { throttle } from 'lodash'; // Import just throttle from lodash
import * as sharedExample from '../../common/shared_example'; // Import all from the sharedExample module

$('p').on('click', function() {
  alert('Eeep! >_<');
});

$('.click-me').on('click', throttle(function() {
  console.count('ouch!');
}, 1000));

let string = 'Testing the common module on the front end!';
sharedExample.consoleLog(string);
sharedExample.reverseLog(string);
