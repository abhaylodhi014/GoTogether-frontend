import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../service/firebase.js";
import API from "../service/api.js";

export default function Auth({ showAlert }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (!email.endsWith("@iiti.ac.in")) {
  //     setError("Only IIT Indore email addresses are allowed.");
  //     showAlert("Only IIT Indore email addresses are allowed.", "error");
  //     return;
  //   }
  //   setError("Authentication not implemented. Use Google Login.");
  //   showAlert("Authentication not implemented. Use Google Login.", "error");
  // };


    //  I give this login and signup function because i google auth... is not working then you can access by email as well

   const loginUser = async () => {
    try {
      const response = await API.userLogin({ email, password });
      
      // Store tokens in sessionStorage
      sessionStorage.setItem('accessToken', `Bearer ${response.data.accessToken}`);
      sessionStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
      sessionStorage.setItem('username', response.data.username);
      sessionStorage.setItem('email', response.data.email);

      setError("");
      setIsAuthenticated(true);  // Trigger redirection
      navigate('/')
    } catch (error) {
        setError(error.response?.data?.message || "Login failed !! try again.");
        showAlert("Login failed !! try again." , 'error')
    }
  };
    // Signup function
    const signupUser = async () => {
      try {
        const response = await API.userSignup({ username, email, password });
        
  
        // Store tokens in sessionStorage
        sessionStorage.setItem('accessToken', `Bearer ${response.data.accessToken}`);
        sessionStorage.setItem('refreshToken', `Bearer ${response.data.refreshToken}`);
        sessionStorage.setItem('username', response.data.username);
        sessionStorage.setItem('email', response.data.email);
  
        setError("");
        setIsAuthenticated(true);  // Trigger redirection
        navigate('/')
      } catch (error) {
        showAlert("signup failed !! try again." , 'error')
        setError(error.response?.data?.message || "signup failed !! try again.")
      }
    };
    // Form submission handler
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (isLogin) {
        await loginUser();
      } else {
        await signupUser();
      }
    };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (!user.email.endsWith("@iiti.ac.in")) {
        setError("Only IIT Indore email addresses are allowed.");
        showAlert("Only IIT Indore email addresses are allowed.", "warning");
        return;
      }

      const response = await API.googleauth({
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      });

      
      // Store session storage safely inside useEffect
      useEffect(() => {
        sessionStorage.setItem("username", user.displayName);
        sessionStorage.setItem("email", user.email);
        sessionStorage.setItem("profilePhoto", user.photoURL);
        sessionStorage.setItem("accessToken", `Bearer ${response.data.accessToken}`);
        sessionStorage.setItem("refreshToken", `Bearer ${response.data.refreshToken}`);
        setIsAuthenticated(true);
      }, [user, response]);
    } catch (error) {
      setError("Error with Google Authentication: " + error.message);
      showAlert("Error with Google Authentication: " + error.message, "error");
    }
  };

  return (
    <div className="flex justify-center w-full items-center h-screen ">
      <div className="border-1 shadow-lg p-8 w-80 bg-gray-100 rounded-xl">
        <h1 className="text-3xl text-center font-bold mb-6">
          {isLogin ? "Login" : "Signup"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          )}

          <input
            type="email"
            placeholder="E-mail (@iiti.ac.in only)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        <div className="my-4 text-center">
          <p className="text-lg font-semibold">OR</p>
        </div>

        <button
          onClick={handleGoogleAuth}
          className="flex items-center justify-center w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FontAwesomeIcon icon={faGoogle} className="w-5 h-5 mr-2" />
          Google {isLogin ? "Login" : "Signup"}
        </button>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-4 w-full text-blue-600 hover:underline"
        >
          {isLogin ? "Need an account? Signup" : "Have an account? Login"}
        </button>

        {error && (
          <div className="mt-4 bg-red-100 text-red-600 p-3 rounded-lg flex items-center">
            <FontAwesomeIcon icon={faExclamationCircle} className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
