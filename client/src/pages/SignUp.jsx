import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          className="bg-white border p-3 rounded-lg focus:outline-none border-none"
          id="username"
        />
        <input
          type="email"
          placeholder="email"
          className="bg-white border p-3 rounded-lg focus:outline-none border-none"
          id="email"
        />
        <input
          type="password"
          placeholder="password"
          className="bg-white border p-3 rounded-lg focus:outline-none border-none"
          id="password"
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80">
          SIGN UP
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
