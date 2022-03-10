function getIngredients(recipe, doc) {
    console.log(recipe)
    let people = recipe.people

    switch (recipe.url.hostname) {
        case "mobile.kptncook.com":
            return getIngredientsFromKptnCook(doc, people);

        case "FICK DEINE MUTTER":
            break;

        default:
            console.log(recipe.url.hostname + " is not supported")
    }
}

function getIngredientsFromKptnCook(doc, people) {
    const list = doc.getElementsByClassName("col-md-offset-3")[2];

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

function getIngredientsFromNoraCooks(doc, people) {
    console.log("Nora Cooks isn't implemented yet")
}

function getIngredientsFromBiancaZapatka(doc, people) {
    console.log("BiancaZapatka isn't implemented yet")
}

function getIngredientsFromEatThis(doc, people) {
    console.log("EatThis isn't implemented yet")
}
