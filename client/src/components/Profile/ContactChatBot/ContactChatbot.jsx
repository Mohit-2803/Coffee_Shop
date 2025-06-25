/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import botAvatar from "../../../assets/supportBot.svg"; // adjust the path as needed
import { processUserInput } from "./processUserInput"; // adjust the path as needed

const ContactChatBot = ({ user }) => {
  // Conversation state with an initial welcome message
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to handle sending a message
  const handleSend = async () => {
    if (!input.trim()) return;
    // Add user message to the conversation
    const userMessage = { sender: "user", text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    // Process user input and update messages
    const newMessages = await processUserInput(input, updatedMessages, user);
    setMessages(newMessages);
  };

  return (
    <div className="w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 p-4">
        <h2 className="text-white text-lg font-semibold">
          Support Assistant Bot
        </h2>
      </div>
      {/* Chat area */}
      <div className="p-4 h-96 overflow-y-auto bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end my-2 ${
              msg.sender === "bot" ? "justify-start" : "justify-end"
            }`}
          >
            {msg.sender === "bot" ? (
              <>
                {/* Bot avatar */}
                <img
                  src={botAvatar}
                  alt="Bot Avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div className="px-4 py-2 rounded-lg max-w-xs shadow bg-blue-100 text-blue-900 rounded-bl-none">
                  <p>{msg.text}</p>
                </div>
              </>
            ) : (
              <>
                <div className="px-4 py-2 rounded-lg max-w-xs shadow bg-green-100 text-green-900 rounded-br-none">
                  <p>{msg.text}</p>
                </div>
                {/* User avatar with fallback to initials */}
                {user && user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-8 h-8 rounded-full ml-2"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full ml-2 bg-gray-600 flex items-center justify-center text-white">
                    {user && user.name
                      ? user.name.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      {/* Input area */}
      <div className="p-4 bg-gray-100 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()} // Send on Enter key
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ContactChatBot;
