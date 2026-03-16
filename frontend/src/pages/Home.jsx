import { useState } from "react";
import EventCard from "../components/EventCard";
import { events } from "../services/eventService";

function Home(){
    const [search,setSearch] = useState("");
    const filteredEvents = events.filter(event =>
            event.title.toLowerCase().includes(search.toLowerCase())
        )
    return(
        <div>
            <div className="bg-primary text-white text-center py-5 mb-4 ">
                <div className="container">
                    <h1 className="display-5">Find your next event</h1>
                    <p>Discover concerts, conferences and more</p>
                </div>
            </div>
            <div className="container mt-4">
                <h2 className="mb-4">Discover Events</h2>
                <input
                    className="form-control mb-4"
                    placeholder="Search events"
                    onChange={(e)=>setSearch(e.target.value)}
                />
                <div className="row">
                    {filteredEvents.map(event => (
                        <div className="col-md-4" key={event.id}>
                            <EventCard event={event}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default Home