chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        url = `https://planetterp.com/api/v1/professor?name=${request.prof}&reviews=true`

        caches.match(url).then((response) => {
            expTime = 86400000
            if (response !== undefined && parseInt(response.headers.get("sw-fetched-on"))+expTime > new Date().getTime()) {
                response.json().then(json => {
                    console.log("serving cached response")
                    sendResponse({error: false, data: json})
                })
            } else {
                console.log("fetching for "+request.prof+" @ url "+`https://planetterp.com/api/v1/professor?name=${request.prof}&reviews=true`)
                fetch(`https://planetterp.com/api/v1/professor?name=${request.prof}&reviews=true`)
                .then((response) => {
                    let responseClone = response.clone();
        
                    caches.open("v1").then((cache) => {
                        var headers = new Headers(responseClone.headers);
					    headers.append('sw-fetched-on', new Date().getTime());
                        responseClone.blob().then(body=>{
                            console.log("putting expiring response")
                            newresp = new Response(
                                body,
                                {
                                    status: responseClone.status,
                                    statusText: responseClone.statusText,
                                    headers: headers
                                }
                            )
                            cache.put(`https://planetterp.com/api/v1/professor?name=${request.prof}&reviews=true`, newresp);
                        })
                    });
                    response.json().then(json => {
                        sendResponse({error: false, data: json})
                    })
                })
            }
        })
        
        return true;        
    }
  );