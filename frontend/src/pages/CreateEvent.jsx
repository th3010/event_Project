import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

function CreateEvent() {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [category, setCategory] = useState("Music"); 
    const [price, setPrice] = useState(0); // State cho giá tiền
    
    const navigate = useNavigate();
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        if (!user) {
            toast.error("Bạn phải đăng nhập để có thể tạo sự kiện!");
            navigate("/login");
        }
    }, [navigate, user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/events", {
                title, date, location, imageUrl, category, 
                price: Number(price), // Gửi giá
                createdBy: user.id,   // Gửi ID của người tạo (A không thể tạo cho B)
                organizerName: user.name
            });
            toast.success("Tạo sự kiện thành công!");
            navigate("/"); 
        } catch (error) { toast.error("Có lỗi xảy ra khi tạo sự kiện."); }
    };

    return (
        <div className="container mt-4 text-white pb-5">
            <h2 className="mb-4 text-mint fw-bold text-center">Tạo Sự Kiện Mới</h2>
            <form onSubmit={handleSubmit} className="card card-dark p-4 shadow-lg w-50 mx-auto border-mint">
                <label className="text-secondary mb-1">Tên sự kiện *</label>
                <input className="form-control mb-3 bg-dark text-white border-secondary" onChange={(e) => setTitle(e.target.value)} required/>
                
                <label className="text-secondary mb-1">Giá vé (VNĐ) *</label>
                <input type="number" className="form-control mb-3 bg-dark text-white border-secondary" placeholder="Nhập 0 nếu sự kiện miễn phí" value={price} onChange={(e) => setPrice(e.target.value)} required/>

                <label className="text-secondary mb-1">Thể loại *</label>
                <select className="form-select mb-3 bg-dark text-white border-secondary" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Music">🎤 Music</option>
                    <option value="Nightlife">🪩 Nightlife</option>
                    <option value="Dating">❤️ Dating</option>
                    <option value="Food & Drink">🍕 Food & Drink</option>
                </select>

                <label className="text-secondary mb-1">Ngày tổ chức *</label>
                <input type="date" className="form-control mb-3 bg-dark text-white border-secondary" onChange={(e) => setDate(e.target.value)} required/>
                
                <label className="text-secondary mb-1">Địa điểm *</label>
                <input className="form-control mb-3 bg-dark text-white border-secondary" onChange={(e) => setLocation(e.target.value)} required/>
                
                <label className="text-secondary mb-1">Link Cover Image</label>
                <input className="form-control mb-4 bg-dark text-white border-secondary" onChange={(e) => setImageUrl(e.target.value)} />
                
                <button type="submit" className="btn btn-mint btn-lg w-100 fw-bold">Đăng Sự Kiện</button>
            </form>
        </div>
    );
}
export default CreateEvent;