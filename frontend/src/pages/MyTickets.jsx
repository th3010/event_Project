import { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";

function MyTickets() {
    const [tickets, setTickets] = useState([]);
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:5000/api/bookings/my-tickets/${user.id}`)
                .then(response => setTickets(response.data))
                .catch(error => console.error("Lỗi tải vé:", error));
        }
    }, []);

    if (!user) {
        return <div className="text-center mt-5 text-white h4">Vui lòng đăng nhập để xem vé!</div>;
    }

    return (
        <div className="container mt-5 text-white">
            <h2 className="fw-bold text-mint mb-4">🎫 Vé Sự Kiện Của Tôi</h2>
            
            {tickets.length === 0 ? (
                <div className="card card-dark p-5 text-center shadow-lg border-0">
                    <h4 className="text-secondary">Bạn chưa đặt vé nào cả.</h4>
                    <Link to="/" className="btn btn-mint mt-3 w-25 mx-auto">Khám phá sự kiện</Link>
                </div>
            ) : (
                <div className="row">
                    {tickets.map((ticket) => (
                        <div className="col-md-6 mb-4" key={ticket._id}>
                            <div className="card card-dark border-mint shadow-lg flex-row overflow-hidden">
                                {/* Phần Mã QR (Bên trái) */}
                                <div className="bg-white p-3 d-flex flex-column justify-content-center align-items-center" style={{ width: "35%" }}>
                                    {/* Sinh mã QR độc nhất dựa trên ID của hóa đơn */}
                                    <QRCode value={ticket._id} size={120} />
                                    <small className="text-dark mt-2 fw-bold text-center">Mã Check-in <br/> {ticket._id.substring(0,6).toUpperCase()}</small>
                                </div>
                                
                                {/* Phần Thông tin vé (Bên phải) */}
                                <div className="card-body d-flex flex-column justify-content-center" style={{ width: "65%" }}>
                                    {ticket.event ? (
                                        <>
                                            <h5 className="card-title fw-bold text-mint mb-3">{ticket.event.title}</h5>
                                            <p className="mb-1 text-light"><i className="me-2">📅</i> {ticket.event.date}</p>
                                            <p className="mb-2 text-light"><i className="me-2">📍</i> {ticket.event.location}</p>
                                            <div className="mt-3 p-2 border border-secondary rounded text-center">
                                                <span className="fs-5 fw-bold text-warning">{ticket.tickets} Vé</span>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-danger">Sự kiện này đã bị ban tổ chức xóa.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyTickets;