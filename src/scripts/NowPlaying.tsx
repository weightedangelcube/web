import { useEffect, useState } from "react";

interface TrackData {
    name: string;
    album: string;
    artist: string;
    URL: string;
    coverArtURL?: string;
}

async function fetchTrackData() {
    let trackData : TrackData = {
        name: "Unknown",
        album: "Unknown",
        artist: "Unknown",
        URL: "",
    }

    const listenResponse = await fetch("https://api.listenbrainz.org/1/user/angelcube/playing-now")
    if (!listenResponse.ok) throw `${listenResponse.status} ${listenResponse.statusText}`

    const listenJSON = await listenResponse.json()
    if (listenJSON.payload.count == 0) return
    const rawListenData = listenJSON.payload.listens[0].track_metadata

    trackData.name = rawListenData.track_name
    trackData.artist = rawListenData.artist_name
    trackData.album = rawListenData.release_name

    // this needs to be encoded separately—URLSearchParams encodes spaces as "+"
    let query = encodeURIComponent(`artist:"${rawListenData.artist_name}" AND recording:"${rawListenData.track_name}" ${!rawListenData.release_name ? "" : `AND release:"${rawListenData.release_name}"`}`)

    const metadataLookupParams = new URLSearchParams({
        fmt: "json",
        limit: "1"
    })
    const metadataLookupResponse = await fetch("https://musicbrainz.org/ws/2/recording/?" + metadataLookupParams + "&query=" + query, {
        headers: {"User-Agent": "angelcube's ListenBrainz widget/0.0.0 (https://angelcube.dev/)"}
    })
    const metadataLookupJSON = await metadataLookupResponse.json()

    if (metadataLookupJSON.recordings.length == 0) {
        return trackData
    }

    const metadataLookup = metadataLookupJSON.recordings[0]

    trackData.name = metadataLookup.title
    trackData.URL = "https://listenbrainz.org/track/" + metadataLookup.id

    trackData.artist = "" // reset this, we set it to Unknown before
    metadataLookup["artist-credit"].forEach((artistCredit) => {
        trackData.artist += artistCredit.name
        if (artistCredit.joinphrase != undefined) trackData.artist += artistCredit.joinphrase
    });

    // preemptively set this to the first release found
    trackData.album = metadataLookup.releases[0].title
    let releaseGroupMBID = metadataLookup.releases[0]["release-group"].id

    // then do a lookup
    metadataLookup.releases.forEach(release => {
        if (rawListenData.release_name == release.title) {
            trackData.album = release.title
            releaseGroupMBID = release["release-group"].id
        }
    });

    const coverArtResponse = await fetch(`https://coverartarchive.org/release-group/${releaseGroupMBID}`);
    if (coverArtResponse.ok) {
        const coverArtJSON = await coverArtResponse.json();
        trackData.coverArtURL = coverArtJSON?.images[0].thumbnails.small;
    }

    return trackData;
}

export default function NowPlaying() {
    const [data, setData] = useState({} as TrackData)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const handleFetch = async () => {
            const result = await fetchTrackData()
            setData(result)
            setLoading(false);
        }
        handleFetch()
    }, [])

    if (loading) {
        return (
            <div id="now-playing">
                <p><i>Loading...</i></p>
            </div>
        )
    }
    
    if (!data) { // listening to nothing
        return
    } else {
        return (
            <div id="now-playing">
                <p>
                    <span>Currently listening to </span>
                    {
                        URL
                        ? <img src={data.coverArtURL} />
                        : ""
                    }
                    <span> <b>{data.name}</b> by <b>{data.artist}</b> on <b>{data.album}</b>. </span>
                    <a href={data.URL} target="_blank">↗</a>
                </p>
            </div>
        )
    }


}