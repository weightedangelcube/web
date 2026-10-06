import { Fragment } from "preact"
import { useEffect, useState } from "preact/hooks"

interface ArtistCredit {
    artist_credit_name: string;
    artist_mbid: string;
    join_phrase: string;
}

interface TrackMetadata {
    track_name: string,
    release_name: string,
    mbid_mapping: {
        artists: ArtistCredit[],
        recording_mbid: string,
        release_mbid: string,
    }
}

export default function LBPinned() {
    const [data, setData] = useState<TrackMetadata>()

    useEffect(() => {
        const fetchData = async () => {
            const rq = await fetch("https://api.listenbrainz.org/1/angelcube/pins/current")
            if (!rq.ok) return;
            const track = await rq.json().then(json => json.pinned_recording ? json.pinned_recording.track_metadata : null) as TrackMetadata
            if (!track) return;

            setData(track)
        }
        fetchData()
    }, [])

    if (!data) return null

    return (<p id="favourite-song">
        My favourite song right now is{" "}
        <a href={makeLBURL(`/track/${data.mbid_mapping.recording_mbid}`)}>{data.track_name}</a>{" "}
        by <ArtistCredits artists={data.mbid_mapping.artists} />. [<a href={makeLBURL("/user/angecube")}>↗</a>]
    </p>)
}

function ArtistCredits({ artists }: { artists: ArtistCredit[] }) {
    return (
        <>
            {artists.map((artist) => (
                <Fragment key={artist.artist_mbid}>
                    <a href={makeLBURL(`/artist/${artist.artist_mbid}`)}>
                        {artist.artist_credit_name}
                    </a>
                    {artist.join_phrase}
                </Fragment>
            ))}
        </>
    )
}

function makeLBURL(slug: string) {
    return `https://listenbrainz.org${slug}`
}

