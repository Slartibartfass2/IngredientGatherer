let recipes = [];
let ingredientCollection = [];

const supportedURLs = ["mobile.kptncook.com", "www.noracooks.com", "www.eat-this.org"]

const urlForm = document.getElementById("urls").children[0].cloneNode(true)

function collectURLs() {
    const forms = document.getElementById("urls").children

    for (const form of forms) {
        let url = form.getElementsByClassName("url")[0].value
        const people = form.getElementsByClassName("people")[0].value

        if (url === "" || people === "") continue

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

        // Change http to https
        if (!url.includes("https"))
            url = url.replace("http", "https")

        recipes.push({url: new URL(url), people: Number(people)})
    }
}

// Fetch test data
// fetch("https://www.eat-this.org/rezepte/dinner-time/").then((response) => {
//     return response.text();
// }).then((html) => {
//     const parser = new DOMParser()
//     const responseDoc = parser.parseFromString(html, "text/html")
//     const list = responseDoc.getElementsByClassName("flex-grid")[0].children
//     for (const recipe of list) {
//         recipes.push({url: new URL(recipe.children[0].children[0].href), people: 2})
//     }
// }).catch((err) => {
//     alert(err)
// });

function getRecipes() {
    console.clear()
    recipes = []
    ingredientCollection = []

    collectURLs()

    console.log("Recipes: ")
    console.log(recipes)

    if (recipes.length === 0) return

    let toComputeCount = recipes.length

    for (const recipe of recipes) {
        fetch(recipe.url).then((response) => {
            return response.text();
        }).then((html) => {
            const parser = new DOMParser()
            const responseDoc = parser.parseFromString(html, "text/html")
            ingredientCollection.push(getIngredients(recipe, responseDoc).ingredients)
            if (--toComputeCount === 0) mergeRecipes()
        }).catch((err) => {
            alert("The data from " + recipe.url + " couldn't be fetched: " + err)
            if (--toComputeCount === 0) mergeRecipes()
        });
    }
}

function mergeRecipes() {
    if (ingredientCollection.length === 0) return

    console.log("collected recipes: ")
    console.log(ingredientCollection)

    let result = []
    for (const recipe of ingredientCollection) {
        for (const ingredient of recipe) {
            let index = getIndex(ingredient.name, ingredient.unit, result)

            if (index === -1) result.push(ingredient)
            else result[index].amount += ingredient.amount
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