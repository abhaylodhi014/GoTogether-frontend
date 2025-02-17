import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../service/api';
const Rating = ({showAlert}) => {
  const { username } = useParams();
  const ratedBy = sessionStorage.getItem('username');
  const [userRating, setUserRating] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmitRating = async () => {
    const response = await API.newRatings({
      ratedUser: username,
      ratedBy: ratedBy,
      rating: userRating,
    });

    if (response.isSuccess) {
      setIsSubmitted(true);
      showAlert('Rating submitted successfully', 'success');
    } else {
      showAlert('Failed to submit rating', 'error');
    }
  };

  return (
    <div className='flex items-center justify-center w-full h-screen'>
     <div className="flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow-lg w-72 text-center">
      <h1 className="text-2xl font-bold text-gray-700 mb-6">Rate the user: {username}</h1>
      
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={`w-8 h-8 cursor-pointer transition-all ${
              userRating >= star ? 'text-yellow-400' : 'text-transparent border-2 border-yellow-400'
            } text-3xl flex items-center justify-center`}
            onClick={() => setUserRating(star)}
          >
            ⭐
          </div>
        ))}
      </div>

      <p className="text-gray-700">You rated: {userRating} Star{userRating > 1 ? 's' : ''}</p>

      <button
        className={`mt-6 px-6 py-2 text-white rounded-md transition-all ${isSubmitted ? 'bg-green-500' : 'bg-green-400 hover:bg-green-500'} ${isSubmitted ? 'cursor-not-allowed' : ''}`}
        onClick={handleSubmitRating}
        disabled={isSubmitted}
      >
        {isSubmitted ? 'Rating Submitted!' : 'Submit Rating'}
      </button>
      </div>
</div>
  );
};

export default Rating;
