import { useEffect, useState } from "react"
import { Temporal } from "temporal-polyfill"

export default function LocalTime() {
    const [time, setTime] = useState("")

    useEffect(() => {
        setInterval(() => {
            setTime(Temporal.Now.zonedDateTimeISO("America/Edmonton").toLocaleString())
        }, 1000)
    })

    return (
        <p className="local-time">{time}</p>
    )
    
}