let testsPassed = 0

function testAll() {

}

async function testEatThis() {
    const mainUrl = "https://www.eat-this.org/rezepte/"
    const recipeTypes = ["fruehstueck/", "drinks_smoothies/", "salate_suppen_bowls/", "sandwiches_snacks_burger/",
        "schnell_und_einfach/", "pizza_pasta/", "dinner-time/", "zeit-fuer-brot/", "suesses/", "vegane-basics/"]

    for (const recipeType of recipeTypes) {
        let fetchURL = mainUrl + recipeType + "page/"
        let count = 1

        while (true) {
            const url = new URL(fetchURL + count + "/")

            let reachedEnd = await testRecipeContainerURL(url)

            if (reachedEnd)
                break

            if (count > 500) {
                console.log("something is wrong")
                break
            }

            count++
        }

        console.log("Finished with " + recipeType)
    }

    console.log(testsPassed + " tests passed")
}

async function testRecipeContainerURL(url) {
    const containerDoc = await getDOMELement(url)

    if (containerDoc.getElementsByClassName("error404__wrapper").length > 0) {
        console.log("Reached the end at " + url)
        return true
    }

    const list = containerDoc.getElementsByClassName("flex-grid")[0].children
    for (const recipeURL of list) {

        const recipe = {url: new URL(recipeURL.children[0].children[0].href), people: 2}

        try {
            const doc = await getDOMELement(recipe.url)
            getIngredients(recipe, doc)
            testsPassed++
            // TODO: test recipes
        } catch (e) {
            console.error("Error at " + recipe.url + ": " + e)
        }
    }

    return false
}

async function getDOMELement(url) {
    return fetch(url).then((response) => {
        return response.text()
    }).then((html) => {
        const parser = new DOMParser()
        return parser.parseFromString(html, "text/html")
    }).catch((err) => {
        console.error("Fetch error on '" + url + "':" + err)
    })
}

function testAmount(string) {

}

function testUnitOrName(string) {

}