import { events } from "../services/eventService";

function MyEvents(){
    return(
        <div className="container mt-4">
            <h2>My Events</h2>
            {events.map(event => (
                <div key={event.id}>
                    <h5>{event.title}</h5>
                    <button className="btn btn-danger">
                        Delete
                    </button>
                </div>
            ))}
        </div>
    )
}

export default MyEvents