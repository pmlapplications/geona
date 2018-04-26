// Node: Rename this file from 'rotation.js' into something more general once we have more non-OGC utils

import Jimp from 'jimp';

/**
 * Downloads an image from the specified URL and rotates it clockwise by the specified angle (in degrees).
 * @param {String} imageUrl The URL of the image to rotate.
 * @param {Number} angle    The angle in degrees to rotate clockwise by.
 *
 * @return {Promise}        Resolves to a rotated .png image.
 */
export function rotate(imageUrl, angle) {
  return new Promise((resolve, reject) => {
    // Check angle validity
    if (!angle && angle !== 0) {
      reject(new Error('Specified angle ' + angle + ' is invalid. Angle must be a Real or Integer Number.'));
    }
    // Attempt to read the image
    Jimp.read(imageUrl).then((image) => {
      // Rotate the image clockwise
      image.rotate(angle);
      // Buffers the image so it can be sent correctly
      image.getBuffer(Jimp.MIME_PNG, (err, rotatedImage) => {
        if (err) {
          reject(err);
        }
        resolve(rotatedImage);
      });
    }).catch((err) => {
      reject(err);
    });
  });
}
