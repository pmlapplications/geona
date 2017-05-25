/** @type {Number} A counter */
let counter = 0;

/**
 * Print the current value of the counter to the console
 */
export function printCounter() {
  console.log('counter = ' + counter);
}

/**
 * Increment the counter
 * @return {Number} The new value of the counter
 */
export function incCounter() {
  return (counter += 1);
}
