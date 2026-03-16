import { useState } from "react";

function CreateEvent(){
    const [title,setTitle] = useState("")
    const [date,setDate] = useState("")
    const [location,setLocation] = useState("")
    const handleSubmit = (e)=>{
        e.preventDefault()
        if(title === "" || date === "" || location === ""){
            alert("All fields required")
            return
        }
        alert("Event created")
    }
    return(
        <div className="container mt-4">
            <h2>Create Event</h2>
            <form onSubmit={handleSubmit}>
                <input
                    className="form-control mb-2"
                    placeholder="Title"
                    onChange={(e)=>setTitle(e.target.value)}
                />
                <input
                    type="date"
                    className="form-control mb-2"
                    onChange={(e)=>setDate(e.target.value)}
                />
                <input
                    className="form-control mb-2"
                    placeholder="Location"
                    onChange={(e)=>setLocation(e.target.value)}
                />
                <button className="btn btn-primary">
                    Create
                </button>
            </form>
        </div>
    )
}
export default CreateEvent