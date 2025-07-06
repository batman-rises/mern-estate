import { useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleImageUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const res = await axios.post("/api/upload/avatar", formData);
      setFormData((prev) => ({
        ...prev,
        avatar: res.data.url,
      }));
      setUploadError(false);
    } catch (err) {
      console.error(err);
      setUploadError(true);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      setUpdateSuccess(true);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />

        <button
          type="button"
          onClick={handleImageUpload}
          disabled={uploading}
          className="text-sm bg-indigo-600 text-white rounded-lg px-3 py-2 hover:opacity-90 w-fit self-center"
        >
          {uploading ? "Uploading..." : "Upload Avatar"}
        </button>

        {uploadError && (
          <p className="text-red-700 text-sm text-center">
            Upload failed. Try again.
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
        >
          Update
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>

      {updateSuccess && (
        <p className="text-green-700 mt-5">Profile updated successfully!</p>
      )}
    </div>
  );
}
