import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css";

const socket = io("http://localhost:5000", {
  withCredentials: true,
});

const Messaging = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      socket.emit("join", currentUser._id);
    }

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.disconnect();
  }, [currentUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/message/users-with-listings", {
          credentials: "include",
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    try {
      const res = await fetch(`/api/message/get-message/${user._id}`, {
        credentials: "include",
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedUser) return;

    const res = await fetch(`/api/message/send-message/${selectedUser._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, data]);

    socket.emit("sendMessage", {
      receiverId: selectedUser._id,
      message: data.message,
      senderId: currentUser._id,
    });

    setMessage("");
  };

  const getSenderId = (msg) => {
    if (typeof msg.senderId === "string") return msg.senderId;
    if (typeof msg.senderId === "object" && msg.senderId !== null)
      return msg.senderId._id;
    return null;
  };

  return (
    <div className="flex h-screen md:h-[550px]">
      {/* Left sidebar: list of users */}
      <div className="w-1/3 border-r overflow-y-auto p-4">
        <h2 className="text-xl font-bold mb-4">Start Chat</h2>
        {users.map((user) => (
          <div
            key={user._id}
            className="p-2 border-b cursor-pointer hover:bg-gray-100"
            onClick={() => handleSelectUser(user)}
          >
            <div className="font-medium">{user.username}</div>
          </div>
        ))}
      </div>

      {/* Right: chat window */}
      <div className="flex-1 p-4 bg-white flex flex-col">
        {selectedUser ? (
          <>
            <h3 className="text-lg font-semibold mb-2">
              Chat with {selectedUser.username}
            </h3>
            <div className="flex-1 overflow-y-auto border p-2 rounded mb-2 space-y-2">
              {messages.map((msg, idx) => (
                <MessageBox
                  key={idx}
                  position={
                    getSenderId(msg) === currentUser._id ? "right" : "left"
                  }
                  type="text"
                  text={msg.message}
                  date={new Date(msg.createdAt)}
                  title={
                    getSenderId(msg) === currentUser._id
                      ? "You"
                      : selectedUser.username
                  }
                />
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="border p-2 rounded flex-1"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button
                className="bg-gray-700 text-white px-4 rounded"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Messaging;
