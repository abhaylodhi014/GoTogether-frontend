import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../service/api';

const ContactUs = ({ showAlert }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    //....formdate for just not overlap with previous value
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    
    try {
      let response = await API.contactUs(formData);
      
      if (response.isSuccess) {
        showAlert("Form submitted successfully!", "success");
        setFormSubmitted(true); // Mark form as submitted
      } else {
        showAlert("Form submission failed. Please try again.", 'info');
      }
    } catch (error) {
      showAlert("An error occurred. Please check your internet connection.", "warning");
    }
  };

  useEffect(() => {
    if (formSubmitted) {
      // Navigate only after form submission is successful
      navigate('/');
    }
  }, [formSubmitted, navigate]); 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-400 to-gray-500 p-4">
      <div className="bg-gray-900 border border-gray-800 text-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
        <p className="text-gray-400 mb-8 text-center">
          We're here to help with any questions about our destinations, travel experiences, or packages. Reach out and let us know how we can assist you in your journey.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Type your message here"
            rows="4"
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded transition"
          >
            Send Message
          </button>
        </form>
        {status && <p className="mt-4 text-center text-green-400">{status}</p>}
      </div>
    </div>
  );
};

export default ContactUs;
