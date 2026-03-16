import { Link } from "react-router-dom";

function Navbar(){
    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    EventHub
                </Link>
                <div>
                    <Link className="btn btn-outline-light me-2" to="/">
                        Home
                    </Link>
                    <Link className="btn btn-outline-light me-2" to="/create">
                        Create Event
                    </Link>
                    <Link className="btn btn-outline-light me-2" to="/my-events">
                        My Events
                    </Link>
                    <Link className="btn btn-light" to="/login">
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    )
}
export default Navbar