let ingredientCollection = []
let sortedByAmountText = ""
let sortedByRecipeText = ""
let sortedByCategoryText = ""

// TODO: Tests schreiben die alle Rezepte einer Webseite durchgehen und software testen
// TODO: jquery anwenden

const supportedURLs = ["mobile.kptncook.com", "www.noracooks.com", "www.eat-this.org", "biancazapatka.com"]

const urlForm = document.getElementById("urls").children[0].cloneNode(true)

function collectURLs() {
    const recipes = []

    const forms = $('#urls')[0].children
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

function getRecipes() {
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
        fetch(recipe.url).then((response) => {
            return response.text()
        }).then((html) => {
            const parser = new DOMParser()
            const responseDoc = parser.parseFromString(html, "text/html")
            const fetchedRecipe = getIngredients(recipe, responseDoc)
            ingredientCollection.push(fetchedRecipe)
            toComputeCount = updateProgress(toComputeCount, recipes.length)
            displayLabel(i, true, fetchedRecipe)
        }).catch((err) => {
            displayLabel(i, false, null)
            alert("The data from\n" + recipe.url + "\ncouldn't be fetched: " + err + ".\nYou may need a CORS plugin to use this website.")
            toComputeCount = updateProgress(toComputeCount, recipes.length)
        });
    }
}

function displayLabel(i, valid, recipe) {
    const label = document.getElementsByClassName("url-label")[i]
    label.classList.remove((valid ? "in" : "") + "valid-url-label")
    label.classList.add((valid ? "" : "in") + "valid-url-label")
    label.innerText = valid ? (recipe.servings + " servings of '" + recipe.name + "'") : "Invalid input."
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
        finishCollectingRecipes()
    }
    return toComputeCount
}

function finishCollectingRecipes() {
    if (ingredientCollection.length === 0) return

    console.log("collected recipes: ")
    console.log(ingredientCollection)

    sortedByAmountText = mergeRecipes()

    sortedByRecipeText = ""
    for (const recipe of ingredientCollection) {
        console.log(recipe)
        sortedByRecipeText += recipe.name + "\n"
        for (const ingredient of recipe.ingredients) {
            sortedByRecipeText += "    " + formatIngredient(ingredient) + "\n"
        }
    }

    displayIngredientList()
}

function mergeRecipes() {
    let result = []
    for (const recipe of ingredientCollection) {
        for (const ingredient of recipe.ingredients) {
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
    for (const element of result)
        resultText += formatIngredient(element) + "\n"

    return resultText
}

function formatIngredient(ingredient) {
    let result = ""
    if (ingredient.amount !== "") result += ingredient.amount + " "
    if (ingredient.unit !== "") result += ingredient.unit + " "
    result += ingredient.name
    return result
}

function displayIngredientList() {
    let copyText = ""
    if (document.getElementById("btnSortByAmount").checked) {
        // Sort by amount
        console.log("sort by amount")
        document.getElementById("ingredients").value = sortedByAmountText
    } else if (document.getElementById("btnSortByRecipe").checked) {
        // Sort by recipe
        console.log("sort by recipe")
        document.getElementById("ingredients").value = sortedByRecipeText
    } else if (document.getElementById("btnSortByCategory").checked) {
        // Sort by category
        console.log("sort by category")

    } else return;

    copyToClipboard(copyText)
}

function copyToClipboard(ingredientText) {
    return
    let data = [new ClipboardItem({"text/plain": new Blob([ingredientText], {type: "text/plain"})})];
    navigator.clipboard.write(data).then(function () {
        console.log("Copied to clipboard successfully!");
        const toast = new bootstrap.Toast(document.getElementById("toast"))
        toast.show()
    }, function () {
        console.error("Unable to write to clipboard. :-(");
    });
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