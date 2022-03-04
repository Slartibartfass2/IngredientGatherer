var index = 0
var links = []
var people = []
var ingredientCollection = []

function getRecipes() {
    var input = document.getElementById("links").value.split("\n")

    if (input.length == 0 || input[0] == "")
        return

    for (let index = 0; index < input.length; index++) {
        const element = input[index].split(";");

        if (element.length == 1)
            console.log("Falsches Format bei Link " + index)
        else {
            links.push(element[0].trim())
            people.push(element[1].trim())
        }
    }

    if (links.length == 0)
        return

    xhttp.open("GET", links[0], true);
    xhttp.send();
}

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var parser = new DOMParser()
        var responseDoc = parser.parseFromString(xhttp.responseText, "text/html")

        // var people = 4

        ingredientCollection.push(getIngredients(responseDoc, people[index]))

        if (index + 1 < links.length) {
            index++
            xhttp.open("GET", links[index], true);
            xhttp.send();
        } else {
            collectAllRecipes();
        }
    }
};

function getIngredients(responseDoc, people) {
    var list = responseDoc.getElementsByClassName("col-md-offset-3")[2]
   
    var ingredients = []

    for (let i = 2; i < list.children.length; i++) {
        let row = list.children[i]

        let amount = ""
        let unit = ""
        let name = ""
        
        if (row.childElementCount == 1) {
            name = row.children[0].children[0].innerText.trim()
        } else {
            amountUnitStrings = row.children[0].children[0].innerText.trim().split(" ")

            amount = amountUnitStrings[0]

            if (amountUnitStrings.length == 2)
                unit = amountUnitStrings[1]

                name = row.children[1].children[0].innerText.trim()
        }

        if (amount != "")
            amount *= people

        ingredients.push({ amount: amount, unit: unit, name: name })
    }

    return ingredients
}

function collectAllRecipes() {
    if (ingredientCollection.length == 0)
        return

    result = ingredientCollection[0]

    for (var i = 1; i < ingredientCollection.length; i++) {
        for (let j = 0; j < ingredientCollection[i].length; j++) {
            const element = ingredientCollection[i][j];

            index = getIndex(element.name, element.unit)

            if (index == -1)
                result.push(element)
            else
                result[index].amount += element.amount
        }
    }

    // Sort descending
    result.sort(function(a, b) {return b.amount - a.amount})

    // write everthing into textbox
    var resultText = ""
    for (let index = 0; index < result.length; index++) {
        const element = result[index];

        if (element.amount != "")
            resultText += element.amount + (element.unit != "" ? "" : " ")
        if (element.unit != "")
            resultText += element.unit + " "
        resultText += element.name
        
        if (index < result.length - 1)
            resultText += "\n"
    }

    document.getElementById("ingredients").value = resultText
}

function getIndex(name, unit) {
    for (let index = 0; index < result.length; index++) {
        const element = result[index];
        if (element.name == name && element.unit == unit)
            return index
    }
    return -1
}