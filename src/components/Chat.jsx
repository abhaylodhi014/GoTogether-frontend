import React, { useEffect, useState, useRef } from 'react';
import API from '../service/api';
import { useParams } from 'react-router-dom';

function Chat() {
  //get currentuser from sessionstorage 
  const currentUser = sessionStorage.getItem('username');
  const { name } = useParams(); // Get other person's username from URL
  const chatName = name;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const endOfMessagesRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await API.getAllChat(); 
      // Fetch all messages
      if (response.isSuccess) {
        const allMessages = response.data;

        const userMessages = allMessages.filter(
          (msg) =>
            (msg.sender === currentUser && msg.receiver === chatName) ||
            (msg.sender === chatName && msg.receiver === currentUser)
        );

        setMessages(userMessages);
        scrollToBottom();
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Auto refresh every 3 seconds
    return () => clearInterval(interval);
  }, [chatName, currentUser]);


  //add new message
  const handleAddMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      sender: currentUser,
      receiver: chatName,
      text: newMessage,
      date: new Date(),
    };

    // Optimistic Update
    setMessages((prev) => [...prev, messageData]);
    setNewMessage('');
    textareaRef.current?.focus();

    // Send to backend
    const response = await API.newChat(messageData);
    if (!response.isSuccess) {
      console.error('Failed to send message:', response.error);
    }
    scrollToBottom();
  };
//automatic scroll to bottom of chat
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col bg-gray-200 p-4 min-h-screen justify-center items-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-600">Chat with {chatName}</h2>

      <div className="flex-1 w-[80vw] max-w-4xl overflow-y-auto space-y-3 border chatbg shadow-2xl px-4 pt-3">
        {messages.length === 0 && <p className="text-gray-500">No messages yet. Start the conversation!</p>}

        {messages.map((msg, index) => (
          <div
            key={msg._id || index} // Handle optimistic messages without _id
            className={`flex ${msg.sender === currentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-2 px-4 rounded-lg ${
                msg.sender === currentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              <p>{msg.text}</p>
              <p className="text-xs text-gray-600">
                {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="p-2 flex">
        <textarea
          ref={textareaRef}
          className="max-w-3xl w-[65vw] input p-2"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="button ml-2" onClick={handleAddMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
