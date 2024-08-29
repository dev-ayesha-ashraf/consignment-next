import useAuth from "@/hooks/useAuth";
import React from "react";
import useLoader from "@/hooks/useLoader";
import Image from 'next/image';
import logo from "../images/logo.png";
import Loader from "@/components/Loader";

const Login = () => {
  const { onLogin, handleChange, error } = useAuth();
  const { loading, showLoader, hideLoader } = useLoader();
  const handleLogin = async () => {
    showLoader();
    await onLogin();
    hideLoader();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary px-4">
      <div className="bg-customBg p-8 rounded-lg shadow-lg max-w-xl w-full transform transition duration-500 hover:scale-105 animate-fadeInUp">
        <div className="flex justify-center mb-6">
          <Image
            src={logo}
            alt="Logo"
            width={100}
            height={100}
            className="animate-bounce"
          />
        </div>
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">Login</h1>
        {error && <p className="text-red-600 text-center mb-6">{error}</p>}
        <label htmlFor="email" className="block text-lg font-semibold text-gray-800">Email:</label>
        <input
          name="email"
          onChange={handleChange}
          className="mt-2 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-base transition duration-300 transform hover:scale-105"
        />
        <label htmlFor="password" className="block text-lg font-semibold text-gray-800 mt-1">Password:</label>
        <input
          name="password"
          type="password"
          onChange={handleChange}
          className="mt-2 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-base transition duration-300 transform hover:scale-105"
        />
        <button onClick={handleLogin} disabled={loading} className="w-full py-3 px-6 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-lg transition duration-300 transform hover:scale-105 mt-3">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
      {loading && <Loader />}
    </div>
  );
};

export default Login;
