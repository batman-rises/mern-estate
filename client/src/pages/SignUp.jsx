import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [formData, setformData] = useState({});
  const [error, seterror] = useState(null);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setformData({
      ...formData, //setformData ko unpack karta hai
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setloading(true);
      const res = await fetch("/api/auth/signup", {
        //learn
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      // if (data.success === false) {
      //   seterror(data.message);
      //   setloading(false);
      //   return;
      // }
      setloading(false);
      seterror(null);
      navigate("/sign-in");
    } catch (error) {
      setloading(false);
      seterror(error.message);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="bg-white border p-3 rounded-lg focus:outline-none border-none"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="bg-white border p-3 rounded-lg focus:outline-none border-none"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="bg-white border p-3 rounded-lg focus:outline-none border-none"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "SIGN UP"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default SignUp;
