function getIngredients(recipe, doc) {
    console.log("Recipe to process: ")
    console.log(recipe)

    switch (recipe.url.hostname) {
        case "mobile.kptncook.com":
            return getIngredientsFromKptnCook(doc, recipe.people)

        case "www.noracooks.com":
            return getIngredientsFromNoraCooks(doc, recipe.people)

        case "biancazapatka.com":
            return getIngredientsFromBiancaZapatka(doc, recipe.people)

        case "www.eat-this.org":
            return getIngredientsFromEatThis(doc, recipe.people)

        default:
            console.log(recipe.url.hostname + " is not supported")
            return {name: "", people: 0, ingredients: []}
    }
}

function getIngredientsFromKptnCook(doc, people) {
    // TODO: implement different people-servings-ratio

    const title = doc.getElementsByClassName("kptn-recipetitle")[0].innerText.trim()
    const recipe = {name: title, people: people, ingredients: []}

    const list = doc.getElementsByClassName("col-md-offset-3")[2].children

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
            amount = amountUnitStrings[0] * people

            if (amountUnitStrings.length === 2) unit = amountUnitStrings[1]
        }

        recipe.ingredients.push({amount: amount, unit: unit, name: name})
    }

    return recipe
}

function getIngredientsFromNoraCooks(doc, people) {
    const title = doc.getElementsByClassName("wprm-recipe-name wprm-block-text-bold")[0].innerHTML
    const recipeContainer = doc.getElementsByClassName("wprm-recipe-ingredients-container")[0]
    const servings = Number(recipeContainer.dataset.servings)

    const recipe = {name: title, people: people, ingredients: []}

    const ingredients = recipeContainer.getElementsByClassName("wprm-recipe-ingredient")

    for (const ingredient of ingredients) {

        const amount = ingredient.getElementsByClassName("wprm-recipe-ingredient-amount")[0].innerText.trim()

        let unit = ""
        const unitElements = ingredient.getElementsByClassName("wprm-recipe-ingredient-unit")
        if (unitElements.length === 1)
            unit = unitElements[0].innerText.trim()

        const name = ingredient.getElementsByClassName("wprm-recipe-ingredient-name")[0].innerText.trim()

        recipe.ingredients.push({amount: amount, unit: unit, name: name})
    }

    // TODO: imperial to metric system
    // TODO: german translation to merge with german recipes

    return recipe
}

function getIngredientsFromBiancaZapatka(doc, people) {
    console.log("BiancaZapatka isn't implemented yet")
    return {name: "", people: 0, ingredients: []}
}

function getIngredientsFromEatThis(doc, people) {
    console.log("EatThis isn't implemented yet")
    return {name: "", people: 0, ingredients: []}
}
