import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function MyEvents() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    // Kiểm tra đăng nhập và tự động gọi dữ liệu khi mở trang
    useEffect(() => {
        const userString = localStorage.getItem("user");
        if (!userString) {
            alert("Vui lòng đăng nhập để vào trang Quản lý sự kiện!");
            navigate("/login");
            return;
        }
        
        const user = JSON.parse(userString);
        fetchEvents(user.id); // Truyền ID của user đang đăng nhập vào hàm
    }, [navigate]);

    const fetchEvents = async (userId) => {
        try {
            // LỌC BẢO MẬT: Chỉ lấy các sự kiện có createdBy trùng với ID của user
            const response = await axios.get(`http://localhost:5000/api/events/organizer/${userId}`);
            setEvents(response.data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
        }
    };

    // Hàm thực thi khi bấm nút XÓA
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này không? Hành động này không thể hoàn tác.")) {
            try {
                // Gọi API Xóa xuống Backend
                await axios.delete(`http://localhost:5000/api/events/${id}`);
                
                // Cập nhật lại giao diện ngay lập tức
                setEvents(events.filter(event => event._id !== id));
                alert("Đã xóa sự kiện thành công!");
            } catch (error) {
                console.error("Lỗi khi xóa:", error);
                alert("Không thể xóa sự kiện lúc này.");
            }
        }
    };

    return (
        <div className="container mt-4 text-white">
            <h2 className="mb-4 text-mint">My Events (Dashboard)</h2>
            
            <div className="card card-dark p-4 shadow-lg border-0">
                {events.length === 0 ? (
                    <p className="text-center mt-3 fs-5">Bạn chưa tạo sự kiện nào trên hệ thống.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-dark table-hover align-middle">
                            <thead>
                                <tr className="text-mint">
                                    <th>Hình ảnh</th>
                                    <th>Tên sự kiện</th>
                                    <th>Ngày tổ chức</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map(event => (
                                    <tr key={event._id}>
                                        <td>
                                            <img 
                                                src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"} 
                                                alt="thumbnail" 
                                                style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "5px" }} 
                                            />
                                        </td>
                                        <td className="fw-bold">{event.title}</td>
                                        <td>{event.date}</td>
                                        <td>
                                            {/* Nút Xem Chi Tiết */}
                                            <Link to={`/event/${event._id}`} className="btn btn-sm btn-outline-info me-2">
                                                Xem
                                            </Link>
                                            {/* Nút Sửa */}
                                            <Link to={`/edit/${event._id}`} className="btn btn-sm btn-warning me-2">
                                                Sửa
                                            </Link>
                                            {/* Nút Xóa */}
                                            <button 
                                                onClick={() => handleDelete(event._id)} 
                                                className="btn btn-sm btn-danger"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyEvents;