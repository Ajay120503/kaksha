const Material = require("../models/Material");
const { cloudinary, detectResourceType } = require("../config/cloudinary");

exports.uploadMaterial = async (req, res) => {
  try {
    const { classId, title } = req.body;

    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const mime = req.file.mimetype;
    const fileBuffer = req.file.buffer;
    const resourceType = detectResourceType(mime);

    // Upload to cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: resourceType,
            folder: "kaksha_materials",
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        )
        .end(fileBuffer);
    });

    // Save to DB
    const mat = await Material.create({
      classroom: classId,
      title,
      file: uploadResult.secure_url,
    });

    res.status(200).json({
      message: "Material uploaded successfully",
      material: mat,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};

exports.getMaterials = async (req, res) => {
  const data = await Material.find({ classroom: req.params.id });
  res.json(data);
};
