const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { upload } = require("../utils/upload");
const {
  uploadMaterial,
  getMaterials,
} = require("../controllers/materialController");

router.post("/upload", auth, upload.single("file"), uploadMaterial);

router.get("/:id", auth, getMaterials);

module.exports = router;
