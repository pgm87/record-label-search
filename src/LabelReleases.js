import axios from "axios";
import { useEffect, useState } from "react";
// lookup:   /<ENTITY_TYPE>/<MBID>?inc=<INC>

const LabelReleases = ({ id }) => {

    const [releasesArray, setReleasesArray] = useState([]);
    const [offset, setOffset] = useState(0);
    const [displayNoLabel, setDisplayNoLabel] = useState('Search Above');
    const handleClickBack = () => {
        setOffset(offset - 5);
    }
    const handleClickForward = () => {
        setOffset(offset + 5);
    }

    useEffect(() => {
        if (id !== '') {
            axios({
                url: `https://musicbrainz.org/ws/2/release?label=${id}`,
                params: {
                    fmt: 'json',
                    inc: 'artist-credits+genres+media',
                    offset: offset,
                    limit: 5
                }
            }).then((res) => {
                res.data.releases.length > 0 ?
                    setReleasesArray(res.data.releases)
                    : setDisplayNoLabel('No Label Found Try Again');
                console.log('hello from display no label', displayNoLabel);
            })
        }

    }, [id, offset]);



    return (
        <>
            <ul>
                {
                    offset > 0 ?
                        <button className="btnBack" onClick={handleClickBack}><i class="fa-solid fa-backward-step"></i></button>
                        : null
                }


                {
                    releasesArray.length > 0 ?
                        releasesArray.map((release) => {
                            return (
                                < div key={release.id} className="labelReleaseContainer" >
                                    <li key={release.id}>
                                        <p>
                                            {release["artist-credit"].map((artist) => {
                                                return (
                                                    artist["name"] + artist["joinphrase"]
                                                )
                                            })}
                                            -
                                            {release.title}
                                        </p>
                                        {
                                            release["cover-art-archive"].front === false ?
                                                <div className="imgContainer"><i className="fa-solid fa-record-vinyl"></i></div>
                                                :
                                                <div className="imgContainer"><img src={`https://coverartarchive.org/release/${release.id}/front`} alt={`Album cover for ${release.title}`} /></div>
                                        }
                                    </li>
                                </div>
                            )
                        })
                        : null
                }
                {
                    releasesArray.length > 4 ?
                        <button className="btnForward" onClick={handleClickForward}><i class="fa-solid fa-forward-step"></i></button>
                        : null
                }

            </ul >

        </>
    )
}

export default LabelReleases;