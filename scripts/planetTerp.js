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

    classElm.querySelectorAll(".section-instructors").forEach(prof => {
        console.log(profs)
        if (!profs.includes(prof.innerText)) {
            console.log(prof.innerText)
            profs.push(prof.innerText)
            prof.appendChild(makeButton(prof.innerText))
        }
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
            addProfReviewButtons(e)
        }
        // Otherwise listen for show sections to be clicked, then add  review buttons
        else {
            e.querySelector(".toggle-sections-link").addEventListener("click", section=>{
                console.log("clicked")
                setTimeout(()=>{addProfReviewButtons(e)}, 500)
            }, { once : true })
        }
    })
}