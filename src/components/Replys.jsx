import React, { useState, useEffect, useRef } from 'react';
import API from '../service/api.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

function Replies({ ride, showAlert }) {
  const [currentUser, setCurrentUser] = useState(null); 
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('username');
    setCurrentUser(storedUser); // Set the current user from sessionStorage
  }, []); 

  useEffect(() => {
    if (!ride?._id) return; // Don't run if ride is not available
    //fecth all replies of that particular ride
    const fetchReplies = async () => {
      const response = await API.getAllReplies(null, null, null, { params: { id: ride._id } });
      if (response.isSuccess) {
        setReplies(response.data);

//check currntuser is same to ride owner or not
        if (currentUser !== ride.username) {
          setSelectedUser(ride.username);
        }
      }
    };

    fetchReplies();

//fetch replies in every 3 sec
    const interval = setInterval(fetchReplies, 3000);
    return () => clearInterval(interval);
  }, [ride?._id, currentUser, ride?.username]);


  //create new reply
  const handleAddReply = async () => {
    if (!newReply.trim()) {
      showAlert('Reply cannot be empty', 'warning');
      return;
    }

    const replyData = {
      rideId: ride._id,
      sender: currentUser,
      receiver: selectedUser,
      username: currentUser,
      text: newReply,
      date: new Date(),
    };

    const response = await API.newReply(replyData);
    if (response.isSuccess) {
      showAlert('Reply sent successfully!', 'info');
      setReplies((prev) => [...prev, response.data]);
      setNewReply('');
    } else {
      showAlert('Failed to send reply. Please try again.', 'error');
    }
  };

//delete reply
  const handleDeleteReply = async (replyId) => {
    const response = await API.deleteReply({ id: replyId });
    if (response.isSuccess) {
      showAlert('Reply deleted successfully!', 'success');
      setReplies((prev) => prev.filter((reply) => reply._id !== replyId));
    } else {
      showAlert('Failed to delete reply. Please try again.', 'error');
    }
  };

// update reply
  const handleUpdateReply = async (replyId) => {
    const response = await API.updateReply({ id: replyId, text: editingText });
    if (response.isSuccess) {
      showAlert('Reply updated successfully!', 'success');
      setReplies((prev) =>
        prev.map((reply) => (reply._id === replyId ? { ...reply, text: editingText } : reply))
      );
      setEditingReplyId(null);
      setEditingText('');
    } else {
      showAlert('Failed to update reply. Please try again.', 'error');
    }
  };


// count how many unique user reply exit on that ride
  const uniqueUsers = Array.from(
    new Set(replies.map((reply) => (reply.sender === currentUser ? reply.receiver : reply.sender)))
  )
    .map((username) => ({
      username,
      lastReplyDate: Math.max(
        ...replies
          .filter(
            (r) => r.sender === username || (r.receiver === username && r.sender === currentUser)
          )
          .map((r) => new Date(r.date).getTime())
      ),
    }))
    .sort((a, b) => b.lastReplyDate - a.lastReplyDate);


//agar current user ride owner nahi hai tu  us ride ke reply ko filter karege as a sender or recevier    
  const filteredReplies = selectedUser
    ? replies.filter(
        (reply) =>
          (reply.sender === currentUser && reply.receiver === selectedUser) ||
          (reply.sender === selectedUser && reply.receiver === currentUser)
      )
    : [];

  const groupedReplies = filteredReplies.reduce((acc, reply) => {
    const dateKey = new Date(reply.date).toLocaleDateString();
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(reply);
    return acc;
  }, {});

  return (
    <div className="flex flex-col rounded-lg p-2 overflow-hidden">
      
      {!selectedUser && (
//if current user is ride owner then show all user that have reply on the paticular ride        
        <div className="space-y-2">
          {uniqueUsers.length === 0 && <p className="text-gray-500">No replies yet.</p>}
          {uniqueUsers.map((user) => (
            <div
              key={user.username}
              className="cursor-pointer p-2 border rounded-lg bg-gray-300 hover:bg-gray-400 flex"
//IF current user click on a paticular user then show him that user chat              
              onClick={() => setSelectedUser(user.username)}
            >
              <FontAwesomeIcon icon={faUserCircle} className="text-2xl font-bold mr-2" />
              <p className="text-lg font-semibold">{user.username}</p>
            </div>
          ))}
        </div>
      )}


      {selectedUser && (
// jap rideowner or current user same na ho or JAB DONO SAME HO AUR RIDE OWNER LIST OF USER REPLY THAT RIDE MAI SE EK PER CLICK KARE TU USSE CHAT PER LE JAYE        
        <>
          <div className="flex justify-between items-center mb-2">
            {currentUser === ride.username && (
              <button
                className="text-blue-500 font-bold text-lg"
                onClick={() => setSelectedUser(null)}
              >
                ← Back
              </button>
            )}
            <p className="font-bold text-gray-500 text-lg ">{selectedUser}</p>
          </div>

          <div className="flex-1 chatbg overflow-y-auto space-y-3 border">
            {filteredReplies.length === 0 && (
              <p className="text-gray-600">No conversation with {selectedUser} yet.</p>
            )}

            {Object.entries(groupedReplies).map(([date, replies]) => (
              <div key={date}>
                <div className="text-center text-sm text-gray-500 my-2">{date}</div>
                {replies.map((reply) => (
                  <div
                    key={reply._id}
                    className={`flex ${reply.sender === currentUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`p-1 px-4 my-1 rounded-lg ${
                        reply.sender === currentUser
                          ? 'bg-blue-500 text-white font-bold'
                          : 'bg-gray-200 text-black font-bold'
                      }`}
                    >
                      <div className="flex gap-6">
                        <p>{reply.text}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(reply.date).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      {reply.sender === currentUser && (
                        <div className="flex space-x-3 text-sm mt-1 justify-end">
                          <button
                            className="text-yellow-300"
                            onClick={() => {
                              setEditingReplyId(reply._id);
                              setEditingText(reply.text);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-400"
                            onClick={() => handleDeleteReply(reply._id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}

                      {editingReplyId === reply._id && (
                        <div className="mt-2">
                          <input
                            type="text"
                            className="border p-1 rounded w-full"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                          />
                          <div className="flex justify-end space-x-2 mt-1">
                            <button
                              className="text-green-500"
                              onClick={() => handleUpdateReply(reply._id)}
                            >
                              Update
                            </button>
                            <button
                              className="text-gray-400"
                              onClick={() => setEditingReplyId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div ref={endOfMessagesRef} />
          </div>

          <div className="p-2 bg-white border-t flex">
            <textarea
              className="flex-1 input"
              placeholder={`Reply to ${selectedUser}...`}
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
            />
            <button className="button mx-2 ml-4 text-lg" onClick={handleAddReply}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Replies;
