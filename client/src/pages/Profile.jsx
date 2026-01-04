import { useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserFailure,
  deleteUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null); //it is used to access img file input directly by clicking on img in the screen
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [filePerc, setFilePerc] = useState(0); // Upload percentage store karne ke liye

  const handleImageUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const res = await axios.post("/api/upload/avatar", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setFilePerc(percentCompleted);
        },
      }); //backend controlller pe ye req ja rhi hai, and wo iss formdata me se image ko read karke cloudinary pe upload kar dega
      setFormData((prev) => ({
        ...prev,
        avatar: res.data.url, //Cloudinary upload hone ke baad ek Secure URL return karta hai, jise aap formData state mein save kar lete hain taaki wo database mein ja sake.
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
    //event listener
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      // if (data.success === false) {
      //   dispatch(updateUserFailure(err.message));
      //   return;
      // }
      dispatch(updateUserSuccess(data)); // ✅ Add this
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
      //console.log(err.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
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
          hidden //it is hidden as we are triggering it via img click
          accept="image/*" //only accepts images
          onChange={(e) => setFile(e.target.files[0])} //puting the selected file into file state
        />

        <img
          onClick={() => fileRef.current.click()} //fileRef logic
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
        {/* Progress Bar UI */}
        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 mb-2">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${filePerc}%` }}
            ></div>
            <p className="text-xs text-center mt-1">{`Uploading: ${filePerc}%`}</p>
          </div>
        )}
        {uploadError && (
          <p className="text-red-700 text-sm text-center">
            Upload failed. Try again.
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          defaultValue={currentUser.username} //imp
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
          disabled={loading}
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
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
/**Summary Flow:
User image choose karta hai (setFile).

"Upload Avatar" button click hota hai (handleImageUpload).

Backend image Cloudinary ko bhejta hai.

Cloudinary URL wapas deta hai jo aapki state (avatar) mein update ho jata hai.

Finally, jab user "Update" button dabata hai, toh wo Cloudinary URL MongoDB mein save ho jata hai. */
