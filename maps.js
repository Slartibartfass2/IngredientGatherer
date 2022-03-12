const servingsPerPerson = 2;

const units = [
    "el", "tl", "cup", "cups", "oz", "g", "mg", "kg", "ml", "l", "cl"
]

const noraCooksCupMap = {
    "cooked and chilled rice": [190, "g"],
    "frozen peas": [145, "g"],
    "raw cashews": [129, "g"],
    "water, divided, plus more as needed to thin": [250, "ml"],
    "nutritional yeast": [44, "g"]
}

const translation = {
    "teaspoon": "TL",
    "teaspoons": "TL",
    "tablespoon": "EL",
    "tablespoons": "EL",
    "tbsp": "EL",
}

// noinspection NonAsciiCharacters
const fractions = {
    "¼": 0.25,
    "½": 0.5,
    "¾": 0.75,
    "⅐": 0.1429,
    "⅑": 0.1111,
    "⅒": 0.1,
    "⅓": 0.3333,
    "⅔": 0.6667,
    "⅕": 0.2,
    "⅖": 0.4,
    "⅗": 0.6,
    "⅘": 0.8,
    "⅙": 0.1667,
    "⅚": 0.8333,
    "⅛": 0.125,
    "⅜": 0.375,
    "⅝": 0.625,
    "⅞": 0.875
}