import { useSelector } from "react-redux"
import { Outlet, Navigate  } from "react-router-dom"

const OnlyAdminAndAgentRoute = () => {
  let {currentUser} = useSelector((state) => state.user)
  return currentUser && (currentUser.isAdmin || currentUser.isAgent) ? <Outlet/> : <Navigate to={'/sign-in'}/>
  
}

export default OnlyAdminAndAgentRoute