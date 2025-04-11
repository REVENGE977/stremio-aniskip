function delay(ms: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
    });
}

function encodeWithPlus(input: string): string {
    return encodeURIComponent(input).replace(/%20/g, '+');
}

async function getPlayerState() {
    let playerState:any = null;
    
    // Retry fetching the data until it's available
    while (playerState == null || !playerState.seriesInfo || !playerState.metaItem?.content) {
        try {
            playerState = await _eval('core.transport.getState(\'player\')');
            
            if (playerState.seriesInfo && playerState.metaItem?.content) {
                break;  // Data is available, break out of the loop
            }
        } catch (err) {
            console.error('Error fetching player state:', err);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000)); 
    }
    
    const seriesInfoDetails = playerState.seriesInfo;
    const metaDetails = playerState.metaItem.content;
    return { seriesInfoDetails, metaDetails };
}

function convertSecondsToMMSSMS(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const milliseconds = Math.round((seconds % 1) * 1000); // Extract milliseconds

    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    const formattedMilliseconds = milliseconds < 100 ? `0${milliseconds}` : `${milliseconds}`;

    return `${minutes}:${formattedSeconds}:${formattedMilliseconds}`;
}
function _eval(js: string): Promise<any> {
    return new Promise((resolve, reject) => {
        try {
            const eventName = 'stremio-enhanced'
            const script = document.createElement('script')
            
            window.addEventListener(
                eventName,
                (data) => {
                    script.remove()
                    resolve((data as CustomEvent).detail)
                },
                { once: true },
            )
            
            script.id = eventName
            script.appendChild(
                document.createTextNode(`
                    var core = window.services.core;
                    var result = ${js};
            
                    if (result instanceof Promise) {
                        result.then((awaitedResult) => {
                            window.dispatchEvent(new CustomEvent("${eventName}", { detail: awaitedResult }));
                        });
                    } else {
                        window.dispatchEvent(new CustomEvent("${eventName}", { detail: result }));
                    }
                `),
            )
                
            document.head.appendChild(script)
        } catch (err) {
            reject(err)
        }
    })
}