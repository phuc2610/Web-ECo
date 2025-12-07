import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShopContextProvider from "./context/ShopContext";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import SearchBar from "./components/SearchBar";
import ChatWidget from "./components/ChatWidget";
import AnimatedRoute from "./components/AnimatedRoute";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Collection from "./pages/Collection";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import PlaceOrder from "./pages/PlaceOrder";
import Wishlist from "./pages/Wishlist";
import Compare from "./pages/Compare";
import Product from "./pages/Product";
import Profile from "./pages/Profile";
import Verify from "./pages/Verify";

const AppRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <AnimatedRoute>
            <Home />
          </AnimatedRoute>
        } />
        <Route path="/collection" element={
          <AnimatedRoute>
            <Collection />
          </AnimatedRoute>
        } />
        <Route path="/about" element={
          <AnimatedRoute>
            <About />
          </AnimatedRoute>
        } />
        <Route path="/contact" element={
          <AnimatedRoute>
            <Contact />
          </AnimatedRoute>
        } />
        <Route path="/product/:productId" element={
          <AnimatedRoute>
            <Product />
          </AnimatedRoute>
        } />
        <Route path="/cart" element={
          <AnimatedRoute>
            <Cart />
          </AnimatedRoute>
        } />
        <Route path="/login" element={
          <AnimatedRoute>
            <div className="min-h-screen">
              <Login />
            </div>
          </AnimatedRoute>
        } />
        <Route path="/place-order" element={
          <AnimatedRoute>
            <PlaceOrder />
          </AnimatedRoute>
        } />
        <Route path="/orders" element={
          <AnimatedRoute>
            <Orders />
          </AnimatedRoute>
        } />
        <Route path="/wishlist" element={
          <AnimatedRoute>
            <Wishlist />
          </AnimatedRoute>
        } />
        <Route path="/compare" element={
          <AnimatedRoute>
            <Compare />
          </AnimatedRoute>
        } />
        <Route path="/verify" element={
          <AnimatedRoute>
            <Verify />
          </AnimatedRoute>
        } />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AnimatedRoute>
                <Profile />
              </AnimatedRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <ShopContextProvider>
      <div className="min-h-screen flex flex-col">
        <ToastContainer />
        <Navbar />
        <SearchBar />
        <main className="flex-1 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
          <AppRoutes />
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </ShopContextProvider>
  );
};

export default App;
