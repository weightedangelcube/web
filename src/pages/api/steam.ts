import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false
const STEAM_ID = "76561199245582776"

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

export const GET = (async () => {
    const res = await getJSON<any>(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${env.STEAM_API_KEY}&steamids=${STEAM_ID}`
    ).then(json => json?.response?.players[0])

    if (!res || !res.gameextrainfo) {
        return new Response(null, {
            status: 204,
            statusText: "No data"
        })
    }

    const gameStatus = { 
        name: res.gameextrainfo, 
        url: res.gameid 
            ? `https://store.steampowered.com/app/${res.gameid}` 
            : undefined
    } as Game

    return new Response(JSON.stringify(gameStatus), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    })
}) satisfies APIRoute;