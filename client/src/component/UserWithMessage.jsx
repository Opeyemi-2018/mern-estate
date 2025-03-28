// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";

// const UserWithMessage = () => {
//   const [users, setUsers] = useState([]);

//   const { currentUser, loading: userLoading } = useSelector(
//     (state) => state.user
//   );
//   useEffect(() => {
//     const fetchUsers = async () => {
//       if (!currentUser) return; // Wait for currentUser to load

//       // setLoading(true); // Set loading to true before fetching

//       try {
//         const res = await fetch("/api/message/users-with-message"); // Your route
//         if (!res.ok) {
//           const errorData = await res.json(); // Try to get error details from the server
//           throw new Error(
//             errorData.error || `HTTP error! status: ${res.status}`
//           ); // Throw an error with details
//         }
//         const data = await res.json();
//         setUsers(data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message); // Set the error message
//         setLoading(false);
//         console.error("Error fetching users:", err); // Log the error to the console
//       }
//     };

//     fetchUsers();
//   }, [currentUser]); // Re-fetch if currentUser changes

//   return (
//     <div>
//       <h2>Users you've messaged:</h2>
//       <ul>
//         {users.map((user) => (
//           <li key={user._id}>
//             {user.image && (
//               <img
//                 src={user.image}
//                 alt={user.username}
//                 style={{ width: "50px", height: "50px", borderRadius: "50%" }}
//               />
//             )}{" "}
//             {/* Display image if available */}
//             <span>{user.username}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default UserWithMessage;
