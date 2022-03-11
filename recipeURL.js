function getIngredients(recipe, doc) {
    console.log("Recipe to process: ")
    console.log(recipe)

    const servings = recipe.people * servingsPerPerson;

    switch (recipe.url.hostname) {
        case "mobile.kptncook.com":
            return getIngredientsFromKptnCook(doc, servings)

        case "www.noracooks.com":
            return getIngredientsFromNoraCooks(doc, servings)

        case "biancazapatka.com":
            return getIngredientsFromBiancaZapatka(doc, servings)

        case "www.eat-this.org":
            return getIngredientsFromEatThis(doc, servings)

        default:
            console.log(recipe.url.hostname + " is not supported")
            return {name: "", servings: 0, ingredients: []}
    }
}

function getIngredientsFromKptnCook(doc, servings) {
    const title = doc.getElementsByClassName("kptn-recipetitle")[0].innerText.trim()
    const recipe = {name: title, servings: servings, ingredients: []}

    const list = doc.getElementsByClassName("col-md-offset-3")[2].children
    const recipeServings = Number(list[0].children[0].innerText.trim().split(" ")[1])
    const servingsMultiplier = servings / recipeServings

    // Remove parts which aren't parts of the ingredient list
    list[0].remove();
    list[0].remove();

    for (const ingredient of list) {

        let amount = ""
        let unit = ""
        let name = ""

        if (ingredient.childElementCount === 1) {
            name = ingredient.children[0].children[0].innerText.trim()
        } else {
            name = ingredient.children[1].children[0].innerText.trim()

            const amountUnitStrings = ingredient.children[0].children[0].innerText.trim().split(" ")
            amount = amountUnitStrings[0] * servingsMultiplier

            if (amountUnitStrings.length === 2) unit = amountUnitStrings[1]
        }

        recipe.ingredients.push({amount: amount, unit: unit, name: name})
    }

    return recipe
}

function getIngredientsFromNoraCooks(doc, servings) {
    const title = doc.getElementsByClassName("wprm-recipe-name wprm-block-text-bold")[0].innerHTML
    const recipe = {name: title, servings: servings, ingredients: []}

    const recipeContainer = doc.getElementsByClassName("wprm-recipe-ingredients-container")[0]
    const recipeServings = Number(recipeContainer.dataset.servings)
    const servingsMultiplier = servings / recipeServings

    console.log(servingsMultiplier)

    const ingredients = recipeContainer.getElementsByClassName("wprm-recipe-ingredient")

    for (const ingredient of ingredients) {
        let amount = ingredient.getElementsByClassName("wprm-recipe-ingredient-amount")[0].innerText.trim()
        amount = convertFraction(amount)

        let unit = ""
        const unitElements = ingredient.getElementsByClassName("wprm-recipe-ingredient-unit")
        if (unitElements.length === 1)
            unit = translate(unitElements[0].innerText.trim())

        const nameString = ingredient.getElementsByClassName("wprm-recipe-ingredient-name")[0].innerText.trim()

        if (unit !== "") {
            const metricData = convertToMetricSystemNoraCooks(unit, nameString)
            if (metricData.length === 2) {
                amount *= metricData[0]
                unit = metricData[1]
            }
        }

        const name = translate(nameString)

        recipe.ingredients.push({amount: amount, unit: unit, name: name})
    }

    // TODO: imperial to metric system
    // TODO: german translation to merge with german recipes

    return recipe
}

function getIngredientsFromBiancaZapatka(doc, people) {
    console.warn("BiancaZapatka isn't implemented yet")
    return {name: "", servings: 0, ingredients: []}
}

function getIngredientsFromEatThis(doc, people) {
    console.warn("EatThis isn't implemented yet")
    return {name: "", servings: 0, ingredients: []}
}

function translate(string) {
    const translatedString = translation[string]
    if (translatedString !== null && translatedString !== undefined)
        return translatedString
    console.warn(string + " has no translation!")
    return string
}

function convertToMetricSystemNoraCooks(unit, name) {
    if (!units.includes(unit))
        return []

    const metricData = noraCooksCupMap[name]
    if (metricData === null || metricData === undefined)
        return []

    return metricData
}

function convertFraction(fraction) {
    if (!fraction.includes("/"))
        return fraction

    const parts = fraction.split("/");
    return parts[0] / parts[1]
}