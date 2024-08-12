import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Signin from './pages/Signin'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import About from './pages/About'
import Header from './component/Header'
import PrivateRoute from './component/PrivateRoute'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'
import Search from './pages/Search'
import { useState } from 'react'
import ScrollToTop from './component/ScrollToTop'
import Footer from './component/Footer'

const App = () => {
  let [showNav, setShowNav] = useState(false)

  return (
    <BrowserRouter >
    <ScrollToTop/>
     <Header setShowNav={setShowNav} showNav={showNav}/>
        <Routes>
          <Route path='/' element={<Home setShowNav={setShowNav} showNav={showNav}/>}/>
          <Route path='/sign-in' element={<Signin/>}/>
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route element={<PrivateRoute/>}>
             <Route path='/profile' element={<Profile/>}/>
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