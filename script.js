let index = 0;
let recipes = [];
let ingredientCollection = [];

const supportedURLs = ["mobile.kptncook.com"]

const urlForm = document.getElementById("urls").children[0].cloneNode(true)

const xhttp = new XMLHttpRequest();

function collectURLs() {
    const forms = document.getElementById("urls").children

    for (const form of forms) {
        const url = form.getElementsByClassName("url")[0].value
        const people = form.getElementsByClassName("people")[0].value

        if (url === "" || people === "")
            continue

        // Check for valid inputs
        if (!isURL(url) || isNaN(people) || people < 0) {
            console.log(url + " and " + people + " are no valid input")
            continue
        }

        // Check for supported urls
        if (!isSupportedURL(url)) {
            console.log("The URL " + url + " is not supported")
            continue
        }

        recipes.push({url: url, people: people})
    }
}

function getRecipes() {
    recipes = []
    ingredientCollection = []

    collectURLs()

    console.log(recipes)

    if (recipes.length === 0) return

    xhttp.open("GET", recipes[0].url, true);
    xhttp.send();
}

xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        const parser = new DOMParser();
        const responseDoc = parser.parseFromString(xhttp.responseText, "text/html");

        ingredientCollection.push(getIngredients(responseDoc, recipes[index].people))

        if (index + 1 < recipes.length) {
            index++
            xhttp.open("GET", recipes[index].url, true);
            xhttp.send();
        } else {
            mergeAllRecipes();
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

function mergeAllRecipes() {
    if (ingredientCollection.length === 0) return

    let result = []
    for (const recipe of ingredientCollection) {
        for (const ingredient of recipe) {
            index = getIndex(ingredient.name, ingredient.unit, result)

            if (index === -1)
                result.push(ingredient)
            else
                result[index].amount += ingredient.amount
        }
    }

    // Sort descending
    result.sort((a, b) => {
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
    console.log(name)
    console.log(result)
    for (let i = 0; i < result.length; i++) {
        const element = result[i];
        if (element.name === name && element.unit === unit) {
            return i
        }
    }
    return -1
}

function isSupportedURL(string) {
    let url

    try {
        url = new URL(string)
    } catch (_) {
        return false
    }

    return supportedURLs.includes(url.hostname)
}

function isURL(string) {
    let url

    try {
        url = new URL(string)
    } catch (_) {
        return false
    }

    console.log(url)

    return url.protocol === "http:" || url.protocol === "https:"
}

function addURLForm() {
    document.getElementById("urls").appendChild(urlForm.cloneNode(true))
}

function deleteURLForm(button) {
    button.parentElement.parentElement.remove()
}