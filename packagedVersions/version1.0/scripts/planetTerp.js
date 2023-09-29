console.log("planetTerp.js Active")

class ClassWatcher {

    constructor(targetNode, classToWatch, classAddedCallback, classRemovedCallback) {
        this.targetNode = targetNode
        this.classToWatch = classToWatch
        this.classAddedCallback = classAddedCallback
        this.classRemovedCallback = classRemovedCallback
        this.observer = null
        this.lastClassState = targetNode.classList.contains(this.classToWatch)

        this.init()
    }

    init() {
        this.observer = new MutationObserver(this.mutationCallback)
        this.observe()
    }

    observe() {
        this.observer.observe(this.targetNode, { attributes: true })
    }

    disconnect() {
        this.observer.disconnect()
    }

    mutationCallback = mutationsList => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                let currentClassState = mutation.target.classList.contains(this.classToWatch)
                if(this.lastClassState !== currentClassState) {
                    this.lastClassState = currentClassState
                    if(currentClassState) {
                        this.classAddedCallback()
                    }
                    else {
                        this.classRemovedCallback()
                    }
                }
            }
        }
    }
}

function addProfReviews(classElm) {
    // For each unique profs in for each class - get their reviews
    getProfData = async (prof, name) => {
        const response = await chrome.runtime.sendMessage({'prof': name})
        console.log("got data for "+name+":")
        console.log(response.data)
        if ("error" in response.data) {
            html = `
            <div>
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="#fab000" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
            No Data
            </div>
            `
        }
        else if (!response.data['average_rating']) {
            html = `
            <div>
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="#fab000" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
            <a target="_blank" href="https://planetterp.com/professor/${response.data.slug}">No Rating</a>
            </div>
            `
        }
        else {
            html = `
            <div>
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path fill="#fab000" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
            <a target="_blank" href="https://planetterp.com/professor/${response.data.slug}">${response.data['average_rating'].toFixed(2)}</a>
            </div>
            `
            //prof.appendChild(document.createTextNode(response.data['average_rating'].toFixed(2)))
        }
        prof.insertAdjacentHTML("beforeend", html)
    }

    classElm.querySelectorAll(".section-instructors").forEach(prof => {
        profName = prof.innerText
        console.log("sending "+profName)
        getProfData(prof, profName);
    })
}

if (document.querySelector("#courses-page")) {
    console.log("There are classes listed here")
    document.querySelectorAll(".course").forEach(e=>{
        // Add review course button to each class
        reviewButton = document.createElement("button");
        reviewButton.innerText = "Get Reviews";
        reviewButton.classList.add("reviewButton")
        reviewButton.setAttribute("data-class", e.id);
        e.querySelector(".course-id").parentElement.appendChild(reviewButton)

        // If sections are visible on page load then add review button
        if (e.querySelector(".section-instructors")) {
            addProfReviews(e)
        }
        // Otherwise listen for show sections to be clicked, then add  review buttons
        else if (e.querySelector(".toggle-sections-link")){
            e.querySelector(".toggle-sections-link").addEventListener("click", section=>{
                console.log("clicked")
                classWatcher = new ClassWatcher(
                    e.querySelector(".sections-fieldset legend"), 
                    'loading', 
                    ()=>{}, 
                    ()=>{addProfReviews(e)})
                //setTimeout(()=>{addProfReviews(e)}, 500)
            }, { once : true })
        }
    })
}