document.addEventListener('DOMContentLoaded', function () {

    const addIngredientBtn = document.querySelector('.add-ingredient-btn');
    const ingredientsList = document.querySelector('.ingredients-list');

    if (addIngredientBtn && ingredientsList) {
        addIngredientBtn.addEventListener('click', function () {
            const lastRow = ingredientsList.querySelector('.ingredient-row:last-child');
            if (!lastRow) return;

            const newRow = lastRow.cloneNode(true);
            // Очистка полей
            newRow.querySelectorAll('input, select').forEach(field => {
                if (field.tagName === 'INPUT') field.value = '';
                else if (field.tagName === 'SELECT') field.selectedIndex = 0;
            });

            // Замена заглушки на кнопку удаления
            const placeholder = newRow.querySelector('.form-field--placeholder');
            if (placeholder) {
                placeholder.classList.remove('form-field--placeholder');
                placeholder.classList.add('form-field--remove');
                placeholder.innerHTML = ''; // удаляем всё содержимое

                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'remove-btn';
                removeBtn.setAttribute('aria-label', 'Удалить ингредиент');

                // Обработчик клика с предотвращением всплытия
                removeBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const row = e.currentTarget.closest('.ingredient-row');
                    if (row) {
                        row.remove();
                        // Обновляем доступность ингредиентов в других строках
                        if (typeof window.updateIngredientSelects === 'function') {
                            window.updateIngredientSelects();
                        }
                    }
                });

                placeholder.appendChild(removeBtn);
            }

            ingredientsList.appendChild(newRow);

            // Обновляем доступность ингредиентов после добавления новой строки
            if (typeof window.updateIngredientSelects === 'function') {
                window.updateIngredientSelects();
            }
        });
    }

    //  Добавление шагов 
    const addStepBtn = document.querySelector('.add-step-btn');
    const stepsList = document.querySelector('.steps-list');

    if (addStepBtn && stepsList) {
        // Обновление номеров шагов после изменений
        function updateStepNumbers() {
            const stepRows = stepsList.querySelectorAll('.step-row');
            stepRows.forEach((row, index) => {
                const label = row.querySelector('.form-label');
                if (label) label.textContent = `Шаг ${index + 1} *`;
            });
        }

        // Создание кнопки удаления для шага
        function createStepRemoveButton() {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'step-remove-btn';
            btn.setAttribute('aria-label', 'Удалить шаг');
            btn.addEventListener('click', function (e) {
                const row = e.target.closest('.step-row');
                if (row) {
                    row.remove();
                    updateStepNumbers();
                }
            });
            return btn;
        }

        addStepBtn.addEventListener('click', function () {
            const lastRow = stepsList.querySelector('.step-row:last-child');
            if (!lastRow) return;

            const newRow = lastRow.cloneNode(true);
            const input = newRow.querySelector('.step-input');
            if (input) input.value = '';

            // Замена заглушки на контейнер с кнопкой удаления
            const placeholder = newRow.querySelector('.step-placeholder');
            if (placeholder) {
                const removeContainer = document.createElement('div');
                removeContainer.className = 'step-remove-container';
                const removeBtn = createStepRemoveButton();
                removeContainer.appendChild(removeBtn);
                placeholder.replaceWith(removeContainer);
            }

            stepsList.appendChild(newRow);
            updateStepNumbers();
        });

        updateStepNumbers();
    }
});