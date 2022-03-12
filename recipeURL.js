function getIngredients(recipe, doc) {
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

    const ingredients = recipeContainer.getElementsByClassName("wprm-recipe-ingredient")

    for (const ingredient of ingredients) {
        const amountElements = ingredient.getElementsByClassName("wprm-recipe-ingredient-amount")
        let amount = ""
        if (amountElements.length === 1) {
            amount = convertFraction(amountElements[0].innerText.trim())
            amount = Math.round(amount * servingsMultiplier * 100) / 100
        }

        let unit = ""
        const unitElements = ingredient.getElementsByClassName("wprm-recipe-ingredient-unit")
        if (unitElements.length === 1)
            unit = unitElements[0].innerText.trim()

        let nameString = ingredient.getElementsByClassName("wprm-recipe-ingredient-name")[0].innerText.trim()
        nameString = nameString.replace(/\([-\s0-9a-zA-Z]+\)/, "").trim()

        // Check if unit is in imperial system and try to convert and translate it
        if (unit !== "") {
            const metricData = convertToMetricSystemNoraCooks(unit, nameString)
            if (metricData.length === 2) {
                amount *= metricData[0]
                unit = metricData[1]
            } else
                unit = translate(unit)
        }

        // Translate name
        let name = ""
        const nameParts = nameString.split(",")
        if (nameParts.length > 0) {
            for (let i = 0; i < nameParts.length; i++) {
                name += translate(nameParts[i].trim())
                if (i < nameParts.length - 1)
                    name += ", "
            }
        } else
            name = translate(nameString)

        recipe.ingredients.push({amount: amount, unit: unit, name: name})
    }

    return recipe
}

function getIngredientsFromBiancaZapatka(doc, servings) {
    console.warn("BiancaZapatka isn't implemented yet")
    return {name: "", servings: 0, ingredients: []}
}

function getIngredientsFromEatThis(doc, servings) {
    const title = doc.getElementsByClassName("entry-title")[0].innerText.trim()
    const recipe = {name: title, servings: servings, ingredients: []}

    const recipeServings = Number(doc.getElementsByClassName("wprm-recipe-container")[0].dataset.servings)
    const servingsMultiplier = servings / recipeServings

    const ingredients = doc.getElementsByClassName("wprm-recipe-ingredient")

    for (const ingredient of ingredients) {
        let amount = ""
        const amountElements = ingredient.getElementsByClassName("wprm-recipe-ingredient-amount")
        if (amountElements.length === 1) {
            const amountString = ingredient.getElementsByClassName("wprm-recipe-ingredient-amount")[0].innerText
            amount = getAmountFromString(amountString, servingsMultiplier)
        }

        let unit = ""
        let unitElements = ingredient.getElementsByClassName("wprm-recipe-ingredient-unit")
        if (unitElements.length === 1)
            unit = unitElements[0].innerText

        let name = ""
        let nameElement = ingredient.getElementsByClassName("wprm-recipe-ingredient-name")[0]
        if (nameElement.children.length === 0)
            name = nameElement.innerText
        else
            name = nameElement.children[0].innerText

        recipe.ingredients.push({amount: amount, unit: unit, name: name})
    }

    return recipe
}

function getAmountFromString(amountString, servingsMultiplier) {
    let amount = 0

    amountString = amountString.trim()

    const parts = amountString.split(/\s/)
    for (const part of parts) {
        // Check if string is a fraction char
        let fraction = fractions[part]
        if (fraction !== null && fraction !== undefined)
            amount += Number(fraction)
        else if (part.includes("/")) { // Check for fraction via '/'
            const fractionParts = part.split("/")
            fraction = fractionParts[0] / fractionParts[1]
            amount += Number(fraction)
        } else {
            amount += Number(part.replace(",", "."))
        }
    }

    return parseFloat((amount * servingsMultiplier).toFixed(2))
}

function translate(string) {
    const translatedString = translation[string]
    if (translatedString !== null && translatedString !== undefined)
        return translatedString
    // console.warn(string + " has no translation!")
    // TODO: maybe translation API
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
    // TODO: use getAmountFromString instead
    if (!fraction.includes("/"))
        return fraction

    const parts = fraction.split("/");
    return parts[0] / parts[1]
}