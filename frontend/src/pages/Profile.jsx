import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Profile() {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    const [name, setName] = useState(user ? user.name : "");
    const [password, setPassword] = useState("");

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:5000/api/users/${user.id}`, { name, password });
            localStorage.setItem("user", JSON.stringify(res.data)); // Cập nhật lại bộ nhớ
            toast.success("Cập nhật thông tin thành công!");
            window.location.reload(); // Tải lại để đổi tên trên Navbar
        } catch (error) { toast.error("Lỗi cập nhật!"); }
    };

    if (!user) return <h3 className="text-white text-center mt-5">Vui lòng đăng nhập</h3>;

    return (
        <div className="container mt-5 text-white pb-5">
            <h2 className="mb-4 fw-bold text-mint text-center">Cài Đặt Tài Khoản</h2>
            <form onSubmit={handleUpdate} className="card bg-dark border-secondary p-4 shadow-lg w-50 mx-auto">
                <label className="text-secondary mb-1">Email (Không thể đổi)</label>
                <input className="form-control mb-3 bg-secondary text-white border-0" value={user.email} disabled />
                
                <label className="text-secondary mb-1">Họ và Tên</label>
                <input className="form-control mb-3 bg-dark text-white border-secondary" placeholder="VD: Trần Lê Minh Thư" value={name} onChange={(e) => setName(e.target.value)} required />
                
                <label className="text-secondary mb-1">Mật khẩu mới (Bỏ trống nếu không đổi)</label>
                <input type="password" className="form-control mb-4 bg-dark text-white border-secondary" placeholder="Nhập mật khẩu mới..." value={password} onChange={(e) => setPassword(e.target.value)} />
                
                <button type="submit" className="btn btn-mint btn-lg w-100 fw-bold">Lưu Thay Đổi</button>
            </form>
        </div>
    );
}
export default Profile;