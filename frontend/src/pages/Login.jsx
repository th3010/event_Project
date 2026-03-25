import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const [isLoginMode, setIsLoginMode] = useState(true); // Để chuyển đổi giữa Login và Register
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (isLoginMode) {
                // XỬ LÝ ĐĂNG NHẬP
                const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
                
                // Lưu token và thông tin user vào trình duyệt
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("user", JSON.stringify(response.data.user));
                
                alert("Đăng nhập thành công!");
                navigate("/"); // Về trang chủ
                window.location.reload(); // Load lại web để cập nhật thanh Navbar
            } else {
                // XỬ LÝ ĐĂNG KÝ
                await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
                alert("Đăng ký thành công! Hãy đăng nhập nhé.");
                setIsLoginMode(true); // Chuyển form về dạng Đăng nhập
            }
        } catch (error) {
            alert(error.response?.data?.error || "Có lỗi xảy ra!");
        }
    };

    return (
        <div className="container mt-5 text-white">
            <div className="card card-dark p-4 shadow-lg w-50 mx-auto">
                <h2 className="text-center text-mint mb-4">
                    {isLoginMode ? "Đăng Nhập" : "Đăng Ký Tài Khoản"}
                </h2>
                
                <form onSubmit={handleSubmit}>
                    {!isLoginMode && (
                        <input 
                            className="form-control mb-3" 
                            placeholder="Họ và Tên (VD: Trần Lê Minh Thư)" 
                            onChange={(e) => setName(e.target.value)} 
                            required 
                        />
                    )}
                    <input 
                        type="email" 
                        className="form-control mb-3" 
                        placeholder="Email" 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        className="form-control mb-4" 
                        placeholder="Mật khẩu" 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    
                    <button type="submit" className="btn btn-mint btn-lg w-100 mb-3">
                        {isLoginMode ? "Đăng Nhập" : "Đăng Ký"}
                    </button>
                </form>

                <p className="text-center text-secondary">
                    {isLoginMode ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
                    <span 
                        style={{ cursor: 'pointer', color: '#00ffcc' }} 
                        onClick={() => setIsLoginMode(!isLoginMode)}
                    >
                        {isLoginMode ? "Đăng ký ngay" : "Đăng nhập"}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;