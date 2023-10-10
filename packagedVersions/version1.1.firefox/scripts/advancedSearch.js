console.log("advancedSearch.js Active")

genEds = [
    "FSAW",
    "FSAR",
    "FSOC",
    "FSPW",
    "DSHS",
    "DSHU",
    "DSNS",
    "DSNL",
    "DSSP",
    "DVCC",
    "DVUP",
    "SCIS"
]

genEdCatalog = {}

// Catalog all classes on current page by GenEds
if (document.querySelector("#courses-page")) {
    console.log("There are classes listed here")
    document.querySelectorAll(".course").forEach(e=>{

        result = {
            constant: [],
            variables: []
        }

        //Get the GenEds
        text = e.querySelector(".gen-ed-codes-group").innerText
        e.querySelectorAll(".course-subcategory").forEach(i => {
            // text += i.innerText + " "
        })

        //Filter out the variables
        filter = /([A-Z]{4}( \(.+\))? or [A-Z]{4})?((, )?([A-Z]{4})( \(.+\))?)?/g
        matches = [...text.matchAll(filter)]

        for (match in matches) {
            match = matches[match]
            if (match[1]) {
                result.variables.push([match[1].substr(0, 4), match[1].substr(match[1].length-4, 4)])
            }
            if (match[5]) {
                result.constant.push(match[5])
            }
        }

        dataOut = document.createTextNode(result.constant.toString())

        e.querySelector(".course-id").parentElement.appendChild(dataOut)

        genEdCatalog[e.id] = result

    })
}

console.log(genEdCatalog)

//helper functions to generate HTML elements
function createButton(text, callbackfn) {
    i = document.createElement("button")
    i.style.padding = "5px 12px"
    i.style.backgroundColor = "#efefef"
    i.style.borderRadius = "2px"
    i.style.border = "1px solid #111"
    i.style.color = "black"
    i.style.width = "fit-content"
    i.innerText = text

    i.addEventListener("click", e=>{
        e.preventDefault()
        console.log("hi")
    })

    return i
}

function createTitle (text) {
    title = document.createElement("div")
    temp = document.createTextNode(text)
    title.style.fontWeight = 800
    title.appendChild(temp)
    return title
}

//Create additional filter panel
fullHTML = `
<div class="extraFilter" style="background: #ececec; 
                                margin-top: 1rem; 
                                padding: .5rem; 
                                border-radius: 5px;
                                border: 1px solid #ccc;">
    <div style="font-weight: 800; color: black;">Filter By GenEds</div>
    <div class="exclude">
        <div style="font-weight: 800;">Exclude</div>
        <div>
            <input type="checkbox" name="" id="FSAWe" value="FSAW" class="exclude">
            <label for="FSAWe">FSAW</label>

            <input type="checkbox" name="" id="FSARe" value="FSAR" class="exclude">
            <label for="FSARe">FSAR</label>

            <input type="checkbox" name="" id="FSOCe" value="FSOC" class="exclude">
            <label for="FSOCe">FSOC</label>

            <input type="checkbox" name="" id="FSPWe" value="FSPW" class="exclude">
            <label for="FSPWe">FSPW</label>

            <input type="checkbox" name="" id="DSHSe" value="DSHS" class="exclude">
            <label for="DSHSe">DSHS</label>

            <input type="checkbox" name="" id="DSHUe" value="DSHU" class="exclude">
            <label for="DSHUe">DSHU</label>

            <input type="checkbox" name="" id="DSNSe" value="DSNS" class="exclude">
            <label for="DSNSe">DSNS</label>

            <input type="checkbox" name="" id="DSNLe" value="DSNL" class="exclude">
            <label for="DSNLe">DSNL</label>

            <input type="checkbox" name="" id="DSSPe" value="DSSP" class="exclude">
            <label for="DSSPe">DSSP</label>

            <input type="checkbox" name="" id="DVCCe" value="DVCC" class="exclude">
            <label for="DVCCe">DVCC</label>

            <input type="checkbox" name="" id="DVUPe" value="DVUP" class="exclude">
            <label for="DVUPe">DVUP</label>

            <input type="checkbox" name="" id="SCISe" value="SCIS" class="exclude">
            <label for="SCISe">SCIS</label>
        </div>
    </div>
    <div class="include">
        <div style="font-weight: 800;">Include</div>
        <div>
            <input type="checkbox" name="" id="FSAWi" value="FSAW" class="exclude">
            <label for="FSAWi">FSAW</label>

            <input type="checkbox" name="" id="FSARi" value="FSAR" class="exclude">
            <label for="FSARi">FSAR</label>

            <input type="checkbox" name="" id="FSOCi" value="FSOC" class="exclude">
            <label for="FSOCi">FSOC</label>

            <input type="checkbox" name="" id="FSPWi" value="FSPW" class="exclude">
            <label for="FSPWi">FSPW</label>

            <input type="checkbox" name="" id="DSHSi" value="DSHS" class="exclude">
            <label for="DSHSi">DSHS</label>

            <input type="checkbox" name="" id="DSHUi" value="DSHU" class="exclude">
            <label for="DSHUi">DSHU</label>

            <input type="checkbox" name="" id="DSNSi" value="DSNS" class="exclude">
            <label for="DSNSi">DSNS</label>

            <input type="checkbox" name="" id="DSNLi" value="DSNL" class="exclude">
            <label for="DSNLi">DSNL</label>

            <input type="checkbox" name="" id="DSSPi" value="DSSP" class="exclude">
            <label for="DSSPi">DSSP</label>

            <input type="checkbox" name="" id="DVCCi" value="DVCC" class="exclude">
            <label for="DVCCi">DVCC</label>

            <input type="checkbox" name="" id="DVUPi" value="DVUP" class="exclude">
            <label for="DVUPi">DVUP</label>

            <input type="checkbox" name="" id="SCISi" value="SCIS" class="exclude">
            <label for="SCISi">SCIS</label>
        </div>
    </div>
    <button id="filterBtn">Filter</button>
</div>
`

document.querySelector("#search-box-wrapper").insertAdjacentHTML("beforeend", fullHTML)

//Catch and run filter
document.querySelector("#filterBtn").addEventListener("click", e=>{
    e.preventDefault()
    console.log("filter clicked")
    exclude = [...document.querySelectorAll(".exclude input")].filter(e=>{return(e.checked)}).map(e=>{return(e.value)})
    include = [...document.querySelectorAll(".include input")].filter(e=>{return(e.checked)}).map(e=>{return(e.value)})
    console.log(exclude)
    console.log(include)
    document.querySelectorAll(".hide").forEach(e=>{e.classList.remove("hide");e.style.display="block"})
    for (entry in genEdCatalog) {
        variablesCount = genEdCatalog[entry].variables.length
        console.log(entry)
        for (ex in exclude) {
            ex = exclude[ex]
            if (genEdCatalog[entry].constant.includes(ex)) {
                elm = document.querySelector(`#${entry}`)
                elm.classList.add("hide")
                elm.style.display = "none"
            }
            else if (genEdCatalog[entry].variables[0]) {
                if (genEdCatalog[entry].variables[0].includes(ex)) {
                    console.log("checking variables")
                    console.log(variablesCount)
                    variablesCount -= 1
                    if (variablesCount == 0) {
                        elm = document.querySelector(`#${entry}`)
                        elm.classList.add("hide")
                        elm.style.display = "none"
                    }
                }
            }
        }
    }

})