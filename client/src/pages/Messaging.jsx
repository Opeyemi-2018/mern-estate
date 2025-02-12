// import { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchMessagesStart,
//   fetchMessagesSuccess,
//   fetchMessagesFailure,
//   addMessage,
// } from "../redux/chatSlice"; // Import your slice actions

// const Messaging = () => {
//   const dispatch = useDispatch();
//   const selectedUser = useSelector((state) => state.chat.selectedUser);
//   const { currentUser, loading: userLoading } = useSelector(
//     (state) => state.user
//   );
//   const messages = useSelector((state) => state.chat.messages);
//   const loading = useSelector((state) => state.chat.loading);
//   const error = useSelector((state) => state.chat.error);
//   const [text, setText] = useState("");
//   const socket = useRef(null); // Ref for the socket

//   useEffect(() => {
//     if (userLoading || !selectedUser?._id || !currentUser?._id) return; // Important: Check userLoading

//     console.log(
//       "Fetching messages for:",
//       selectedUser._id,
//       "and current user:",
//       currentUser._id
//     );

//     const fetchMessages = async () => {
//       dispatch(fetchMessagesStart());
//       try {
//         const res = await fetch(
//           `/api/message/get-message/${currentUser._id}/${selectedUser._id}`
//         );
//         if (!res.ok) {
//           const errorData = await res.json(); // Get error details from the server
//           console.error("HTTP Error:", res.status, errorData); // Log status and error data
//           throw new Error(
//             errorData.message || `HTTP error! status: ${res.status}`
//           );
//         }
//         const data = await res.json();
//         console.log("Fetched messages:", data);
//         dispatch(fetchMessagesSuccess(data));
//       } catch (err) {
//         console.error("Error fetching messages:", err); // Log the whole error object
//         dispatch(fetchMessagesFailure(err.message));
//       }
//     };

//     fetchMessages();

//     socket.current = io();

//     const roomId =
//       currentUser._id > selectedUser._id
//         ? `${currentUser._id}-${selectedUser._id}`
//         : `${selectedUser._id}-${currentUser._id}`;

//     socket.current.emit("joinRoom", { roomId });

//     socket.current.on("connect", () => {
//       console.log("Connected to socket.io");
//     });

//     socket.current.on("newMessage", (message) => {
//       console.log("New message received:", message);
//       // Check if the message is relevant to the current chat
//       if (
//         (message.senderId === selectedUser._id &&
//           message.receiverId === currentUser._id) ||
//         (message.senderId === currentUser._id &&
//           message.receiverId === selectedUser._id)
//       ) {
//         dispatch(addMessage(message));
//       }
//     });

//     return () => {
//       if (socket.current) {
//         console.log("Disconnecting socket...");
//         socket.current.disconnect();
//         socket.current.off("newMessage");
//       }
//     };
//   }, [selectedUser, dispatch, currentUser, userLoading]); // Add userLoading to dependencies

//   const sendMessage = async () => {
//     if (!text.trim() || !selectedUser?._id || !currentUser?._id) {
//       console.log("Missing data:", { text, selectedUser, currentUser });
//       return;
//     }

//     const message = {
//       text,
//       receiverId: selectedUser._id,
//       senderId: currentUser._id,
//     };

//     console.log("Sending message:", message);

//     try {
//       const url = `/api/message/send-message/${selectedUser._id}`;
//       console.log("Sending request to:", url);

//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(message),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(
//           errorData.message || `HTTP error! status: ${res.status}`
//         );
//       }

//       const newMessage = await res.json();
//       console.log("Message sent successfully:", newMessage);
//       dispatch(addMessage(newMessage));
//       setText("");

//       if (socket.current) {
//         socket.current.emit("sendMessage", newMessage);
//       }
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   if (loading) {
//     return <div>Loading messages...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className="chat-container">
//       <div className="chat-header">
//         Chat with{" "}
//         {selectedUser?.username ? selectedUser.username : "No user selected"}
//       </div>

//       <div className="chat-box">
//         {messages.length > 0 ? (
//           messages.map((msg) => {
//             console.log("Individual message:", msg);
//             {
//               /* Log each message object */
//             }
//             return (
//               <p
//                 key={msg._id}
//                 className={
//                   msg.senderId === currentUser._id ? "sent" : "received"
//                 }
//               >
//                 {msg.text}
//               </p>
//             );
//           })
//         ) : (
//           <p>No messages yet.</p>
//         )}
//       </div>

//       <div className="chat-input flex gap-2">
//         <input
//           type="text"
//           className="w-full border-gray-700 p-3 rounded-lg shadow-sm"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Type a message..."
//         />
//         <button disabled={userLoading} onClick={sendMessage}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Messaging;

import React from "react";

const Messaging = () => {
  return (
    <div className="flex items-center  gap-3 flex-col justify-center h-screen text-2xl">
      <p>this feature is under implementation!!!</p>
      <p>check back later!!!</p>
    </div>
  );
};

export default Messaging;
