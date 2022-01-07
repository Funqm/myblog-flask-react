import axios from 'axios'
import React, {useState, useEffect } from 'react'



function Ping(){
    const [msg, setMsg] = useState('');
    useEffect(()=>{
        const getMessage = () =>{
            const path = "http://localhost:5000/api/ping";
            axios.get(path)
            .then((res) => {
                setMsg(res.data);
            })
            .catch((err) => {
                console.error(err);
            })
        }
        getMessage();
    })
    return(
        <div>
            <p>{msg}</p>
        </div>
    )
}

export default Ping;