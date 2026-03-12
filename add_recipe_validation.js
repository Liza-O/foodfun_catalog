document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('addRecipeForm');

    // Показ имени выбранного файла
    function initFileInput() {
        const fileInput = document.getElementById('cover');
        const fileLabel = document.querySelector('label[for="cover"]');
        if (fileInput && fileLabel) {
            fileInput.addEventListener('change', function () {
                fileLabel.textContent = this.files.length ? this.files[0].name : 'Выберите файл';
            });
        }
    }

    // Статические поля формы
    const staticFields = {
        title: document.getElementById('title'),
        cookingTime: document.getElementById('cookingTime'),
        description: document.getElementById('description'),
        calories: document.getElementById('calories'),
        protein: document.getElementById('protein'),
        fat: document.getElementById('fat'),
        carbs: document.getElementById('carbs'),
        cover: document.getElementById('cover')
    };

    // Правила валидации для статических полей
    const validators = {
        title: {
            validate: (value) => {
                if (value === '') return 'Поле обязательно';
                if (value.length < 5) return 'Минимум 5 символов';
                if (value.length > 100) return 'Максимум 100 символов';
                return null;
            },
            maxLength: 100
        },
        cookingTime: {
            validate: (value) => {
                if (value === '') return 'Поле обязательно';
                if (!/^\d+$/.test(value)) return 'Должно быть целым числом';
                const num = parseInt(value, 10);
                if (num < 1 || num > 200) return 'Значение от 1 до 200';
                return null;
            },
            isNumber: true
        },
        description: {
            validate: (value) => {
                if (value === '') return 'Поле обязательно';
                if (value.length < 20) return 'Минимум 20 символов';
                if (value.length > 1000) return 'Максимум 1000 символов';
                return null;
            },
            maxLength: 1000
        },
        calories: {
            validate: (value) => {
                if (value === '') return 'Поле обязательно';
                if (!/^\d+$/.test(value)) return 'Должно быть целым числом';
                const num = parseInt(value, 10);
                if (num < 1 || num > 1000) return 'Значение от 1 до 1000';
                return null;
            },
            isNumber: true
        },
        protein: {
            validate: (value) => {
                if (value === '') return 'Поле обязательно';
                if (!/^\d+$/.test(value)) return 'Должно быть целым числом';
                const num = parseInt(value, 10);
                if (num < 1 || num > 200) return 'Значение от 1 до 200';
                return null;
            },
            isNumber: true
        },
        fat: {
            validate: (value) => {
                if (value === '') return 'Поле обязательно';
                if (!/^\d+$/.test(value)) return 'Должно быть целым числом';
                const num = parseInt(value, 10);
                if (num < 1 || num > 200) return 'Значение от 1 до 200';
                return null;
            },
            isNumber: true
        },
        carbs: {
            validate: (value) => {
                if (value === '') return 'Поле обязательно';
                if (!/^\d+$/.test(value)) return 'Должно быть целым числом';
                const num = parseInt(value, 10);
                if (num < 1 || num > 200) return 'Значение от 1 до 200';
                return null;
            },
            isNumber: true
        },
        cover: {
            validate: (files) => {
                if (files.length === 0) return 'Поле обязательно';
                const file = files[0];
                const allowedTypes = ['image/jpeg', 'image/png'];
                if (!allowedTypes.includes(file.type)) return 'Формат: .jpg, .png';
                return null;
            }
        }
    };

    // Валидация выпадающих списков
    function validateIngredientSelect(select) {
        return select.value && select.value !== '' ? null : 'Выберите ингредиент';
    }

    function validateDishTypeSelect(select) {
        return select.value && select.value !== '' ? null : 'Выберите тип блюда';
    }

    function validateIngredientQuantity(value) {
        if (value === '') return 'Поле обязательно';
        if (!/^\d+$/.test(value)) return 'Должно быть целым числом';
        const num = parseInt(value, 10);
        if (num < 1 || num > 200) return 'Значение от 1 до 200';
        return null;
    }

    function validateStepInput(value) {
        if (value === '') return 'Поле обязательно';
        if (value.length < 5) return 'Минимум 5 символов';
        if (value.length > 200) return 'Максимум 200 символов';
        return null;
    }

    // Настройка валидации для конкретного поля
    function setupFieldValidation(field, validator, hintElement, errorElement) {
        if (!field) return;

        if (validator.maxLength) {
            field.addEventListener('input', function () {
                if (this.value.length > validator.maxLength) {
                    this.value = this.value.slice(0, validator.maxLength);
                }
            });
        }

        if (validator.isNumber) {
            field.addEventListener('input', function () {
                this.value = this.value.replace(/[^\d]/g, '');
            });
        }

        const onFocus = () => {
            hintElement.style.display = 'block';
            errorElement.classList.remove('visible');
            field.classList.remove('error');
        };

        const onBlur = () => {
            const value = field.type === 'file' ? field.files : field.value.trim();
            const errorMessage = validator.validate(value);
            if (errorMessage) {
                hintElement.style.display = 'none';
                errorElement.textContent = errorMessage;
                errorElement.classList.add('visible');
                field.classList.add('error');
            } else {
                hintElement.style.display = 'block';
                errorElement.classList.remove('visible');
                field.classList.remove('error');
            }
        };

        const onInput = () => {
            hintElement.style.display = 'block';
            errorElement.classList.remove('visible');
            field.classList.remove('error');
        };

        field.removeEventListener('focus', onFocus);
        field.removeEventListener('blur', onBlur);
        field.removeEventListener('input', onInput);
        field.addEventListener('focus', onFocus);
        field.addEventListener('blur', onBlur);
        field.addEventListener('input', onInput);
    }

    // Инициализация статических полей
    Object.keys(staticFields).forEach(key => {
        const field = staticFields[key];
        if (!field) return;
        const parent = field.closest('.form-field') || field.closest('.media-field');
        if (!parent) return;
        const hint = parent.querySelector('.form-hint');
        const error = parent.querySelector('.form-error');
        if (hint && error) {
            setupFieldValidation(field, validators[key], hint, error);
        }
    });

    // Инициализация поля "Тип блюда"
    function initDishTypeField() {
        const select = document.querySelector('.dish-type-select');
        if (!select) return;
        const parent = select.closest('.form-field');
        const hint = parent?.querySelector('.form-hint');
        const error = parent?.querySelector('.form-error');
        if (!hint || !error) return;

        const onFocus = () => {
            hint.style.display = 'block';
            error.classList.remove('visible');
            select.classList.remove('error');
        };

        const onBlur = () => {
            const errorMessage = validateDishTypeSelect(select);
            if (errorMessage) {
                hint.style.display = 'none';
                error.textContent = errorMessage;
                error.classList.add('visible');
                select.classList.add('error');
            } else {
                hint.style.display = 'block';
                error.classList.remove('visible');
                select.classList.remove('error');
            }
        };

        const onChange = () => {
            error.classList.remove('visible');
            select.classList.remove('error');
            hint.style.display = 'block';
        };

        select.addEventListener('focus', onFocus);
        select.addEventListener('blur', onBlur);
        select.addEventListener('change', onChange);
    }

    // Инициализация строки ингредиента
    function initIngredientRow(row) {
        const select = row.querySelector('.ingredient-select');
        const quantityInput = row.querySelector('.ingredient-quantity');
        const selectParent = select?.closest('.form-field');
        const quantityParent = quantityInput?.closest('.form-field');

        if (select && selectParent) {
            const hint = selectParent.querySelector('.form-hint');
            const error = selectParent.querySelector('.form-error');

            const onFocus = () => {
                hint.style.display = 'block';
                error.classList.remove('visible');
                select.classList.remove('error');
            };
            const onBlur = () => {
                const errorMessage = validateIngredientSelect(select);
                if (errorMessage) {
                    hint.style.display = 'none';
                    error.textContent = errorMessage;
                    error.classList.add('visible');
                    select.classList.add('error');
                } else {
                    hint.style.display = 'block';
                    error.classList.remove('visible');
                    select.classList.remove('error');
                }
            };
            const onChange = () => {
                error.classList.remove('visible');
                select.classList.remove('error');
                hint.style.display = 'block';
                if (window.updateIngredientSelects) window.updateIngredientSelects();
            };

            select.addEventListener('focus', onFocus);
            select.addEventListener('blur', onBlur);
            select.addEventListener('change', onChange);
        }

        if (quantityInput && quantityParent) {
            const hint = quantityParent.querySelector('.form-hint');
            const error = quantityParent.querySelector('.form-error');
            setupFieldValidation(quantityInput, {
                validate: validateIngredientQuantity,
                isNumber: true,
                maxLength: 3
            }, hint, error);
        }
    }

    // Инициализация строки шага
    function initStepRow(row) {
        const input = row.querySelector('.step-input');
        const hint = row.querySelector('.form-hint');
        const error = row.querySelector('.form-error');
        if (input && hint && error) {
            setupFieldValidation(input, {
                validate: validateStepInput,
                maxLength: 200
            }, hint, error);
        }
    }

    // Запуск инициализации существующих полей
    initDishTypeField();
    document.querySelectorAll('.ingredient-row').forEach(initIngredientRow);
    document.querySelectorAll('.step-row').forEach(initStepRow);
    initFileInput();

    // Отслеживание добавления новых строк
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.matches?.('.ingredient-row')) initIngredientRow(node);
                    if (node.matches?.('.step-row')) initStepRow(node);
                    const ingRow = node.querySelector?.('.ingredient-row');
                    if (ingRow) initIngredientRow(ingRow);
                    const stepRow = node.querySelector?.('.step-row');
                    if (stepRow) initStepRow(stepRow);
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Валидация одного поля при отправке
    function validateField(field, containerSelector, getErrorMessage) {
        if (!field) return false;
        const container = field.closest(containerSelector);
        if (!container) return false;

        const errorEl = container.querySelector('.form-error');
        const hintEl = container.querySelector('.form-hint');
        const errorMessage = getErrorMessage(field);

        if (errorMessage) {
            field.classList.add('error');
            if (errorEl) {
                errorEl.textContent = errorMessage;
                errorEl.classList.add('visible');
            }
            if (hintEl) hintEl.style.display = 'none';
            return true;
        } else {
            field.classList.remove('error');
            if (errorEl) errorEl.classList.remove('visible');
            if (hintEl) hintEl.style.display = '';
            return false;
        }
    }

    // Глобальная функция обновления доступных ингредиентов (блокировка повторов)
    window.updateIngredientSelects = function () {
        const selects = document.querySelectorAll('.ingredient-select');
        const selectedValues = [];
        selects.forEach(select => {
            if (select.value && select.value !== '') selectedValues.push(select.value);
        });

        selects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = '';

            const placeholderOption = document.createElement('option');
            placeholderOption.value = '';
            placeholderOption.disabled = true;
            placeholderOption.selected = !currentValue;
            placeholderOption.textContent = 'Выберите ингредиент';
            select.appendChild(placeholderOption);

            if (window.allIngredients) {
                window.allIngredients.forEach(ing => {
                    const option = document.createElement('option');
                    option.value = ing.id;
                    option.textContent = ing.name;
                    const ingIdStr = ing.id.toString();
                    if (selectedValues.includes(ingIdStr) && ingIdStr !== currentValue) {
                        option.disabled = true;
                    }
                    if (ingIdStr === currentValue) option.selected = true;
                    select.appendChild(option);
                });
            }
        });
    };

    // Отправка формы
    const API_BASE = 'http://localhost:5138';

    async function submitForm(formData) {
        try {
            const response = await fetch(`${API_BASE}/api/recipes`, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('Ошибка сервера:', errorData);
                alert('Ошибка при сохранении рецепта. Проверьте введённые данные.');
                return;
            }
            alert('Рецепт успешно добавлен!');
            window.location.href = 'recipes.html';
        } catch (error) {
            console.error('Ошибка отправки:', error);
            alert('Произошла ошибка при отправке. Попробуйте позже.');
        }
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        let hasErrors = false;

        // Проверка статических полей
        Object.keys(staticFields).forEach(key => {
            const field = staticFields[key];
            const containerSelector = field?.closest('.media-field') ? '.media-field' : '.form-field';
            const getError = (f) => {
                if (f.type === 'file') return validators[key].validate(f.files);
                const val = f.value.trim();
                if (val === '') return 'Поле обязательно';
                return validators[key].validate(val);
            };
            if (validateField(field, containerSelector, getError)) hasErrors = true;
        });

        // Проверка типа блюда
        const dishTypeSelect = document.querySelector('.dish-type-select');
        if (dishTypeSelect) {
            const getError = (select) => validateDishTypeSelect(select);
            if (validateField(dishTypeSelect, '.form-field', getError)) hasErrors = true;
        }

        // Проверка ингредиентов
        document.querySelectorAll('.ingredient-row').forEach(row => {
            const select = row.querySelector('.ingredient-select');
            const quantity = row.querySelector('.ingredient-quantity');
            if (select) {
                const getError = (s) => validateIngredientSelect(s);
                if (validateField(select, '.form-field', getError)) hasErrors = true;
            }
            if (quantity) {
                const getError = (q) => validateIngredientQuantity(q.value.trim());
                if (validateField(quantity, '.form-field', getError)) hasErrors = true;
            }
        });

        // Проверка шагов
        document.querySelectorAll('.step-row').forEach(row => {
            const input = row.querySelector('.step-input');
            if (!input) return;
            const getError = (inp) => validateStepInput(inp.value.trim());
            if (validateField(input, '.step-field', getError)) hasErrors = true;
        });

        if (hasErrors) return;

        // Сбор данных формы
        const formData = new FormData();
        formData.append('Title', staticFields.title.value.trim());
        formData.append('CookingTimeMinutes', staticFields.cookingTime.value.trim());
        formData.append('DishTypeId', dishTypeSelect.value);
        formData.append('Description', staticFields.description.value.trim());
        formData.append('CaloriesPer100g', staticFields.calories.value.trim());
        formData.append('ProteinPer100g', staticFields.protein.value.trim());
        formData.append('FatPer100g', staticFields.fat.value.trim());
        formData.append('CarbsPer100g', staticFields.carbs.value.trim());
        if (staticFields.cover.files[0]) {
            formData.append('Cover', staticFields.cover.files[0]);
        }

        const ingredientRows = document.querySelectorAll('.ingredient-row');
        ingredientRows.forEach((row, index) => {
            const select = row.querySelector('.ingredient-select');
            const quantity = row.querySelector('.ingredient-quantity');
            const unitSelect = row.querySelector('.unit-select');
            if (select && quantity && unitSelect) {
                formData.append(`Ingredients[${index}].IngredientId`, select.value);
                formData.append(`Ingredients[${index}].Quantity`, quantity.value.trim());
                formData.append(`Ingredients[${index}].UnitId`, unitSelect.value);
            }
        });

        const stepRows = document.querySelectorAll('.step-row');
        stepRows.forEach((row, index) => {
            const input = row.querySelector('.step-input');
            if (input) {
                formData.append(`Steps[${index}].StepNumber`, index + 1);
                formData.append(`Steps[${index}].Description`, input.value.trim());
            }
        });

        submitForm(formData);
    });
});