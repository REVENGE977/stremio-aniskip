/**
* @name AniSkip
* @description Integrates AniSkip to Stremio Enhanced to skip anime openings and endings (Only works with kitsu). Please note that this is still expiremental.
* @updateUrl https://raw.githubusercontent.com/REVENGE977/stremio-aniskip/main/dist/AniSkip.plugin.js
* @version 1.0.0
* @author REVENGE977
*/

if(localStorage.getItem("aniskip_userid") == null) { 
    localStorage.setItem("aniskip_userid", crypto.randomUUID());
}

async function hashChangeHandler() {
    if(!location.hash.startsWith("#/player")) return;
    console.log("AniSkip: Player opened");
    let playerState = (await getPlayerState());
    let currentEpisodeInfo = playerState.seriesInfoDetails;
    let metaInfo = playerState.metaDetails;
 
    let isKitsu = metaInfo.id.startsWith("kitsu:");
    if(!isKitsu) return console.log("AniSkip: Not using Kitsu metadata. AniSkip plugin not supported.");

    createAniSkipButton();

    let showName = metaInfo.name;
    // let year = metaInfo.releaseInfo.split("-")[0].split('–')[0];
    let episodeNumber = currentEpisodeInfo.episode;
    
    let MAL = await fetchJikan(showName);
    if (MAL) {
        console.log("AniSkip: Found myanimelist anime ID: " + MAL);
        let aniskip = await AniSkip.getSkipTimes(MAL, episodeNumber);
        if(aniskip.found) {
            aniskip.results.forEach((segment: { interval: { start_time: number; end_time: number; }; skip_type: "op" | "ed"; skip_id: number; }) => {
                let timestampStart = segment.interval.start_time;
                let timestampEnd = segment.interval.end_time;
                let segmentType = segment.skip_type;
                let segmentId = segment.skip_id;
                console.log(`AniSkip: Found ${segmentType} skip times (${segmentId}) for episode ${episodeNumber} of ${showName} at ${timestampStart} - ${timestampEnd}`);
    
                createSkipPopup(timestampStart, timestampEnd, segmentType);
                addLayerToPlayer(timestampStart, timestampEnd, segmentType); 
            });
        } else {
            console.log("AniSkip: No skip times found in AniSkip database.");
            AniSkip.skipTimes = null;
        }
    } else {
        console.log("AniSkip: No matching anime or episode found.");
    }
}

class AniSkip {
    private static readonly API_URL = 'https://api.aniskip.com/v1';
    public static skipTimes: any = null;

    public static async getSkipTimes(malId:number, episode:number) {
        let req = await fetch(`${this.API_URL}/skip-times/${malId}/${episode}?types=op&types=ed`);
        let data:any = await req.json();
    
        if(data.found) this.skipTimes = data;
        return data;
    }

    public static async vote(segmentId: number, type: 'upvote' | 'downvote') {
        let req = await fetch(`${this.API_URL}/skip-times/vote/${segmentId}`, {
            method: 'POST',
            body: JSON.stringify({
                vote_type: type
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let res:any = req.status;

        if(res == 429) return console.log("AniSkip: Rate limited. Please try again later.");
    
        return req.json();
    }

    public static async createSkipTimes(
        animeId: number, 
        episodeNumber: number, 
        skipType: "op" | "ed", 
        startTime: number, 
        endTime: number, 
        episodeLength: number,
        submitterId: string) {
        let req = await fetch(`${this.API_URL}/skip-times/${animeId}/${episodeNumber}`, {
            method: 'POST',
            body: JSON.stringify({
                skip_type: skipType,
                provider_name: "stremio",
                start_time: startTime,
                end_time: endTime,
                episode_length: episodeLength,
                submitter_id: submitterId
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let res:any = req.status;

        if(res == 429) return console.log("AniSkip: Rate limited. Please try again later.");

        return req.json();
    }
}

// async function fetchMAL(title: string, startYear:number) {
//     console.log(`AniSkip: Searching for ${title} on MyAnimeList`);

//     let combinedTitle = encodeWithPlus(title);
//     let req = await fetch(`https://myanimelist.net/search/prefix.json?type=anime&keyword=${combinedTitle}`);
//     let data:any = await req.json();

//     const animeCategory = data.categories.find((cat: any) => cat.type === 'anime');
//     if (!animeCategory) return console.log('AniSkip: No anime results found.');

//     if (animeCategory.items.length === 0) return console.log('AniSkip: No anime results found.');

//     const filteredItems = animeCategory.items.filter((item: any) => item.payload.media_type === 'TV');
//     if (filteredItems.length === 0) return console.log('AniSkip: No TV anime results found.');

//     console.log("Current title year of release is: " + startYear + " & year found in MAL title result is: " + filteredItems[0].payload.start_year);
//     if(compareTitlesBySimilarity(title, filteredItems[0].name, 30) && filteredItems[0].payload.start_year == startYear) {
//         return filteredItems[0].id
//     }

//     return null;
// }


// fetch Jikan API to find the anime ID in MyAnimeList. This is good because Kitsu uses English titles instead of Japanese titles and Jikan supports both.
async function fetchJikan(title: string) {
    console.log(`AniSkip: Searching for ${title} on Jikan`);

    let combinedTitle = encodeWithPlus(title);
    let req = await fetch(`https://api.jikan.moe/v4/anime?q=${combinedTitle}&limit=1`);
    let res:any = await req.json();

    if (res.pagination.items.count == 0) return console.log('AniSkip: No anime results found.');
    if(res.data.length == 0) return console.log('AniSkip: No anime results found.');
    
    return res.data[0].mal_id;
}

window.addEventListener('hashchange', hashChangeHandler);
window.addEventListener('load', hashChangeHandler);