import multer from "multer";

// Dùng memoryStorage để lưu file trong RAM
const storage = multer.memoryStorage();

// Giới hạn dung lượng: 2MB
const limits = { fileSize: 2 * 1024 * 1024 }; // 2MB

// Chỉ cho phép file ảnh (jpg, jpeg, png)
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, and .png files are allowed"), false);
  }
};

const upload = multer({ storage, limits, fileFilter });

export default upload;
