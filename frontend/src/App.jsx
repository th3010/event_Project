import Profile from "./pages/Profile";
import SavedEvents from "./pages/SavedEvents";
import EditEvent from "./pages/EditEvent";
import Checkout from "./pages/Checkout";
import './App.css';
import MyTickets from "./pages/MyTickets"; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";
import MyEvents from "./pages/MyEvents";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event/:id" element={<EventDetail />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-tickets" element={<MyTickets />} />
        <Route path="/edit/:id" element={<EditEvent />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/saved-events" element={<SavedEvents />} />  
      </Routes>
      
      {/* THÊM COMPONENT NÀY ĐỂ HIỆN THÔNG BÁO GÓC MÀN HÌNH */}
      <ToastContainer position="bottom-right" theme="dark" />
    </BrowserRouter>
  );
}

export default App;