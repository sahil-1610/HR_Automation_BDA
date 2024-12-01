// middlewares/cloudinaryMiddleware.js
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path"); // Add path module

// Validate Cloudinary configuration
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("Cloudinary configuration missing! Please check your .env file.");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadToCloudinary = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Verify Cloudinary config
    const configTest = cloudinary.config();
    console.log("Cloudinary Config:", {
      cloud_name: configTest.cloud_name,
      api_key: configTest.api_key?.slice(0, 5) + '...',  // Log partial key for verification
    });

    // Verify file exists
    if (!fs.existsSync(req.file.path)) {
      return res.status(400).json({ error: "File not found" });
    }

    // Get file extension
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    // Determine resource type based on file extension
    let resourceType = 'raw'; // default to raw for unknown types
    if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileExt)) {
      resourceType = 'image';
    } else if (/\.(mp4|mov|avi|wmv)$/i.test(fileExt)) {
      resourceType = 'video';
    } else if (/\.(pdf|doc|docx|txt|rtf)$/i.test(fileExt)) {
      resourceType = 'raw';
    }

    // Upload to cloudinary with original filename and extension
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: resourceType,
      folder: 'form-builder',
      use_filename: true,
      unique_filename: true,
      format: fileExt.replace('.', ''), // Preserve file extension
      public_id: path.parse(req.file.originalname).name, // Use original filename without extension
      overwrite: true
    });

    console.log("Cloudinary upload success:", {
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: resourceType
    });

    // Store cloudinary data in res.locals
    res.locals.cloudinary = {
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: resourceType,
      success: true  // Add success flag
    };

    // Clean up local file
    fs.unlinkSync(req.file.path);
    next();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    
    // Clean up local file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    // Send detailed error message
    res.status(500).json({ 
      error: "Failed to upload to Cloudinary",
      details: error.message,
      cloudinaryUrl: null // Add explicit null for error handling
    });
  }
};
