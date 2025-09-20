import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadForm = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !image) {
      alert("Vui lòng nhập tên và chọn ảnh!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", image);

      await axios.post("http://localhost:3000/api/handon/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Upload thành công!");
      navigate("/"); // quay về trang Home
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload thất bại!");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload User</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            User Name
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter user name..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full"
            onChange={handleImageChange}
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-4 w-24 h-24 rounded-full object-cover mx-auto border"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
