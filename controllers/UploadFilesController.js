import mongoose from "mongoose";
import cloudinary from "../core/cloudinary.js";

class UploadFilesController {
  upload(req, res) {
    // console.log(_dirname);

    const file = req.file;
    // const filePath = file.path;
    cloudinary.v2.uploader
      .upload_stream({ resource_type: "auto" }, function (error, result) {
        if (error || !result) {
          return res.status(500).json({
            status: "error",
            message: error || "upload error",
          });
        }

        res.status(201).json({
          url: result.url,
          size: Math.round(result.bytes / 1024),
          heigth: result.height,
          width: result.width,
        });
      })
      .end(file.buffer);
  }
}

export const UploadCtrl = new UploadFilesController();
