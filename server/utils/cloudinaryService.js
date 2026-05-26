const cloudinary = require('cloudinary').v2;

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a base64 image Data URI to Cloudinary.
 * If the input is already a URL or is empty, returns it as-is.
 * 
 * @param {string} base64Str - Base64 Data URI or existing URL
 * @returns {Promise<string>} Secure Cloudinary image URL
 */
const uploadImage = async (base64Str) => {
  if (!base64Str) return '';
  
  // If it's already a URL (e.g., HTTP/HTTPS), return it directly
  if (base64Str.startsWith('http://') || base64Str.startsWith('https://')) {
    return base64Str;
  }
  
  // If it's not a base64 string, return it as-is
  if (!base64Str.startsWith('data:image/')) {
    return base64Str;
  }
  
  try {
    const uploadResponse = await cloudinary.uploader.upload(base64Str, {
      folder: 'ajnabh_assets',
      resource_type: 'image'
    });
    return uploadResponse.secure_url;
  } catch (err) {
    console.error('Cloudinary upload failure:', err.message || err);
    throw new Error('Image upload to Cloudinary failed: ' + (err.message || err));
  }
};

module.exports = {
  cloudinary,
  uploadImage
};
