import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const PrivateRoute = () => {
  // Use the 'useSelector' hook to extract 'currentUser' from the 'user' slice of the Redux store's state
  // This is done by passing a function to 'useSelector' that receives the entire state and returns the 'user' state
  let { currentUser } = useSelector((state) => state.user);

  // Conditional rendering based on the existence of 'currentUser'
  // If 'currentUser' exists (truthy), render the 'Outlet' component
  // 'Outlet' will render the nested child components/routes for this route
  // If 'currentUser' does not exist (falsy), render the 'Navigate' component
  // 'Navigate' will redirect the user to the '/sign-in' route
  return currentUser ? <Outlet /> : <Navigate to={'/sign-in'} />;
};

export default PrivateRoute