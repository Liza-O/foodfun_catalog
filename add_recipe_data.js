document.addEventListener('DOMContentLoaded', async function () {
    const API_BASE = 'http://localhost:5138';

    try {
        // Загрузка справочников с сервера
        const [dishTypesResponse, ingredientsResponse, unitsResponse] = await Promise.all([
            fetch(`${API_BASE}/api/recipes/dish-types`),
            fetch(`${API_BASE}/api/recipes/ingredients`),
            fetch(`${API_BASE}/api/recipes/units`)
        ]);

        if (!dishTypesResponse.ok) throw new Error('Ошибка загрузки типов блюд');
        if (!ingredientsResponse.ok) throw new Error('Ошибка загрузки ингредиентов');
        if (!unitsResponse.ok) throw new Error('Ошибка загрузки единиц измерения');

        const dishTypes = await dishTypesResponse.json();
        const ingredients = await ingredientsResponse.json();
        const units = await unitsResponse.json();

        window.allIngredients = ingredients; // для блокировки повторов

        // Заполнение селектов типов блюд
        const dishTypeSelects = document.querySelectorAll('.dish-type-select');
        dishTypeSelects.forEach(select => {
            select.innerHTML = '';
            const placeholderOption = document.createElement('option');
            placeholderOption.value = '';
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            placeholderOption.textContent = 'Выберите тип';
            select.appendChild(placeholderOption);

            dishTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type.id;
                option.textContent = type.name;
                select.appendChild(option);
            });
        });

        // Заполнение селектов единиц измерения
        const unitSelects = document.querySelectorAll('.unit-select');
        unitSelects.forEach(select => {
            select.innerHTML = '';
            units.forEach(unit => {
                const option = document.createElement('option');
                option.value = unit.id;
                option.textContent = unit.name;
                select.appendChild(option);
            });
        });

        // Заполнение селектов ингредиентов (с блокировкой, если функция доступна)
        if (window.updateIngredientSelects) {
            window.updateIngredientSelects();
        } else {
            const ingredientSelects = document.querySelectorAll('.ingredient-select');
            ingredientSelects.forEach(select => {
                select.innerHTML = '';
                const placeholderOption = document.createElement('option');
                placeholderOption.value = '';
                placeholderOption.disabled = true;
                placeholderOption.selected = true;
                placeholderOption.textContent = 'Выберите ингредиент';
                select.appendChild(placeholderOption);

                ingredients.forEach(ing => {
                    const option = document.createElement('option');
                    option.value = ing.id;
                    option.textContent = ing.name;
                    select.appendChild(option);
                });
            });
        }

    } catch (error) {
        console.error('Ошибка загрузки справочников:', error);
        // Показ сообщений об ошибке в селектах
        document.querySelectorAll('.dish-type-select').forEach(select => {
            select.innerHTML = '<option value="" disabled selected>Ошибка загрузки</option>';
        });
        document.querySelectorAll('.ingredient-select').forEach(select => {
            select.innerHTML = '<option value="" disabled selected>Ошибка загрузки</option>';
        });
        document.querySelectorAll('.unit-select').forEach(select => {
            select.innerHTML = '<option value="" disabled selected>Ошибка загрузки</option>';
        });
    }
});