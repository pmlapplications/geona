/**
 * Print the provided string to the console.
 * @param  {String} string The string to print
 */
export function consoleLog(string) {
  console.log(string);
}

/**
 * Reverse the provided string and log it to the console.
 * @param  {String} string The string to reverse and log
 */
export function reverseLog(string) {
  console.log(reverseString(string));
}

/**
 * Reverse the provided string.
 * @param  {String} string The string to reverse
 * @return {String}        The reversed string
 */
function reverseString(string) {
  return string.split('').reverse().join('');
}