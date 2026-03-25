import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    
    // Khai báo State để quản lý việc Ẩn/Hiện cái Menu Dropdown
    const [showMenu, setShowMenu] = useState(false); 
    
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    const handleLogout = () => {
        if (window.confirm("Bạn muốn đăng xuất khỏi hệ thống?")) {
            localStorage.removeItem("token"); 
            localStorage.removeItem("user");  
            navigate("/"); 
            window.location.reload(); 
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm border-bottom border-secondary">
            <div className="container">
                {/* Logo Web */}
                <Link className="navbar-brand fw-bold text-mint" style={{ fontSize: '1.5rem' }} to="/">
                    Event<span className="text-white">Hub</span>
                </Link>
                
                <div className="d-flex align-items-center">
                    <Link className="btn btn-outline-light me-3" to="/">Home</Link>
                    
                    {/* Chỉ hiện nút Tạo sự kiện khi đã đăng nhập */}
                    {user && (
                        <Link className="btn btn-mint me-3 fw-bold" to="/create">
                            + Create Event
                        </Link>
                    )}

                    {/* KHU VỰC PROFILE USER */}
                    {user ? (
                        <div className="position-relative ms-2 border-start border-secondary ps-3">
                            
                            {/* Khu vực bấm vào để xổ Menu */}
                            <div 
                                className="text-white d-flex align-items-center" 
                                style={{ cursor: 'pointer', userSelect: 'none' }}
                                onClick={() => setShowMenu(!showMenu)}
                            >
                                {/* Avatar chữ cái đầu */}
                                <div className="text-dark fw-bold rounded-circle d-flex justify-content-center align-items-center me-2" style={{ width: "35px", height: "35px", backgroundColor: "#00ffcc" }}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span>Chào, <strong className="text-mint">{user.name}</strong> ▾</span>
                            </div>

                            {/* Menu Dropdown hiện ra khi bấm */}
                            {showMenu && (
                                <div className="position-absolute bg-dark border border-secondary rounded shadow-lg mt-2" style={{ top: '100%', right: '0', minWidth: '200px', zIndex: 1050 }}>
                                    
                                    {/* 2 NÚT MỚI: PROFILE VÀ WISHLIST */}
                                    <Link to="/profile" className="d-block text-white text-decoration-none p-3 border-bottom border-secondary" onClick={() => setShowMenu(false)}>
                                        👤 Cài đặt tài khoản
                                    </Link>
                                    <Link to="/saved-events" className="d-block text-white text-decoration-none p-3 border-bottom border-secondary text-danger fw-bold" onClick={() => setShowMenu(false)}>
                                        ❤️ Sự kiện đã lưu
                                    </Link>

                                    <Link to="/my-tickets" className="d-block text-white text-decoration-none p-3 border-bottom border-secondary" onClick={() => setShowMenu(false)}>
                                        🎫 My Tickets
                                    </Link>
                                    <Link to="/my-events" className="d-block text-white text-decoration-none p-3 border-bottom border-secondary" onClick={() => setShowMenu(false)}>
                                        📊 Dashboard
                                    </Link>
                                    
                                    <div className="p-2">
                                        <button onClick={handleLogout} className="btn btn-danger btn-sm w-100 fw-bold">
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link className="btn btn-mint ms-2 fw-bold" to="/login">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;