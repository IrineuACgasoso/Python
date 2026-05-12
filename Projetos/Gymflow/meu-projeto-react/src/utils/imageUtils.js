/**
 * Compresses an image File to a base64 JPEG string.
 * Resizes to fit within 480×480px while preserving aspect ratio.
 * Quality is set to 0.72 — good balance between size and clarity.
 *
 * @param {File} file - The image file chosen by the user
 * @returns {Promise<string>} Base64-encoded JPEG data URL
 */
export async function compressImg(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      let w = img.width;
      let h = img.height;
      const max = 480;

      if (w > max) { h = Math.round((h * max) / w); w = max; }
      if (h > max) { w = Math.round((w * max) / h); h = max; }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);

      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };

    img.src = url;
  });
}