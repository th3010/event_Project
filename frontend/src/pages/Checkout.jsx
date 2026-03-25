import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Checkout() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [ticketCount, setTicketCount] = useState(1);

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        if (!user) {
            toast.warning("Bạn cần đăng nhập để mua vé!");
            navigate("/login");
            return;
        }
        
        axios.get(`http://localhost:5000/api/events/${id}`)
            .then((res) => setEvent(res.data))
            .catch(() => toast.error("Lỗi tải sự kiện!"));
    }, [id, navigate, user]);

    const handlePlaceOrder = async (e) => {
        e.preventDefault(); 
        try {
            await axios.post("http://localhost:5000/api/bookings", {
                userId: user.id,
                eventId: event._id,
                tickets: ticketCount
            });
            toast.success("🎉 Đặt vé thành công! E-Ticket đã được tạo.");
            navigate("/my-tickets"); 
        } catch (error) {
            toast.error("Lỗi khi xử lý thanh toán.");
        }
    };

    if (!event || !user) return <div className="text-center mt-5 text-white h4">Đang xử lý...</div>;

    // LOGIC TÍNH TIỀN THÔNG MINH ĐÃ ĐƯỢC NÂNG CẤP:
    const ticketPrice = event.price || 0; // Lấy giá từ DB, nếu không có thì bằng 0
    const isFree = ticketPrice === 0;
    const fee = isFree ? 0 : 15.06; // Nếu miễn phí thì phí = 0, nếu có phí thì thu thêm 15.06$
    const total = (ticketPrice * ticketCount) + fee;

    return (
        <div className="container mt-5 mb-5 text-dark" style={{ backgroundColor: "#f8f9fa", padding: "30px", borderRadius: "10px" }}>
            <h2 className="fw-bold mb-4">Checkout</h2>
            
            <div className="row">
                {/* CỘT TRÁI: THÔNG TIN THANH TOÁN */}
                <div className="col-md-8 pe-md-5">
                    <div className="card shadow-sm mb-4 border-0">
                        <div className="card-body d-flex align-items-center">
                            <img src={event.imageUrl || "https://via.placeholder.com/100"} alt="event" style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "8px" }} className="me-3" />
                            <div>
                                <h5 className="fw-bold mb-1">{event.title}</h5>
                                <p className="text-muted mb-0">{event.date} • {event.location}</p>
                            </div>
                        </div>
                    </div>

                    <h4 className="fw-bold mb-3">Billing information</h4>
                    <p>Logged in as <strong>{user.email}</strong>. <span className="text-primary text-decoration-underline" style={{cursor: "pointer"}} onClick={() => { localStorage.clear(); navigate('/login'); }}>Not you?</span></p>
                    
                    <form onSubmit={handlePlaceOrder}>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <label className="form-label text-muted">First name <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" defaultValue={user.name} required />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-muted">Last name <span className="text-danger">*</span></label>
                                <input type="text" className="form-control" defaultValue="Trần" required />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label text-muted">Email address <span className="text-danger">*</span></label>
                            <input type="email" className="form-control" defaultValue={user.email} required readOnly />
                        </div>

                        {/* NẾU LÀ SỰ KIỆN MIỄN PHÍ THÌ ẨN THẺ TÍN DỤNG ĐI */}
                        {!isFree && (
                            <>
                                <h4 className="fw-bold mb-3">Pay with</h4>
                                <div className="card border-primary mb-4">
                                    <div className="card-body">
                                        <div className="form-check mb-3">
                                            <input className="form-check-input" type="radio" name="payment" id="creditCard" defaultChecked />
                                            <label className="form-check-label fw-bold" htmlFor="creditCard">
                                                💳 Credit or debit card
                                            </label>
                                        </div>
                                        <input type="text" className="form-control mb-2" placeholder="Card number (1234 5678 9101 1121)" required />
                                        <div className="row">
                                            <div className="col-6">
                                                <input type="text" className="form-control" placeholder="MM/YY" required />
                                            </div>
                                            <div className="col-6">
                                                <input type="text" className="form-control" placeholder="CVV" required />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <button type="submit" className="btn btn-danger btn-lg w-100 fw-bold">
                            {isFree ? "Register for Free" : "Place Order"}
                        </button>
                    </form>
                </div>

                {/* CỘT PHẢI: HOÁ ĐƠN (BILL) */}
                <div className="col-md-4">
                    <img src={event.imageUrl || "https://via.placeholder.com/300"} alt="banner" className="img-fluid rounded mb-4 shadow-sm" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
                    
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="fw-bold mb-4">Order summary</h5>
                            
                            <div className="d-flex justify-content-between mb-3 align-items-center">
                                <div className="d-flex align-items-center">
                                    <input type="number" className="form-control form-control-sm me-2" style={{width: "60px"}} value={ticketCount} min="1" onChange={(e) => setTicketCount(Number(e.target.value))} />
                                    <span>x General Admission</span>
                                </div>
                                <span>{isFree ? "$0.00" : `$${(ticketPrice * ticketCount).toFixed(2)}`}</span>
                            </div>
                            
                            <hr />
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Subtotal</span>
                                <span>{isFree ? "$0.00" : `$${(ticketPrice * ticketCount).toFixed(2)}`}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Fees</span>
                                <span>{isFree ? "$0.00" : `$${fee.toFixed(2)}`}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-muted">Delivery</span>
                                <span>$0.00</span>
                            </div>
                            <hr />
                            
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <h4 className="fw-bold mb-0">Total</h4>
                                <h4 className="fw-bold mb-0">{isFree ? "Free" : `$${total.toFixed(2)}`}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;