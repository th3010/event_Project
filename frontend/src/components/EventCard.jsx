import { Link } from "react-router-dom";

function EventCard({ event }) {
    return (
        <div className="card card-dark shadow-sm mb-4 h-100 border-0 overflow-hidden">
            {/* HIỂN THỊ ẢNH Ở ĐÂY */}
            <img 
                src={event.imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"} 
                className="card-img-top" 
                alt={event.title} 
                style={{ height: "200px", objectFit: "cover" }} 
            />
            <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold text-mint">{event.title}</h5>
                <p className="card-text mb-1 text-secondary">📅 {event.date}</p>
                <p className="card-text mb-3 text-secondary">📍 {event.location}</p>
                <Link to={`/event/${event._id}`} className="btn btn-outline-mint mt-auto">
                    View Details
                </Link>
            </div>
        </div>
    );
}
export default EventCard;