console.log("planetTerp.js Active")

function addProfReviewButtons(classElm) {
    // For each unique profs in for each class - get their reviews
    profs = []
    makeButton = name => {
        profReviewButton = document.createElement("button")
        profReviewButton.innerText = "Get Reviews"
        profReviewButton.classList.add("reviewButton")
        profReviewButton.setAttribute("data-prof", name)
        return profReviewButton
    }

    getProfData = async (prof, name) => {
        const response = await chrome.runtime.sendMessage({'prof': name})
        console.log("got data for "+name+":")
        console.log(response.data)
        prof.appendChild(document.createTextNode(response.data['average_rating']))
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
        console.log(e.id)
        // Add review course button to each class
        reviewButton = document.createElement("button");
        reviewButton.innerText = "Get Reviews";
        reviewButton.classList.add("reviewButton")
        reviewButton.setAttribute("data-class", e.id);
        e.querySelector(".course-id").parentElement.appendChild(reviewButton)

        // If sections are visible on page load then add review button
        if (e.querySelector(".section-instructors")) {
            addProfReviewButtons(e)
        }
        // Otherwise listen for show sections to be clicked, then add  review buttons
        else if (e.querySelector(".toggle-sections-link")){
            e.querySelector(".toggle-sections-link").addEventListener("click", section=>{
                console.log("clicked")
                setTimeout(()=>{addProfReviewButtons(e)}, 500)
            }, { once : true })
        }
    })
}