import { useState, useEffect } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";

const categories = [
    { name: "Music", icon: "🎤" }, { name: "Nightlife", icon: "🪩" },
    { name: "Arts", icon: "🎭" }, { name: "Holidays", icon: "🏖️" },
    { name: "Dating", icon: "❤️" }, { name: "Hobbies", icon: "🎮" },
    { name: "Business", icon: "💼" }, { name: "Food & Drink", icon: "🍕" },
];

function Home() {
    const [events, setEvents] = useState([]);
    
    // States cho bộ lọc
    const [searchName, setSearchName] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [activeCategory, setActiveCategory] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/api/events")
            .then((res) => setEvents(res.data))
            .catch((err) => console.error("Lỗi tải sự kiện:", err));
    }, []);

    // HÀM LỌC BAO CHUẨN ĐÃ NÂNG CẤP
    const filteredEvents = events.filter(event => {
        const title = event.title ? event.title.toLowerCase().trim() : "";
        const location = event.location ? event.location.toLowerCase().trim() : "";
        const eventCat = event.category ? event.category.toLowerCase().trim() : "music"; 
        const eventDate = event.date ? event.date.trim() : "";

        const searchN = searchName.toLowerCase().trim();
        const searchL = searchLocation.toLowerCase().trim();
        const searchD = searchDate.trim();
        const activeC = activeCategory.toLowerCase().trim();

        const matchName = searchN === "" ? true : title.includes(searchN);
        const matchLoc = searchL === "" ? true : location.includes(searchL);
        const matchDate = searchD === "" ? true : eventDate === searchD;
        const matchCat = activeC === "" ? true : eventCat === activeC;

        return matchName && matchLoc && matchDate && matchCat;
    });

    return (
        <div style={{ backgroundColor: "#121212", minHeight: "100vh" }}>
            <div className="bg-dark text-white text-center py-5 border-bottom border-secondary">
                <div className="container">
                    <h1 className="display-4 fw-bold mb-4 text-mint">Find your next event</h1>
                    <div className="row justify-content-center">
                        <div className="col-md-10">
                            
                            {/* THANH TÌM KIẾM (ĐÃ NÂNG CẤP UI/UX) */}
                            <div className="card bg-dark border-secondary shadow-lg p-3 rounded-4 mt-3 text-start">
                                <div className="row g-3">
                                    {/* Ô 1: Tìm theo tên */}
                                    <div className="col-md-4">
                                        <label className="form-label text-mint fw-bold mb-1 small">Looking for</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-secondary border-secondary text-white">🔍</span>
                                            <input 
                                                type="text" 
                                                className="form-control bg-dark text-white border-secondary" 
                                                placeholder="VD: Workshop, Lễ hội..." 
                                                value={searchName} 
                                                onChange={(e) => setSearchName(e.target.value)} 
                                            />
                                        </div>
                                    </div>

                                    {/* Ô 2: Tìm theo địa điểm */}
                                    <div className="col-md-4">
                                        <label className="form-label text-mint fw-bold mb-1 small">Location</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-secondary border-secondary text-white">📍</span>
                                            <input 
                                                type="text" 
                                                className="form-control bg-dark text-white border-secondary" 
                                                placeholder="VD: Hồ Chí Minh..." 
                                                value={searchLocation} 
                                                onChange={(e) => setSearchLocation(e.target.value)} 
                                            />
                                        </div>
                                    </div>

                                    {/* Ô 3: Tìm theo ngày */}
                                    <div className="col-md-3">
                                        <label className="form-label text-mint fw-bold mb-1 small">When</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-secondary border-secondary text-white">📅</span>
                                            <input 
                                                type="date" 
                                                className="form-control bg-dark text-white border-secondary" 
                                                value={searchDate} 
                                                onChange={(e) => setSearchDate(e.target.value)} 
                                            />
                                        </div>
                                    </div>

                                    {/* Ô 4: Nút Xóa bộ lọc */}
                                    <div className="col-md-1 d-flex align-items-end">
                                        <button 
                                            className="btn btn-outline-danger w-100 fw-bold" 
                                            style={{ height: "38px" }} 
                                            onClick={() => { setSearchName(""); setSearchLocation(""); setSearchDate(""); }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="container mt-5">
                {/* DẢI CATEGORY */}
                <div className="d-flex justify-content-between overflow-auto mb-5 pb-2" style={{ scrollbarWidth: "none" }}>
                    {categories.map((cat, index) => (
                        <div 
                            key={index} 
                            className="text-center mx-3" 
                            style={{ cursor: "pointer", minWidth: "80px", opacity: activeCategory === cat.name ? 1 : 0.5 }}
                            onClick={() => setActiveCategory(activeCategory === cat.name ? "" : cat.name)}
                        >
                            <div className="rounded-circle d-flex align-items-center justify-content-center border border-secondary mb-2 mx-auto" 
                                 style={{ width: "70px", height: "70px", fontSize: "2rem", backgroundColor: activeCategory === cat.name ? "#00ffcc" : "transparent" }}>
                                {cat.icon}
                            </div>
                            <span className={`fw-bold ${activeCategory === cat.name ? "text-mint" : "text-white"}`}>{cat.name}</span>
                        </div>
                    ))}
                </div>

                <h3 className="fw-bold text-white mb-4">
                    {activeCategory ? `Sự kiện ${activeCategory}` : "Tất cả sự kiện (Trending)"}
                </h3>
                
                {/* HIỂN THỊ KẾT QUẢ ĐÃ LỌC */}
                <div className="row">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map(event => (
                            <div className="col-md-3 mb-4" key={event._id}>
                                <EventCard event={event} />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center text-secondary py-5">
                            <h4>Không tìm thấy sự kiện nào phù hợp với bộ lọc của bạn.</h4>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;