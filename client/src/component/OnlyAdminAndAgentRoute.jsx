import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const OnlyAdminAndAgentRoute = () => {
  let { currentUser } = useSelector((state) => state.user);
  // console.log(currentUser);

  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default OnlyAdminAndAgentRoute;
