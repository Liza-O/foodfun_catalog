//  Общие функции 
function toggleFilter(header) {
    const filterItem = header.closest('.filter-item');
    filterItem.classList.toggle('active');
}

function positionTooltips() {
    const recipeCards = document.querySelectorAll('.recipe-card');
    recipeCards.forEach(card => {
        const tooltip = card.querySelector('.nutrition-tooltip');
        if (!tooltip) return;
        tooltip.classList.remove('left');
        const cardRect = card.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        if (cardRect.right + 160 > windowWidth) {
            tooltip.classList.add('left');
        }
    });
}

function setupTooltipZIndex() {
    const recipeCards = document.querySelectorAll('.recipe-card');
    recipeCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '100';
            const tooltip = card.querySelector('.nutrition-tooltip');
            if (tooltip) tooltip.style.zIndex = '10000';
        });
        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '1';
            const tooltip = card.querySelector('.nutrition-tooltip');
            if (tooltip) tooltip.style.zIndex = '9999';
        });
    });
}

const API_BASE = 'http://localhost:5138';

//  Загрузка фильтров 
async function loadDishTypes() {
    try {
        const response = await fetch(`${API_BASE}/api/recipes/dish-types`);
        if (!response.ok) throw new Error('Ошибка загрузки типов блюд');
        const dishTypes = await response.json();
        renderDishTypes(dishTypes);
    } catch (error) {
        console.error('Не удалось загрузить типы блюд:', error);
        const container = document.querySelector('.filter-item:first-child .checkbox-group');
        if (container) container.innerHTML = '<label class="checkbox-label">Ошибка загрузки</label>';
    }
}

function renderDishTypes(types) {
    const container = document.querySelector('.filter-item:first-child .checkbox-group');
    if (!container) return;
    container.innerHTML = '';
    types.forEach(type => {
        const label = document.createElement('label');
        label.className = 'checkbox-label';
        label.innerHTML = `
            <input type="checkbox" data-id="${type.id}">
            <span class="checkmark"></span>
            ${escapeHtml(type.name)}
        `;
        container.appendChild(label);
    });
}

async function loadIngredients() {
    try {
        const response = await fetch(`${API_BASE}/api/recipes/ingredients`);
        if (!response.ok) throw new Error('Ошибка загрузки ингредиентов');
        const ingredients = await response.json();
        renderIngredients(ingredients);
    } catch (error) {
        console.error('Не удалось загрузить ингредиенты:', error);
        const container = document.querySelector('.filter-item:nth-child(3) .checkbox-group');
        if (container) container.innerHTML = '<label class="checkbox-label">Ошибка загрузки</label>';
    }
}

function renderIngredients(ingredients) {
    const container = document.querySelector('.filter-item:nth-child(3) .checkbox-group');
    if (!container) return;
    container.innerHTML = '';
    ingredients.forEach(ing => {
        const label = document.createElement('label');
        label.className = 'checkbox-label';
        label.innerHTML = `
            <input type="checkbox" data-id="${ing.id}">
            <span class="checkmark"></span>
            ${escapeHtml(ing.name)}
        `;
        container.appendChild(label);
    });
}

