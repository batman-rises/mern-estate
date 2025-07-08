import React, { useRef, useState } from "react";
import axios from "axios";

const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef();

  const storeImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("/api/upload/avatar", formData); // cloudinary route
      return res.data.url; // Cloudinary URL
    } catch (err) {
      console.error("Upload error:", err);
      throw new Error("Image upload failed");
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    setUploadError("");

    if (files.length < 1 || files.length > 6) {
      return setUploadError("Please upload between 1 to 6 images.");
    }

    setUploading(true);
    try {
      const promises = [...files].map((file) => storeImage(file));
      const urls = await Promise.all(promises);
      setImageUrls((prev) => [...prev, ...urls]);
    } catch (err) {
      setUploadError("One or more image uploads failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = (url) => {
    setImageUrls(imageUrls.filter((image) => image !== url));
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="60"
            minLength="5"
            required
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex gap-4 flex-col flex-1">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              disabled={uploading}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {/* Error */}
          {uploadError && <p className="text-red-600 text-sm">{uploadError}</p>}

          {/* Image previews */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative border rounded p-2">
                <img
                  src={url}
                  alt="Uploaded preview"
                  className="w-full h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(url)}
                  className="absolute top-1 right-1 text-red-600 font-semibold"
                >
                  DELETE
                </button>
              </div>
            ))}
          </div>

          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
