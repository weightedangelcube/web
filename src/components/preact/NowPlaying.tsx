import SteamNowPlaying from "./SteamNowPlaying"
import LBNowPlaying from "./LBNowPlaying"
import "../../styles/components/now_playing.scss"

const REPEATS = 8

export default function NowPlaying() {
    const steam = SteamNowPlaying()
    const lb = LBNowPlaying()
    const items = [steam, lb].filter(Boolean)

    if (items.length === 0) return null

    const repeated = Array.from({ length: REPEATS }, (_, i) => items[i % items.length])

    return (
        <div id="now-playing-wrapper">
            <div id="now-playing">
                {repeated}
            </div>
        </div>
    )
}

