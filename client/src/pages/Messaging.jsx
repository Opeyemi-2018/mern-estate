import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { MessageBox } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { LiaTimesSolid } from "react-icons/lia";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

const socket = io("http://localhost:5000", {
  withCredentials: true,
});

const Messaging = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showPeople, setShowPeople] = useState(false);
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
        const res = await fetch("/api/message/users", {
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
    <div className="flex h-screen ml-10 lg:h-[550px]">
      {/* Left sidebar: list of users */}
      <div
        className={`ml-10 fixed inset-y-0 left-0 z-10 w-44 border-r overflow-y-auto p-4 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          showPeople
            ? "translate-x-0 bg-gray-50 text-black"
            : "-translate-x-full"
        }`}
      >
        <div className="flex  justify-between mt-6">
          <h2 className=" font-bold mb-4">Start Chat</h2>
          <LiaTimesSolid
            size={30}
            className="lg:hidden block cursor-pointer"
            onClick={() => setShowPeople(false)}
          />
        </div>
        <div>
          {users.map((user) => (
            <div
              key={user._id}
              className="p-2 border-b cursor-pointer hover:bg-gray-100"
              onClick={() => {
                handleSelectUser(user);
                setShowPeople(false);
              }}
            >
              <div className="font-medium">{user.username}</div>
            </div>
          ))}
        </div>
      </div>

      <LiaUserFriendsSolid
        size={35}
        onClick={() => setShowPeople(true)}
        className="bg-[#2c2f36] text-white p-1 lg:hidden block cursor-pointer"
      />

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
          <div className="flex items-center justify-center h-screen flex-col gap-3">
            <IoChatbubbleEllipsesOutline size={50} />
            <p>
              page not mobile friendly for now but later. kindly switch to
              desktop
            </p>
            <p className="text-wrap lg:hidden block text-center ">
              Click on the people's icon on the top left angle to see users with
              listings'{" "}
            </p>
            <p className="text-wrap lg:block hidden text-center ">
              start a conversation
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messaging;
