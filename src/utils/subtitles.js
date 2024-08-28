import parseSubtitle from "./SubtitleParser";


async function getSubtitlesUrl(ytVideoID) {
    const apiKey = process.env.REACT_APP_YT_API_KEY;
    const apiUrl = `/player?key=${apiKey}&prettyPrint=false`; // assumes package.json proxy points to "youtubei/v1" API

    const headers = new Headers({
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/json',
        'X-Youtube-Client-Name': '1',
        'X-Youtube-Client-Version': '2.20230607.06.00',
        'Sec-Fetch-Mode': 'no-cors',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
    });

    const body = {
        "context": {
            "client": {
                'hl': 'en',
                'clientName': 'WEB',
                'clientVersion': '2.20230607.06.00'
            }
        },
        "videoId": ytVideoID,
        "params": ""
    };

    const resp = await fetch(apiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
    })

    const jsonResp = JSON.parse(await resp.text());
    let subtitlesUrl = null;
    let videoTitle = null;
    try {
        const tracks = jsonResp['captions']['playerCaptionsTracklistRenderer']['captionTracks'];

        /* get subtitles url */
        let englishTrack = null;
        tracks.forEach(track => {
            if (track['languageCode'] === 'en')
                englishTrack = track;
        });
        subtitlesUrl = englishTrack['baseUrl'];

        /* get youtube video title */
        videoTitle = jsonResp['videoDetails']['title'];
    } catch (err) {
        console.log(err);
        return [null, null];
    }

    return [videoTitle, subtitlesUrl];
}


export default async function fetchSubtitles(ytVideoID) {
    const [videoTitle, subtitlesUrl] = await getSubtitlesUrl(ytVideoID);
    if (videoTitle == null || subtitlesUrl == null)
        return [null, null];

    const resp = await fetch(subtitlesUrl, {
        method: "GET"
    });

    const subtitlesRawXML = await resp.text();
    const parser = new DOMParser();
    const subtitlesXML = parser.parseFromString(subtitlesRawXML, "text/xml");

    let subtitles = [];
    for (let textTag of subtitlesXML.getElementsByTagName("text")) {
        const startTime = parseFloat(textTag.getAttribute("start"));
        const text = (textTag.childNodes.length > 0) ? parseSubtitle(textTag.childNodes[0].nodeValue) : "";

        if (!startTime || !text || text.length === 0)
            continue;

        const subtitleObj = {
            "startTime": startTime,
            "text": text
        };
        subtitles.push(subtitleObj);
    }

    return [videoTitle, subtitles];
}
