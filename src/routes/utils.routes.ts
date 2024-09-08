import { Router, Request, Response, NextFunction } from 'express';
import * as Controller from '../../src/controllers/Common/uploadController';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

// Set up memory storage configuration
const storage = multer.memoryStorage();

// File filter for allowed extensions and MIME types
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const fileExtension = path.extname(file.originalname || '').toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webm', '.mp4', '.mov', '.avi', '.mkv'];
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'video/webm', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];

  if (allowedExtensions.includes(fileExtension) && allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } 
};

// Multer uploader configuration
const uploader = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 150, // 150 MB file size limit
  },
});

// Define the router
const router = Router();

// Upload file route
router.post("/uploadFile", uploader.single("file"), (req: Request, res: Response, next: NextFunction) => {
  if (req.file) {
    // Call uploadFile method in Controller if no error
    Controller.uploadFile(req, res, next);
  } else {
    res.status(400).send({ success: false, msg: 'No file uploaded' });
  }
});

export default router;
