document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const errorContainer = document.getElementById('errorMessages');

    const fields = {
        lastname: document.getElementById('lastname'),
        firstname: document.getElementById('firstname'),
        phone: document.getElementById('phone'),
        age: document.getElementById('age'),
        email: document.getElementById('email'),
        date: document.getElementById('date'),
        message: document.getElementById('message')
    };

    const validators = {
        lastname: (value) => {
            if (value.length < 2) {
                return 'Фамилия должна содержать минимум 2 символа';
            }
            if (/[^а-яёА-ЯЁ]/.test(value)) {
                return 'Фамилия должна содержать только кириллические буквы';
            }
            return null;
        },

        firstname: (value) => {
            if (value.length < 2) {
                return 'Имя должно содержать минимум 2 символа';
            }
            if (/[^а-яёА-ЯЁ]/.test(value)) {
                return 'Имя должно содержать только кириллические буквы';
            }
            return null;
        },

        phone: (value) => {
            const phoneRegex = /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/;
            if (!phoneRegex.test(value.trim())) {
                return 'Телефон должен быть в формате +7 (ХХХ) ХХХ-ХХ-ХХ';
            }
            return null;
        },

        age: (value) => {
            if (!/^\d+$/.test(value)) {
                return 'Возраст должен быть целым числом';
            }
            const age = parseInt(value, 10);
            if (age < 18 || age > 120) {
                return 'Возраст должен быть от 18 до 120 лет';
            }
            return null;
        },

        email: (value) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$/;
    if (!emailRegex.test(value.trim())) {
        return 'Введите корректный email в формате example@domain.com';
    }
    return null;
},


        date: (value) => {
            const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4})$/;
            if (!dateRegex.test(value.trim())) {
                return 'Дата должна быть в формате ДД.ММ.ГГГГ (например, 25.12.2024)';
            }
            
            const matches = value.match(dateRegex);
            const day = parseInt(matches[1], 10);
            const month = parseInt(matches[2], 10);
            const year = parseInt(matches[3], 10);
            
            // Проверка корректности даты
            const date = new Date(year, month - 1, day);
            if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
                return 'Некорректная дата';
            }
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const maxAllowedDate = new Date();
            maxAllowedDate.setFullYear(today.getFullYear() + 1);
            
            if (date < today) {
                return 'Дата не может быть раньше сегодняшнего дня';
            }
            
            if (date > maxAllowedDate) {
                return 'Дата не может быть более чем через 1 год от сегодняшнего дня';
            }
            
            return null;
        },

        message: (value) => {
            if (value.trim().length < 10) {
                return 'Сообщение должно содержать не менее 10 символов';
            }
            return null;
        }
    };

    // Ограничение ввода для поля даты - только цифры и точки
    fields.date.addEventListener('keydown', function(e) {
        // Разрешаем: backspace, delete, tab, escape, enter, стрелки, Home, End
        if ([8, 9, 13, 27, 37, 38, 39, 40, 36, 35, 46].includes(e.keyCode)) {
            return;
        }
        
        // Разрешаем только цифры и точку
        if (!/[0-9.]/.test(e.key)) {
            e.preventDefault();
            return;
        }
        
        // Если это точка, проверяем можно ли её вводить
        if (e.key === '.') {
            const cursorPos = this.selectionStart;
            const value = this.value;
            
            // Запрещаем точку в начале
            if (cursorPos === 0) {
                e.preventDefault();
                return;
            }
            
            // Запрещаем две точки подряд
            if (value[cursorPos - 1] === '.') {
                e.preventDefault();
                return;
            }
            
            // Запрещаем больше двух точек
            const dotCount = (value.match(/\./g) || []).length;
            if (dotCount >= 2) {
                e.preventDefault();
                return;
            }
        }
    });

    // Ограничиваем длину ФИО 20 символами
    ['lastname', 'firstname'].forEach(fieldName => {
        const field = fields[fieldName];
        field.addEventListener('input', function() {
            if (this.value.length > 20) {
                this.value = this.value.slice(0, 20);
            }
        });
    });

    // Ограничение ввода в возрасте (только цифры)
    fields.age.addEventListener('input', () => {
        fields.age.value = fields.age.value.replace(/\D/g, '');
    });

    // Форматирование телефона при вводе
    fields.phone.addEventListener('input', function() {
        let digits = this.value.replace(/\D/g, '');

        if (digits.startsWith('8')) {
            digits = '7' + digits.slice(1);
        } else if (!digits.startsWith('7')) {
            digits = '7' + digits;
        }

        digits = digits.slice(0, 11);

        let formatted = '+7 ';
        if (digits.length > 1) {
            formatted += '(' + digits.slice(1, 4);
        }
        if (digits.length >= 4) {
            formatted += ') ' + digits.slice(4, 7);
        }
        if (digits.length >= 7) {
            formatted += '-' + digits.slice(7, 9);
        }
        if (digits.length >= 9) {
            formatted += '-' + digits.slice(9, 11);
        }

        this.value = formatted;
    });

    // Ограничение сообщения – запрещаем ввод более 500 символов
    fields.message.addEventListener('input', function() {
        if (this.value.length > 500) {
            this.value = this.value.slice(0, 500);
        }
    });

    Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        const hint = field.parentElement.querySelector('.form-hint');
        const error = field.parentElement.querySelector('.form-error');

        field.addEventListener('focus', () => {
            hint.style.display = 'block';
            error.classList.remove('visible');
            field.classList.remove('error');
        });

        field.addEventListener('blur', () => {
            hint.style.display = 'none';
            const value = field.value.trim();
            if (value !== '') {
                const errorMessage = validators[fieldName](value);
                if (errorMessage) {
                    error.textContent = errorMessage;
                    error.classList.add('visible');
                    field.classList.add('error');
                } else {
                    error.classList.remove('visible');
                    field.classList.remove('error');
                }
            } else {
                error.classList.remove('visible');
                field.classList.remove('error');
            }
        });

        field.addEventListener('input', () => {
             hint.style.display = 'block'; 
            error.classList.remove('visible');
            field.classList.remove('error');
        });
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const errors = [];
        let hasErrors = false;

        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            const error = field.parentElement.querySelector('.form-error');
            const value = field.value.trim();

            if (value === '') {
                errors.push(`Поле "${field.labels[0].textContent}" обязательно для заполнения`);
                error.textContent = 'Это поле обязательно для заполнения';
                error.classList.add('visible');
                field.classList.add('error');
                hasErrors = true;
            } else {
                const errorMessage = validators[fieldName](value);
                if (errorMessage) {
                    errors.push(errorMessage);
                    error.textContent = errorMessage;
                    error.classList.add('visible');
                    field.classList.add('error');
                    hasErrors = true;
                } else {
                    error.classList.remove('visible');
                    field.classList.remove('error');
                }
            }
        });

        if (hasErrors) {
            errorContainer.innerHTML = '<strong>Пожалуйста, исправьте следующие ошибки:</strong><ul>' +
                errors.map(err => `<li>${err}</li>`).join('') + '</ul>';
            errorContainer.style.display = 'block';
        } else {
            errorContainer.style.display = 'none';
            alert('Форма успешно отправлена!');
            form.reset();
        }
    });
});