import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';

function EditEvent() {
    const { id } = useParams(); // Lấy ID cần sửa
    const navigate = useNavigate();
    
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [category, setCategory] = useState("Music"); 

    // Kiểm tra đăng nhập và Lấy dữ liệu cũ đắp lên form
    useEffect(() => {
        const userString = localStorage.getItem("user");
        if (!userString) {
            toast.error("Bạn phải đăng nhập để sửa sự kiện!");
            navigate("/login");
            return;
        }

        axios.get(`http://localhost:5000/api/events/${id}`)
            .then(res => {
                setTitle(res.data.title);
                setDate(res.data.date);
                setLocation(res.data.location);
                setImageUrl(res.data.imageUrl);
                setCategory(res.data.category || "Music");
            })
            .catch(() => toast.error("Lỗi khi tải thông tin sự kiện"));
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/events/${id}`, {
                title, date, location, imageUrl, category
            });
            toast.success("Cập nhật sự kiện thành công!");
            navigate("/my-events"); // Sửa xong quay về Dashboard
        } catch (error) {
            toast.error("Có lỗi xảy ra khi cập nhật.");
        }
    };

    return (
        <div className="container mt-4 text-white pb-5">
            <h2 className="mb-4 text-mint fw-bold text-center">Sửa Sự Kiện</h2>
            <form onSubmit={handleSubmit} className="card card-dark p-4 shadow-lg w-50 mx-auto border-mint">
                <label className="text-secondary mb-1">Tên sự kiện *</label>
                <input className="form-control mb-3 bg-dark text-white border-secondary" value={title} onChange={(e) => setTitle(e.target.value)} required />
                
                <label className="text-secondary mb-1">Thể loại (Category) *</label>
                <select className="form-select mb-3 bg-dark text-white border-secondary" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Music">🎤 Music</option>
                    <option value="Nightlife">🪩 Nightlife</option>
                    <option value="Arts">🎭 Performing & Visual Arts</option>
                    <option value="Holidays">🏖️ Holidays</option>
                    <option value="Dating">❤️ Dating</option>
                    <option value="Hobbies">🎮 Hobbies</option>
                    <option value="Business">💼 Business</option>
                    <option value="Food & Drink">🍕 Food & Drink</option>
                </select>

                <label className="text-secondary mb-1">Ngày tổ chức *</label>
                <input type="date" className="form-control mb-3 bg-dark text-white border-secondary" value={date} onChange={(e) => setDate(e.target.value)} required />
                
                <label className="text-secondary mb-1">Địa điểm *</label>
                <input className="form-control mb-3 bg-dark text-white border-secondary" value={location} onChange={(e) => setLocation(e.target.value)} required />
                
                <label className="text-secondary mb-1">Link Hình Ảnh</label>
                <input className="form-control mb-4 bg-dark text-white border-secondary" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                
                <button type="submit" className="btn btn-warning btn-lg w-100 fw-bold">Lưu Thay Đổi</button>
            </form>
        </div>
    );
}
export default EditEvent;