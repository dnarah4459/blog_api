/* eslint-disable no-unused-vars */
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");
  let [email, setEmail] = useState("");
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      setFirstName("");
      setLastName("");
      setEmail("");
      setUsername("");
      setPassword("");
      navigate('/login'); 
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center flex-grow bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-gray-200 flex flex-col gap-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          SignUp
        </h2>
        <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="firstname" className="text-gray-600">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your first name"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="lastname" className="text-gray-600">
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your last name"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-gray-600">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-gray-600">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer"
          >
            SignUp
          </button>
        </form>
      </div>
    </div>
  );
}
