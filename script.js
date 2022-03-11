let index = 0;
let recipes = [];
let ingredientCollection = [];

const supportedURLs = ["mobile.kptncook.com", "www.noracooks.com"]

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
            console.warn(url + " and " + people + " are no valid input")
            continue
        }

        // Check for supported urls
        if (!isSupportedURL(url)) {
            console.warn("The URL " + url + " is not supported")
            continue
        }

        recipes.push({url: new URL(url), people: Number(people)})
    }
}

function getRecipes() {
    index = 0
    recipes = []
    ingredientCollection = []

    collectURLs()

    console.log("Recipes: ")
    console.log(recipes)

    if (recipes.length === 0) return

    xhttp.open("GET", recipes[0].url, true);
    xhttp.send();
}

xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
        const parser = new DOMParser();
        const responseDoc = parser.parseFromString(xhttp.responseText, "text/html");

        ingredientCollection.push(getIngredients(recipes[index], responseDoc).ingredients)

        if (index + 1 < recipes.length) {
            index++
            xhttp.open("GET", recipes[index].url, true);
            xhttp.send();
        } else {
            mergeAllRecipes();
        }
    }
};

function mergeAllRecipes() {
    if (ingredientCollection.length === 0) return

    console.log("collected recipes: ")
    console.log(ingredientCollection)

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
        if (element.amount !== "") resultText += element.amount + " "
        if (element.unit !== "") resultText += element.unit + " "
        resultText += element.name + "\n"
    }

    document.getElementById("ingredients").value = resultText
}

function getIndex(name, unit, result) {
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

    return url.protocol === "http:" || url.protocol === "https:"
}

function addURLForm() {
    document.getElementById("urls").appendChild(urlForm.cloneNode(true))
}

function deleteURLForm(button) {
    button.parentElement.parentElement.remove()
}