//  Фильтрация
function getFilterParams() {
    const dishTypeIds = [];
    document.querySelectorAll('.filter-item:first-child .checkbox-group input[type="checkbox"]:checked').forEach(cb => {
        const id = cb.dataset.id;
        if (id) dishTypeIds.push(parseInt(id));
    });
    const ingredientIds = [];
    document.querySelectorAll('.filter-item:nth-child(3) .checkbox-group input[type="checkbox"]:checked').forEach(cb => {
        const id = cb.dataset.id;
        if (id) ingredientIds.push(parseInt(id));
    });
    const minTime = document.querySelector('.range-item:first-child input')?.value;
    const maxTime = document.querySelector('.range-item:last-child input')?.value;
    const searchTerm = document.querySelector('.search-input')?.value;
    return { dishTypeIds, ingredientIds, minTime, maxTime, searchTerm };
}
// Загрузка рецептов 
async function loadRecipesWithFilters() {
    const params = getFilterParams();
    const urlParams = new URLSearchParams();
    params.dishTypeIds.forEach(id => urlParams.append('dishTypeIds', id));
    params.ingredientIds.forEach(id => urlParams.append('ingredientIds', id));
    if (params.minTime) urlParams.append('minTime', params.minTime);
    if (params.maxTime) urlParams.append('maxTime', params.maxTime);
    if (params.searchTerm) urlParams.append('searchTerm', params.searchTerm);

    const url = `${API_BASE}/api/recipes?${urlParams.toString()}`;
    console.log('Запрос с фильтрами:', url);
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Ошибка загрузки рецептов');
        const recipes = await response.json();
        renderRecipes(recipes);
        const resultEl = document.querySelector('.catalog-title .text-pseudo');
        if (resultEl) {
            resultEl.textContent = `Всего результатов: ${recipes.length}`;
        }
    } catch (error) {
        console.error('Не удалось загрузить рецепты:', error);
        const container = document.querySelector('.catalog .container-cards');
        if (container) container.innerHTML = '<p class="text-normal">Не удалось загрузить рецепты</p>';
    }
}

function formatIngredients(recipe) {
    if (!recipe.recipeIngredients || recipe.recipeIngredients.length === 0) {
        return '';
    }
    const names = recipe.recipeIngredients
        .map(ri => ri.ingredient?.name)
        .filter(name => name);
    if (names.length === 0) return '';
    const first = names[0];
    const rest = names.slice(1).map(name => name.toLowerCase());
    return [first, ...rest].join(', ');
}

function renderRecipes(recipes) {
    const catalog = document.querySelector('.catalog');
    const oldContainers = catalog.querySelectorAll('.container-cards');
    oldContainers.forEach(container => container.remove());

    const container = document.createElement('div');
    container.className = 'container-cards';

    if (recipes.length === 0) {
        container.innerHTML = '<p class="text-normal">Рецепты не найдены</p>';
    } else {
        recipes.forEach(recipe => {
            const card = document.createElement('a');
            card.href = `recipe.html?id=${recipe.id}`;
            card.className = 'recipe-card';
            card.dataset.id = recipe.id;

            const ingCount = recipe.recipeIngredients ? recipe.recipeIngredients.length : 0;
            const timeText = `${recipe.cookingTimeMinutes} мин`;
            const ingredientsText = formatIngredients(recipe);

            card.innerHTML = `
                <img src="${recipe.imagePath || 'img/default-image.png'}" alt="${escapeHtml(recipe.title)}" class="recipe-img" onerror="this.src='img/default-image.png';">
                <div class="favorite-icon ${recipe.isFavorite ? 'active' : ''}" data-id="${recipe.id}"></div>
                <div class="recipe-text">
                    <p class="text-large">${escapeHtml(recipe.title)}</p>
                    <p class="text-normal recipe-ingredients" title="${escapeHtml(ingredientsText)}">${escapeHtml(ingredientsText)}</p>
                    <div class="specifications">
                        <div class="icon-text">
                            <img src="img/icon-clock.png" alt="Иконка часов" class="icon" onerror="this.src='img/default-image.png';">
                            <p class="text-normal text-accent">${timeText}</p>
                        </div>
                        <div class="icon-text">
                            <img src="img/icon-ingredients.png" alt="Иконка ингредиентов" class="icon" onerror="this.src='img/default-image.png';">
                            <p class="text-normal text-accent">${ingCount} ингредиентов</p>
                        </div>
                    </div>
                </div>
                <div class="nutrition-tooltip">
                    <div class="tooltip-calories">загрузка...</div>
                </div>
            `;
            //КБЖУ при наведении     
            card.addEventListener('mouseenter', async function onCardHover() {
                const tooltip = this.querySelector('.nutrition-tooltip');
                if (tooltip.classList.contains('loaded') || tooltip.classList.contains('loading')) return;
                tooltip.classList.add('loading');
                const recipeId = this.dataset.id;
                try {
                    const response = await fetch(`${API_BASE}/api/recipes/${recipeId}/nutrition`);
                    if (!response.ok) throw new Error('Ошибка загрузки КБЖУ');
                    const data = await response.json();
                    tooltip.innerHTML = `
                        <div class="tooltip-calories">${data.caloriesPer100g} <span>ккал / 100 г</span></div>
                        <div class="tooltip-macros">
                            <div><span class="macro-name">Белки</span> <span class="macro-value">${data.proteinPer100g} г</span></div>
                            <div><span class="macro-name">Жиры</span> <span class="macro-value">${data.fatPer100g} г</span></div>
                            <div><span class="macro-name">Углеводы</span> <span class="macro-value">${data.carbsPer100g} г</span></div>
                        </div>
                    `;
                    tooltip.classList.add('loaded');
                } catch (error) {
                    console.error('Не удалось загрузить КБЖУ:', error);
                    tooltip.innerHTML = '<div class="tooltip-calories">ошибка</div>';
                } finally {
                    tooltip.classList.remove('loading');
                }
            });

            container.appendChild(card);
        });
    }

    const title = catalog.querySelector('.catalog-title');
    if (title) {
        title.after(container);
    } else {
        catalog.appendChild(container);
    }

    positionTooltips();
    setupTooltipZIndex();
}

