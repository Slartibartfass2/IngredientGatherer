let index = 0;
let links = [];
let people = [];
let ingredientCollection = [];

const xhttp = new XMLHttpRequest();

function getRecipes() {
    links = []
    people = []
    ingredientCollection = []

    const input = document.getElementById("links").value.split("\n");

    if (input.length === 0 || input[0] === "") return

    for (let i = 0; i < input.length; i++) {
        const element = input[i].split(";");

        if (element.length === 1) console.log("Falsches Format bei Link " + i)
        else {
            links.push(element[0].trim())
            people.push(element[1].trim())
        }
    }

    if (links.length === 0) return

    xhttp.open("GET", links[0], true);
    xhttp.send();
}

xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        const parser = new DOMParser();
        const responseDoc = parser.parseFromString(xhttp.responseText, "text/html");

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
    const list = responseDoc.getElementsByClassName("col-md-offset-3")[2];

    const ingredients = [];

    for (let i = 2; i < list.children.length; i++) {
        let row = list.children[i]

        let amount = ""
        let unit = ""
        let name = ""

        if (row.childElementCount === 1) {
            name = row.children[0].children[0].innerText.trim()
        } else {
            const amountUnitStrings = row.children[0].children[0].innerText.trim().split(" ")

            amount = amountUnitStrings[0]

            if (amountUnitStrings.length === 2) unit = amountUnitStrings[1]

            name = row.children[1].children[0].innerText.trim()
        }

        if (amount !== "") amount *= people

        ingredients.push({amount: amount, unit: unit, name: name})
    }

    return ingredients
}

function collectAllRecipes() {
    if (ingredientCollection.length === 0) return

    console.log(ingredientCollection)

    let result = ingredientCollection[0]

    for (const recipe of ingredientCollection) {
        for (const ingredient of recipe) {
            index = getIndex(ingredient.name, ingredient.unit, result)

            if (index === -1) result.push(ingredient)
            else result[index].amount += ingredient.amount
        }
    }

    // Sort descending
    result.sort(function (a, b) {
        return b.amount - a.amount
    })

    // write everything into textbox
    let resultText = "";
    for (const element of result) {
        if (element.amount !== "") resultText += element.amount + (element.unit !== "" ? "" : " ")
        if (element.unit !== "") resultText += element.unit + " "
        resultText += element.name + "\n"
    }

    document.getElementById("ingredients").value = resultText
}

function getIndex(name, unit, result) {
    for (let i = 0; i < result.length; i++) {
        const element = result[i];
        if (element.name === name && element.unit === unit) return i
    }
    return -1
}