import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import './EventDetail.css';

function EventDetail() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [relatedEvents, setRelatedEvents] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    
    // STATE: Quản lý trạng thái xem user đã lưu sự kiện này chưa
    const [isSaved, setIsSaved] = useState(false);

    // Lấy thông tin user
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;
    
    const userId = user ? user.id : null;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const resEvent = await axios.get(`http://localhost:5000/api/events/${id}`);
                setEvent(resEvent.data);

                const resRelated = await axios.get(`http://localhost:5000/api/events-related/${resEvent.data._id}`);
                setRelatedEvents(resRelated.data);

                if (userId) {
                    const checkSaved = await axios.get(`http://localhost:5000/api/saved-events/check/${userId}/${id}`);
                    setIsSaved(checkSaved.data.isSaved);
                }

                setTimeout(() => {
                    setLoading(false);
                }, 400);

            } catch (err) {
                console.error("Lỗi gọi API:", err);
                setLoading(false); 
            }
        };

        fetchData();
        
    }, [id, userId]); 

    const handleSaveEvent = async () => {
        if (!user) { 
            toast.warning("Vui lòng đăng nhập để lưu sự kiện!"); 
            navigate('/login'); 
            return; 
        }
        try {
            const res = await axios.post("http://localhost:5000/api/saved-events", { 
                userId: user.id, 
                eventId: event._id 
            });
            setIsSaved(res.data.isSaved); 
            toast.success(res.data.isSaved ? "Đã lưu vào danh sách yêu thích!" : "Đã bỏ lưu sự kiện!");
        } catch (err) {
            toast.error("Lỗi khi lưu sự kiện.");
        }
    };

    // MÀN HÌNH CHỜ (LOADING)
    if (loading) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center bg-dark" style={{ minHeight: "80vh" }}>
                <div className="spinner-border text-mint mb-3" role="status" style={{ width: "3rem", height: "3rem" }}></div>
                <h5 className="text-white fw-bold">Đang tải dữ liệu...</h5>
            </div>
        );
    }

    if (!event) return <div className="text-center mt-5 h3 text-danger">Không tìm thấy sự kiện.</div>;

    return (
        <div className="event-detail-container bg-dark text-white">
            <div className="event-header-bg" style={{ backgroundImage: `url(${event.imageUrl || 'https://via.placeholder.com/1600x900'})` }}>
                <div className="event-header-overlay p-5 d-flex align-items-end">
                    <div className="container">
                        <img src={event.imageUrl || 'https://via.placeholder.com/300x200'} alt="event cover" className="img-fluid rounded shadow-lg event-main-img" />
                    </div>
                </div>
            </div>

            <div className="container my-5 pb-5">
                <div className="row">
                    <div className="col-md-8 pe-md-5">
                        <h1 className="fw-bold mb-4">{event.title}</h1>

                        {/* BAN TỔ CHỨC (Đã xóa ảnh lỗi, chỉ để lại chữ) */}
                        <div className="mb-5 border-bottom border-secondary pb-4">
                            <p className="mb-0 text-secondary fs-5">By <strong className="text-white">{event.organizerName || "EventHub Organizer"}</strong></p>
                        </div>

                        <section className="mb-5">
                            <h2 className="fw-bold mb-4">Overview</h2>
                            <p className="fs-5 text-light" style={{ whiteSpace: 'pre-line' }}>
                                {event.description 
                                    ? (isExpanded ? event.description : event.description.slice(0, 150) + (event.description.length > 150 ? "..." : "")) 
                                    : "Hãy tham gia cùng chúng tôi trong sự kiện tuyệt vời này. Đừng bỏ lỡ cơ hội trải nghiệm và kết nối!"}
                            </p>
                            
                            {event.description && event.description.length > 150 && (
                                <span 
                                    className="text-info fw-bold" 
                                    style={{ cursor: 'pointer' }} 
                                    onClick={() => setIsExpanded(!isExpanded)}
                                >
                                    {isExpanded ? "Show less ⏶" : "Read more ⏷"}
                                </span>
                            )}
                        </section>

                        <section className="mb-5 p-4 rounded bg-secondary-dark border border-secondary">
                            <h3 className="fw-bold mb-4">Good to know</h3>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <h5 className="fw-bold text-mint">Highlights</h5>
                                    <ul className="list-unstyled text-light">
                                        <li>⏱️ Duration: 3 hours</li>
                                        <li>🌐 Hình thức: Sự kiện có vé điện tử</li>
                                    </ul>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <h5 className="fw-bold text-mint">Refund Policy</h5>
                                    <p className="text-light">Refunds up to <strong>7 days</strong> before event</p>
                                </div>
                            </div>
                        </section>

                        {event.agenda && event.agenda.length > 0 && (
                            <section className="mb-5">
                                <h3 className="fw-bold mb-4">Agenda</h3>
                                <div className="agenda-list">
                                    {event.agenda.map((item, index) => (
                                        <div key={index} className="agenda-item d-flex mb-3 border-bottom border-secondary pb-3 align-items-center">
                                            <div className="agenda-time fw-bold text-mint me-4" style={{ minWidth: "150px" }}>{item.time}</div>
                                            <div className="agenda-title fs-5 text-white">{item.title}</div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className="mb-5 border-top border-secondary pt-4">
                            <h3 className="fw-bold mb-4">Location</h3>
                            <div className="row">
                                <div className="col-md-5 mb-4">
                                    <h5 className="fw-bold mb-1 text-mint">{event.location}</h5>
                                    <p className="text-secondary mb-4">Vietnam</p>
                                    
                                    <h6 className="fw-bold mb-3">How do you want to get there?</h6>
                                    <ul className="list-unstyled">
                                        <li className="mb-3 fs-5">🚗 Driving</li>
                                        <li className="mb-3 fs-5">🚌 Public transport</li>
                                        <li className="mb-3 fs-5">🚲 Biking</li>
                                        <li className="mb-3 fs-5">🚶 Walking</li>
                                    </ul>
                                </div>
                                
                                <div className="col-md-7">
                                    <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "12px", height: "300px" }}>
                                        <iframe 
                                            title="google-map"
                                            width="100%" 
                                            height="100%" 
                                            style={{ border: 0 }} 
                                            allowFullScreen="" 
                                            loading="lazy" 
                                            referrerPolicy="no-referrer-when-downgrade"
                                            src={`https://maps.google.com/maps?q=${encodeURIComponent(event.location || "Ho Chi Minh City")}&output=embed`}
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="col-md-4">
                        <div className="sticky-top pt-2" style={{ top: '80px', zIndex: 10 }}>
                            <div className="card bg-secondary-dark text-white border-secondary shadow-lg p-4 mb-4">
                                <h4 className="text-center fw-bold text-mint mb-3">Register Now</h4>
                                <p className="mb-1"><strong>Date:</strong> {event.date}</p>
                                <p className="mb-3"><strong>Location:</strong> {event.location}</p>
                                <hr className="border-secondary"/>
                                <h3 className="text-center my-3 fw-bold">{event.price === 0 ? "Free" : "CÓ PHÍ"}</h3>
                                
                                <button 
                                    onClick={handleSaveEvent}
                                    className={`btn btn-lg w-100 fw-bold fs-5 p-3 mb-3 ${isSaved ? 'btn-danger' : 'btn-outline-danger'}`}
                                >
                                    {isSaved ? "💔 Bỏ lưu sự kiện" : "❤️ Lưu sự kiện"}
                                </button>

                                <button 
                                    onClick={() => user ? navigate(`/checkout/${event._id}`) : navigate('/login')} 
                                    className="btn btn-mint btn-lg w-100 fw-bold fs-5 p-3"
                                >
                                    Register Now
                                </button>
                                
                            </div>
                            <div className="text-center text-secondary">
                                <span 
                                    className="text-decoration-none text-secondary small" 
                                    style={{cursor: 'pointer'}}
                                    onClick={() => toast.warning("Cảm ơn bạn! Hệ thống đã ghi nhận báo cáo vi phạm.")}
                                >
                                    Report this event 🚩
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {relatedEvents.length > 0 && (
                    <div className="related-events-section mt-5 pt-5 border-top border-secondary">
                        <h3 className="fw-bold mb-4">You might also like...</h3>
                        <div className="row">
                            {relatedEvents.map(relEvent => (
                                <div className="col-md-4 col-sm-6 mb-4" key={relEvent._id}>
                                    <div className="card bg-dark text-white border-secondary h-100 shadow">
                                        <img src={relEvent.imageUrl || 'https://via.placeholder.com/300'} className="card-img-top" alt="related" style={{height: "180px", objectFit: "cover"}} />
                                        <div className="card-body">
                                            <h5 className="card-title fw-bold">{relEvent.title}</h5>
                                            <p className="card-text text-secondary">{relEvent.date} • {relEvent.location}</p>
                                            <Link to={`/event/${relEvent._id}`} className="btn btn-outline-mint btn-sm">View</Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventDetail;