import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/Signin'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Header from './component/Header'
import PrivateRoute from './component/PrivateRoute'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'
import Search from './pages/Search'
import { useState } from 'react'
import ScrollToTop from './component/ScrollToTop'
import Footer from './component/Footer'
import Dashboard from './pages/Dashboard'
import OnlyAdminAndAgentRoute from './component/OnlyAdminAndAgentRoute'
import CreateListing from './pages/CreateListing'

const App = () => {
  let [showNav, setShowNav] = useState(false)

  return (
    <BrowserRouter >
    <ScrollToTop/>
     <Header setShowNav={setShowNav} showNav={showNav}/>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/sign-in' element={<Signin/>}/>
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route element={<PrivateRoute/>}>
            <Route path='/dashboard' element={<Dashboard  showNav={showNav}/>}/> 
            {/* <Route path='/update-listing' element={<UpdateListing/>}/> */}
          </Route>
          <Route element={<OnlyAdminAndAgentRoute/>}>
             <Route path='/create-listing' element={<CreateListing/>}/>
             <Route path='/update-listing/:listingId' element={<UpdateListing/>}/>
          </Route>
          <Route path='/about' element={<About/>}/>
          <Route path='/search' element={<Search/>}/>
          <Route path='/listing/:listingId' element={<Listing />} />
        </Routes>
        <Footer/>
    </BrowserRouter>
  )
}

export default App