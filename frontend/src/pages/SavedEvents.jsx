import { useState, useEffect } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";
import { Link } from "react-router-dom";

function SavedEvents() {
    const [saved, setSaved] = useState([]);
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:5000/api/saved-events/${user.id}`)
                .then(res => setSaved(res.data))
                .catch(err => console.error(err));
        }
    }, [user]);

    if (!user) return <h3 className="text-white text-center mt-5">Vui lòng đăng nhập</h3>;

    return (
        <div className="container mt-5 pb-5">
            <h2 className="fw-bold text-danger mb-4">❤️ Sự Kiện Đã Lưu</h2>
            {saved.length === 0 ? (
                <div className="text-center text-secondary mt-5">
                    <h4>Danh sách trống.</h4>
                    <Link to="/" className="btn btn-outline-mint mt-3">Khám phá sự kiện</Link>
                </div>
            ) : (
                <div className="row">
                    {saved.map(item => (
                        <div className="col-md-3 mb-4" key={item._id}>
                            {/* Dùng lại thẻ EventCard siêu xịn của bạn */}
                            {item.event && <EventCard event={item.event} />} 
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
export default SavedEvents;