//  Умный поиск 
async function fetchSearchSuggestions(query) {
    if (!query.trim()) {
        hideSuggestions();
        return;
    }
    try {
        const response = await fetch(`${API_BASE}/api/recipes/search-suggestions?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Ошибка загрузки подсказок');
        const suggestions = await response.json();
        showSuggestions(suggestions);
    } catch (error) {
        console.error('Не удалось загрузить подсказки:', error);
        hideSuggestions();
    }
}

function showSuggestions(suggestions) {
    const popups = document.getElementById('popups');
    popups.innerHTML = '';
    if (suggestions.length === 0) {
        popups.style.display = 'none';
        return;
    }
    suggestions.forEach(title => {
        const div = document.createElement('div');
        div.textContent = title;
        div.addEventListener('click', () => {
            document.querySelector('.search-input').value = title;
            hideSuggestions();
            loadRecipesWithFilters();
        });
        popups.appendChild(div);
    });
    popups.style.display = 'block';
}

function hideSuggestions() {
    document.getElementById('popups').style.display = 'none';
}

let searchTimeout;
function handleSearchInput(e) {
    const query = e.target.value;
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        fetchSearchSuggestions(query);
    }, 300);
}

//  Избранное 
document.querySelector('.catalog').addEventListener('click', async (e) => {
    const fav = e.target.closest('.favorite-icon');
    if (!fav) return;
    e.preventDefault();
    e.stopPropagation();

    const recipeId = fav.dataset.id;
    const newStatus = !fav.classList.contains('active');
    fav.style.pointerEvents = 'none';

    try {
        const response = await fetch(`${API_BASE}/api/recipes/${recipeId}/favorite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newStatus),
        });
        if (!response.ok) throw new Error('Ошибка обновления избранного');
        const result = await response.json();
        fav.classList.toggle('active', result.isFavorite);
    } catch (error) {
        console.error('Не удалось обновить избранное:', error);
        fav.classList.toggle('active', !newStatus);
    } finally {
        fav.style.pointerEvents = 'auto';
    }
});

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), delay);
    };
}

//  Инициализация 
document.addEventListener('DOMContentLoaded', () => {
    positionTooltips();
    setupTooltipZIndex();
    loadDishTypes();
    loadIngredients();
    loadRecipesWithFilters();

    document.querySelector('.filter-group').addEventListener('change', (e) => {
        if (e.target.matches('input[type="checkbox"]')) {
            loadRecipesWithFilters();
        }
    });

    document.querySelectorAll('.range-number').forEach(input => {
        input.addEventListener('input', debounce(loadRecipesWithFilters, 500));
    });

    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
        searchInput.addEventListener('blur', () => {
            setTimeout(hideSuggestions, 200);
        });
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                hideSuggestions();
                loadRecipesWithFilters();
            }
        });
    }
});

window.addEventListener('resize', positionTooltips);
window.addEventListener('load', positionTooltips);

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}