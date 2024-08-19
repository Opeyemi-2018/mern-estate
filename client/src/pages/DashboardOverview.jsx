import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

const DashboardOverview = () => {
    let {currentUser} = useSelector((state) => user.state)
  return (
    <div>
        <h1>Dashboard Overview</h1>
    </div>
  )
}

export default DashboardOverview