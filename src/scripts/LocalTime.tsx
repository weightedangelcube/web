import { useEffect, useState } from "react"
import { Temporal } from "temporal-polyfill"

export default function LocalTime() {
    const [time, setTime] = useState("")
    const [timezone, setTimezone] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setInterval(() => {
            setTime(Temporal.Now.zonedDateTimeISO("America/Edmonton").toPlainDateTime().toLocaleString("en-CA", { hourCycle: "h24" }))
            setLoading(false);

            setTimezone("UTC" + Temporal.Now.zonedDateTimeISO("America/Edmonton").offset)

        }, 1000)
    })

    if (loading) return;

    return (
        <p className="local-time">{time} <sup>{timezone}</sup></p>
    )
    
}