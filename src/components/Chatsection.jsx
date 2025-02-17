import React, { useEffect, useState } from 'react';
import API from '../service/api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

function ChatSection() {
  const navigate = useNavigate();
  const currentUser = sessionStorage.getItem('username');
  const [conversations, setConversations] = useState([]);

  const handleChatClick = (chatName) => {
    navigate(`/chat/${chatName}`);
  };

  useEffect(() => {
    const fetchReplies = async () => {
      const response = await API.getReplies();
      if (response.isSuccess) {
        const replies = response.data;
        const userReplies = replies.filter(
          (reply) => reply.sender === currentUser || reply.receiver === currentUser
        );
        const chatsMap = new Map();

        userReplies.forEach((reply) => {
          const otherPerson = reply.sender === currentUser ? reply.receiver : reply.sender;
          if (!chatsMap.has(otherPerson)) {
            chatsMap.set(otherPerson, {
              name: otherPerson,
              latestDate: new Date(reply.date),
            });
          } else {
            const existingChat = chatsMap.get(otherPerson);
            if (new Date(reply.date) > existingChat.latestDate) {
              chatsMap.set(otherPerson, {
                ...existingChat,
                latestDate: new Date(reply.date),
              });
            }
          }
        });

        const chatArray = Array.from(chatsMap.values()).sort(
          (a, b) => b.latestDate - a.latestDate
        );

        setConversations(chatArray);
      }
    };

    if (currentUser) {
      fetchReplies();
      const interval = setInterval(fetchReplies, 3000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  if (!currentUser) {
  
    return (
      <div className='bg-gray-100 p-4 rounded-lg shadow-md mx-auto flex  justify-center items-center min-h-screen'>
      <div className="shadow-lg p-4 my-auto bg-gray-300 rounded-2xl  text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to Chat</h2>
        <p className="text-gray-600 mb-4">Please login or sign up to start chatting.</p>
        <div className="flex space-x-4 justify-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => navigate('/auth')}
          >
            Login
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => navigate('/auth')}
          >
            Signup
          </button>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mx-auto flex-col max-w-4xl justify-center items-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Chats</h2>

      {conversations.length === 0 && <p className="text-gray-500">No conversations yet.</p>}
      {conversations.map((chat) => (
        <div
          key={chat.name}
          className="p-3 my-4 input cursor-pointer hover:bg-gray-200 rounded transition"
          onClick={() => handleChatClick(chat.name)}
        >
          <div className="font-bold flex">
            <div className='mr-2 flex'>
              <FontAwesomeIcon icon={faUserCircle} className='text-2xl font-bold mr-2' />
              {chat.name}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatSection;
