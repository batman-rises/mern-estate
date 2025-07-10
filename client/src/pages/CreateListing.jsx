import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
const CreateListing = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileRef = useRef();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    type: "rent",
    offer: true,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    imagesUrls: [],
    parking: false,
    furnished: false,
  });
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
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData(() => ({
        ...formData,
        type: e.target.id,
      }));
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData(() => ({
        ...formData,
        [e.target.id]: e.target.checked,
      }));
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData(() => ({
        ...formData,
        [e.target.id]: e.target.value,
      }));
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (imageUrls.length < 1) {
        return setError("Please upload at least one image.");
      }
      if (+formData.discountPrice >= +formData.regularPrice) {
        return setError("Discount price must be less than regular price.");
      }
      setLoading(true);
      setError(false);
      const res = await axios.post("/api/listings/create", {
        ...formData,
        imagesUrls: imageUrls, // You were not passing this updated state
        userRef: currentUser._id,
      });
      const data = res.data;

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
      }
      navigate(`/listing/${data.listing._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                {formData.type === "rent" && (
                  <span className="text-xs">($ / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>

                  {formData.type === "rent" && (
                    <span className="text-xs">($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
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

          <button
            disabled={loading || uploading || imageUrls.length === 0}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
