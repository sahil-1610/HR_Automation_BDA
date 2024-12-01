// routes/formRoutes.js
const express = require("express");
const { 
    createForm, 
    uploadMedia, 
    getAllForms, 
    getForm,
    submitFormResponse,
    getFormResponses
} = require("../controllers/formController");
const { uploadToCloudinary } = require("../middlewares/cloudinaryMiddleware");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", createForm);
router.post("/upload-media/:id", upload.single("file"), uploadToCloudinary, uploadMedia);
router.get("/", getAllForms);
router.get("/:id", getForm);
router.post("/:formId/submit", submitFormResponse);
router.get("/:formId/responses", getFormResponses);

module.exports = router;
