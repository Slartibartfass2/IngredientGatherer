![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Slartibartfass2/IngredientGatherer/pages%20build%20and%20deployment?logo=github)
![GitHub deployments](https://img.shields.io/github/deployments/Slartibartfass2/IngredientGatherer/github-pages?logo=github)
![GitHub last commit](https://img.shields.io/github/last-commit/Slartibartfass2/IngredientGatherer?logo=github)
![GitHub issues](https://img.shields.io/github/issues-raw/Slartibartfass2/IngredientGatherer?logo=github)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/Slartibartfass2/IngredientGatherer?logo=github)
[![Report Issue](https://img.shields.io/badge/-Report%20issue-red?style=flat&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAsklEQVR4Ae3UEQzEQBCF4YVzd66nrvWs0+JBPeNUdzzPYT11Onen/3TwLbyl+ZPBSb5sstOq1VXAAEKc7sZczPf2Y3woPyajfBg/yo/JKDfmTr/qVlHOl4m0F+hpKGAAGEG5roBiISgKVKACGQ6jFyRUoAc4gA78HKCTufa025lrKKAX8EFvS7sHeleTmkd9gQ3YgWcWY0ClDBgvKmEMKCNGR/kxflTCuFAnEOKMVlWL+wNsSof8wQFurAAAAABJRU5ErkJggg==)](https://github.com/Slartibartfass2/IngredientGatherer/issues "Click to report issue")

# IngredientGatherer
A small program which gathers ingredients from recipes from different websites and adds them together to create a shopping list.

[Test it yourself!](https://slartibartfass2.github.io/IngredientGatherer)

## Requirements
To gather ingredients from different websites the **IngredientGatherer** performs cross-domain ajax requests but cross-origin
resource sharing is blocked in modern browsers by default. To unblock this feature you have to add and activate the CORS browser addon.
It's available for the following browsers:
- [Google Chrome](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf)
- [Mozilla Firefox](https://addons.mozilla.org/en-US/firefox/addon/access-control-allow-origin/)
- [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/allow-cors-accesscontro/bhjepjpgngghppolkjdhckmnfphffdag)

## Supported Websites
- [KptnCook](https://www.kptncook.com/)
- [Nora Cooks](https://www.noracooks.com/) (not fully, still WIP)
- [Eat This](https://www.eat-this.org/)
- [Bianca Zapatka](https://biancazapatka.com/de/)

## How to use
1. Insert the recipe URL in the left text input and the amount of people eating the corresponding meal into the right text input.
2. Add more recipes with the 'Add URL'-button.
3. When you're finished, click 'Collect Ingredients'.
4. The website begins to gather ingredients and will show its progress. A message will be displayed if errors occur.
5. When finished the ingredients will be shown in the text area at the bottom.
6. You can sort the ingredients with the buttons above the text area.
7. The content of the text area will be copied to your clipboard, so you can insert it into your shopping list (It was designed to work with Google Keep).