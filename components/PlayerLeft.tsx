/* eslint-disable @next/next/no-img-element */
function PlayerLeft({ songInfo }: { songInfo: "" | SpotifyApi.SingleTrackResponse }) {

  return (
    <div className="flex items-center space-x-4">
      {songInfo !== "" && (<img
        alt="Album image"
        className="hidden md:inline h-14 w-14"
        src={songInfo?.album?.images?.[0]?.url} />)}
      {songInfo !== "" && (<div>
        <h3>{songInfo?.name}</h3>
        <p>{songInfo?.artists?.[0].name}</p>
      </div>)}
    </div>)
}

export default PlayerLeft
