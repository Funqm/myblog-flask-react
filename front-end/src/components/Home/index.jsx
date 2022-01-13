import Alert from "../Alter"
import { useState } from "react"

const temp = [
    {
        showAlert: true,
        alertVariant: 'danger',
        alertMessage: 0
    },
    {
        showAlert: true,
        alertVariant: 'info',
        alertMessage: 1
    },
    {
        showAlert: true,
        alertVariant: 'dark',
        alertMessage: 2
    }
]
export default function Home() {
    const [alerts, setAlerts] = useState([...temp]);
    const alertItems = alerts.map((item, index)=><Alert message={item.alertMessage} variant={item.alertVariant} key={index}></Alert>)
    return (
        <div className="container">
        {alertItems}
        </div>
    )
}