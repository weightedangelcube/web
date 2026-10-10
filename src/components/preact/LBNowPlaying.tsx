import { Fragment } from "preact"
import { useEffect, useState } from "preact/hooks"

interface LBTrack {
    track_name: string
    release_name?: string
    artist_name: string
}

interface MBArtistCredit {
    joinphrase?: string
    name: string
    artist: { id: string }
}

interface MBReleaseGroup {
    id: string
    title: string
}

interface MBRecording {
    id: string
    title: string
    "artist-credit": MBArtistCredit[]
    releases?: { "release-group"?: MBReleaseGroup }[]
}

interface Song {
    title: string
    url?: string
    artists: ArtistCredit[]
    release?: { title: string; url?: string }
}

interface ArtistCredit {
    joinphrase?: string
    name: string
    url?: string
}

const makeLBURL = (slug: string) => `https://listenbrainz.org${slug}`

async function getJSON<T>(url: string): Promise<T | undefined> {
    try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        return (await res.json()) as T
    } catch {
        return undefined
    }
}

export default function LBNowPlaying() {
    const [song, setSong] = useState<Song>()

    useEffect(() => {
        const fetchData = async () => {
            const rawData = await fetchListenData()
            if (!rawData) return
            const rid = await labsLookup(rawData.track_name, rawData.artist_name)
            const trackData = rid ? await mbLookup(rid) : undefined
            if (!trackData) {
                setSong(lbToSong(rawData))
            } else {
                setSong(mbToSong(trackData))
            }
        }
        fetchData()
    }, [])

    if (!song) return null

    return (
        <span>
            NOW LISTENING TO −{" "}
            <MaybeLink href={song.url}>{song.title}</MaybeLink>{" "}
            by <ArtistCredits artists={song.artists} />
            {song.release && (
                    <>
                        {" "}on <MaybeLink href={song.release.url}>{song.release.title}</MaybeLink>
                    </>
            )} [<a href={makeLBURL("/user/angelcube")}>↗</a>] {" • "}
        </span>
    )
}


function MaybeLink({ href, children }: { href?: string; children: any }) {
    return href ? <a href={href}>{children}</a> : <>{children}</>
}


function ArtistCredits({ artists }: { artists: ArtistCredit[] }) {
    return (
        <>
            {artists.map((artist, i) => (
                <Fragment key={`${artist.name}-${i}`}>
                    <MaybeLink href={artist.url}>{artist.name}</MaybeLink>
                    {artist.joinphrase}
                </Fragment>
            ))}
        </>
    )
}

async function fetchListenData(): Promise<LBTrack | undefined> {
    const res = await getJSON<any>(
        `https://api.listenbrainz.org/1/user/angelcube/playing-now`
    )
    return res?.payload?.listens?.[0]?.track_metadata
}

async function labsLookup(name: string, artist: string) {
    const params = new URLSearchParams({ query: `${name} - ${artist}` })
    const res = await getJSON<any[]>(
        `https://labs.api.listenbrainz.org/recording-search/json?${params}`
    )
    return res?.[0]?.recording_mbid
}

async function mbLookup(rid: string) {
    const params = new URLSearchParams({ fmt: "json", limit: "1", query: `rid:${rid}` })
    const res = await getJSON<{ recordings?: MBRecording[] }>(
        `https://musicbrainz.org/ws/2/recording/?${params}`
    )
    return res?.recordings?.[0]
}

function mbToSong(mb: MBRecording): Song {
    const rg = mb.releases?.[0]["release-group"] 
    const artists = mb["artist-credit"].map(artistCredit => {
        return { 
            joinphrase: artistCredit.joinphrase,
            name: artistCredit.name,
            url: makeLBURL(`/artist/${artistCredit.artist.id}`)
        }
    })
    return {
        title: mb.title,
        url: makeLBURL(`/track/${mb.id}`),
        artists,
        release: rg ? { title: rg.title, url: makeLBURL(`/album/${rg.id}`)} : undefined
    }
}

function lbToSong(lb: LBTrack): Song {
    return {
        title: lb.track_name,
        artists: [{ name: lb.artist_name }],
        release: lb.release_name ? { title: lb.release_name } : undefined
    }   
}