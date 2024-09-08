import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import path from 'path';
import { uploadFile as cloudinaryUpload } from '../../util/uploadFile';

export const uploadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const fileExtension = path.extname(req.file.originalname || '').toLowerCase();
    const isImage = [".jpg", ".jpeg", ".png"].includes(fileExtension);
    const isVideo = [".webm", ".mp4", ".mov", ".avi", ".mkv"].includes(fileExtension);

    let upload;

    if (isImage) {
      // Directly process the image using sharp and upload to Cloudinary
      const buffer = await sharp(req.file.buffer).toBuffer(); // Convert image buffer to buffer
      upload = await cloudinaryUpload(buffer, 'image'); // Upload image buffer to Cloudinary
    } else if (isVideo) {
      // Upload video buffer directly to Cloudinary
      upload = await cloudinaryUpload(req.file.buffer, 'video');
    } else {
      throw new Error("Invalid file type");
    }

    res.send({
      success: true,
      msg: "File Uploaded Successfully!",
      data: upload.secure_url,
    });
  } catch (error) {
    // Explicitly check if error is an instance of Error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error uploading file:", errorMessage);
    res.status(500).send({ success: false, msg: errorMessage });
  }
};
