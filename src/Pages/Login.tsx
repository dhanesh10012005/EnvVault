import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import GoogleSignInButton from "../components/GoogleSignInButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); // we'll call this from context
  const navigate = useNavigate();
   
  const [count,setCount]=useState(0)


  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate("/"); // go to home page after successful login
  };
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-100 p-3">
      <div className="h-auto w-96 bg-white border border-gray-300 rounded-2xl p-8 shadow-lg">
        <div className="flex justify-center mb-6">
          <h1 className="text-3xl font-bold text-blue-500">Login</h1>
        </div>

        {/* Login Form */}
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-semibold">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold rounded-lg p-2 mt-4 hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
       
        <h1 className="text-sm mt-1">Click here for <button onClick={()=>navigate('/signup')} className="text-blue-600 cursor-pointer hover:text-blue-700">SignUp!</button></h1>
        {/* Google Sign-in */}
        <div className="mt-6">
          <GoogleSignInButton />
        </div>
       
      </div>
    </div>
  );
};

export default Login;
