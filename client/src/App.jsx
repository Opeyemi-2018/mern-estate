import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Header from "./component/Header";
import PrivateRoute from "./component/PrivateRoute";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import { useState } from "react";
import ScrollToTop from "./component/ScrollToTop";
import Footer from "./component/Footer";
import Dashboard from "./pages/Dashboard";
import OnlyAdminAndAgentRoute from "./component/OnlyAdminAndAgentRoute";
import CreateListing from "./pages/CreateListing";
import Sell from "./pages/Sell";
import Rent from "./pages/Rent";

const AppContent = () => {
  const location = useLocation();
  const [showNav, setShowNav] = useState(false);

  // Define admin paths
  const adminPaths = [
    "/dashboard",
    "/create-listing",
    "/update-listing/:listingId",
  ];

  // Check if the current route is an admin page
  const isAdminPage = adminPaths.some((path) =>
    location.pathname.startsWith(path.split(":")[0])
  );

  return (
    <>
      {!isAdminPage && <Header setShowNav={setShowNav} showNav={showNav} />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:listingId" element={<Listing />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        </Route>
        <Route element={<OnlyAdminAndAgentRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          /> */}
        </Route>
      </Routes>
      {!isAdminPage && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
