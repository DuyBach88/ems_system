import cloudinary from "../config/cloudinary.js";
import Favourite from "../models/Favourite.js";

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log(req.file);
    console.log(req.body);
    const stream = cloudinary.uploader.upload_stream(
      { folder: "handons" },
      async (error, result) => {
        if (error) return res.status(500).json({ error });

        const fav = new Favourite({
          title: req.body.title || "No title",
          image_url: result.secure_url,
          date: new Date(),
        });
        await fav.save();

        res.status(201).json({ message: "Uploaded successfully", fav });
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getFiles = async (req, res) => {
  try {
    const files = await Favourite.find().sort({ date: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Favourite.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.json({ message: "Deleted successfully", deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { uploadFile, getFiles, deleteFile };
