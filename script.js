let ingredientCollection = [];

const supportedURLs = ["mobile.kptncook.com", "www.noracooks.com", "www.eat-this.org"]

const urlForm = document.getElementById("urls").children[0].cloneNode(true)

function collectURLs() {
    const forms = document.getElementById("urls").children
    const recipes = []

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

    return recipes
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

async function getRecipes() {
    console.clear()
    ingredientCollection = []

    const recipes = collectURLs()

    if (recipes.length === 0) return

    console.log("Recipes: ")
    console.log(recipes)

    let toComputeCount = 0

    document.getElementById("progressBarContainer").classList.remove("visually-hidden")

    const labels = document.getElementsByClassName("url-label")
    for (const label of labels)
        label.innerText = ""

    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i]
        await fetch(recipe.url).then((response) => {
            return response.text();
        }).then((html) => {
            const parser = new DOMParser()
            const responseDoc = parser.parseFromString(html, "text/html")
            const fetchedRecipe = getIngredients(recipe, responseDoc)
            console.log(fetchedRecipe)
            ingredientCollection.push(fetchedRecipe.ingredients)
            toComputeCount = updateProgress(toComputeCount, recipes.length)
            const label = document.getElementsByClassName("url-label")[i]
            label.classList.remove("invalid-url-label")
            label.classList.add("valid-url-label")
            label.innerText = fetchedRecipe.servings + " servings of '" + fetchedRecipe.name
        }).catch((err) => {
            const label = document.getElementsByClassName("url-label")[i]
            label.classList.remove("valid-url-label")
            label.classList.add("invalid-url-label")
            label.innerText = "Invalid input."
            alert("The data from\n" + recipe.url + "\ncouldn't be fetched: " + err + ".\nYou maybe need a CORS plugin to use this website.")
            toComputeCount = updateProgress(toComputeCount, recipes.length)
        });
    }
}

function updateProgress(toComputeCount, maxCount) {
    toComputeCount++
    const progress = (toComputeCount / maxCount * 100)
    console.log(progress)
    const progressBar = document.getElementById("progressBar")
    progressBar.style.width = progress + "%"
    progressBar.ariaValueNow = progress.toString()
    progressBar.innerText = progress.toFixed(2) + "%"
    if (toComputeCount === maxCount) {
        document.getElementById("progressBarContainer").classList.add("visually-hidden")
        progressBar.style.width = "0%"
        mergeRecipes()
    }
    return toComputeCount
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

    // let data = [new ClipboardItem({ "text/plain": new Blob([resultText], { type: "text/plain" }) })];
    // navigator.clipboard.write(data).then(function() {
    //     console.log("Copied to clipboard successfully!");
    //     const toast = new bootstrap.Toast(document.getElementById("toast"))
    //     toast.show()
    // }, function() {
    //     console.error("Unable to write to clipboard. :-(");
    // });
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
    button.parentElement.parentElement.parentElement.parentElement.remove()
}