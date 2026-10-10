import { useEffect, useState } from "preact/hooks"

interface Game {
    name: string,
    url?: string
}

async function getJSON<T>(url: string): Promise<T | undefined> {
    try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        return (await res.json()) as T
    } catch {
        return undefined
    }
}

export default function SteamNowPlaying() {
    const [game, setGame] = useState<Game>()

    useEffect(() => {
        const fetchData = async () => {
            const gameData = await getJSON<Game>("/api/steam")
            if (!gameData) return
            setGame(gameData)
        }
        fetchData()
    }, [])

    if (!game) return null

    return (
        <span>
            NOW PLAYING − <MaybeLink href={game.url}>{game.name}</MaybeLink>{" "}
            on Steam [<a href="https://steamcommunity.com/profiles/76561199245582776">↗</a>] {" · "}
        </span>
    )
}

function MaybeLink({ href, children }: { href?: string; children: any }) {
    return href ? <a href={href}>{children}</a> : <>{children}</>
}