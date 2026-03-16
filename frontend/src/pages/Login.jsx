import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Login(){
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const navigate = useNavigate()
    const handleSubmit = (e)=>{
        e.preventDefault()
        if(email === "" || password === ""){
            alert("Fill all fields")
        }
        alert("Login successful!");
        navigate("/");
    }
    return(
        <div className="container mt-4">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    className="form-control mb-2"
                    placeholder="Email"
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Password"
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <button className="btn btn-primary">
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login