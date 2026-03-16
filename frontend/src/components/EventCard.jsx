import { Link } from "react-router-dom";

function EventCard({event}){
    return(
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h5 className="card-title">{event.title}</h5>
                <p className="card-text">
                    📅 {event.date}
                </p>
                <p className="card-text">
                    📍 {event.location}
                </p>
                <Link to={`/event/${event.id}`}className="btn btn-primary">
                    View Details
                </Link>
            </div>
        </div>
    )
}
export default EventCard