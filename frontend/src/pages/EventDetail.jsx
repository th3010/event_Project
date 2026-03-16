import { useParams } from "react-router-dom";
import { events } from "../services/eventService";

function EventDetail(){
    const {id} = useParams()
    const event = events.find(e => e.id == id)
    return(
        <div className="container mt-4">
            <h2>{event.title}</h2>
            <p>Date: {event.date}</p>
            <p>Location: {event.location}</p>
            <button className="btn btn-success">
                Register
            </button>
        </div>
    )
}
export default EventDetail