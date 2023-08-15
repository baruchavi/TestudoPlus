console.log("advancedSearch.js Active")

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
            else if (match[5]) {
                result.constant.push(match[5])
            }
        }

        console.log(result.variables)
        console.log(result.constant)
        console.log("-")

        dataOut = document.createTextNode(result.constant.toString())

        e.querySelector(".course-id").parentElement.appendChild(dataOut)

    })
}