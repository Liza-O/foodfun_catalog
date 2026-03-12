document.addEventListener('DOMContentLoaded', function() {
    // Класс для загрузки ингредиентов
    class IngredientsLoader {
        constructor() {
            this.container = document.querySelector('.catalog-container');
            this.shownCountElem = document.getElementById('shownCount');
            this.loadMoreBtn = document.getElementById('loadMoreBtn');
            
            if (this.container && this.shownCountElem && this.loadMoreBtn) {
                this.init();
            }
        }
        
        init() {
            this.allIngredients = Array.from(this.container.children);
            this.batchSize = 12;
            this.shownCount = 0;
            
            this.setupEventListeners();
            this.showInitialBatch();
        }
        
        setupEventListeners() {
            this.loadMoreBtn.addEventListener('click', () => this.showNextBatch());
        }
        
        showInitialBatch() {
            this.allIngredients.forEach((elem, index) => {
                if (index >= this.batchSize) {
                    elem.style.display = 'none';
                } else {
                    elem.style.display = 'flex';
                }
            });
            this.shownCount = Math.min(this.batchSize, this.allIngredients.length);
            this.updateCounter();
        }
        
        showNextBatch() {
            const nextCount = Math.min(this.shownCount + this.batchSize, this.allIngredients.length);
            for (let i = this.shownCount; i < nextCount; i++) {
                this.allIngredients[i].style.display = 'flex';
            }
            this.shownCount = nextCount;
            this.updateCounter();

            if (this.shownCount >= this.allIngredients.length) {
                this.loadMoreBtn.disabled = true;
                this.loadMoreBtn.style.cursor = 'default';
                this.loadMoreBtn.style.opacity = '0.5';
            }
        }
        
        updateCounter() {
            this.shownCountElem.textContent = `Показано: ${this.shownCount} из ${this.allIngredients.length}`;
        }
    }

    // Класс для галереи рецептов
    class RecipesGallery {
        constructor(container) {
            this.track = container.querySelector('.recipes-gallery-track');
            this.cards = Array.from(this.track.querySelectorAll('.recipe-card'));
            this.prevBtn = container.querySelector('.gallery-arrow-prev');
            this.nextBtn = container.querySelector('.gallery-arrow-next');
            this.gap = 15;
            this.currentPosition = 0;
            this.extraScroll = 10;
            
            this.init();
        }
        
        init() {
            this.calculateDimensions();
            this.setupEventListeners();
            this.updateArrows();
            
            window.addEventListener('resize', () => {
                this.calculateDimensions();
                this.updateArrows();
            });
        }
        
        calculateDimensions() {
            if (this.cards.length === 0) return;
            
            this.cardWidth = this.cards[0].offsetWidth;
            this.scrollStep = this.cardWidth + this.gap;
            
            const totalWidth = (this.cardWidth + this.gap) * this.cards.length - this.gap;
            const visibleWidth = this.track.parentElement.offsetWidth;
            
            this.maxPosition = Math.max(0, totalWidth - visibleWidth + this.extraScroll);
        }
        
        setupEventListeners() {
            this.prevBtn.addEventListener('click', () => this.scroll('prev'));
            this.nextBtn.addEventListener('click', () => this.scroll('next'));
        }
        
        scroll(direction) {
            if (direction === 'next') {
                const newPosition = this.currentPosition + this.scrollStep;
                this.currentPosition = Math.min(newPosition, this.maxPosition);
            } else {
                this.currentPosition = Math.max(this.currentPosition - this.scrollStep, 0);
            }
            
            this.updatePosition();
            this.updateArrows();
        }
        
        updatePosition() {
            this.track.style.transform = `translateX(-${this.currentPosition}px)`;
        }
        
        updateArrows() {
            const isAtStart = this.currentPosition <= 0;
            const isAtEnd = this.currentPosition >= this.maxPosition;
            
            this.prevBtn.disabled = isAtStart;
            this.nextBtn.disabled = isAtEnd;
            
            this.prevBtn.style.opacity = isAtStart ? '0.5' : '1';
            this.nextBtn.style.opacity = isAtEnd ? '0.5' : '1';
        }
    }

    // Класс для кнопки прокрутки вверх
    class ScrollToTop {
        constructor() {
            this.button = document.querySelector('.scroll-to-top');
            this.init();
        }
        
        init() {
            if (!this.button) return;
            
            this.setupEventListeners();
            this.checkScrollPosition();
        }
        
        setupEventListeners() {
            this.button.addEventListener('click', () => this.scrollToTop());
            window.addEventListener('scroll', () => this.checkScrollPosition());
        }
        
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        checkScrollPosition() {
            if (window.pageYOffset > 300) {
                this.button.classList.add('show');
            } else {
                this.button.classList.remove('show');
            }
        }
        
        toggleVisibility(show) {
            if (show) {
                this.button.classList.add('show');
            } else {
                this.button.classList.remove('show');
            }
        }
    }
    // Класс для раскрытия текста "Читать далее"
    class ReadMore {
        constructor() {
            this.descriptionText = document.querySelector('.description-text');
            this.readMoreBtn = document.querySelector('.read-more-btn');
            
            if (this.descriptionText && this.readMoreBtn) {
                this.init();
            }
        }
        
        init() {
            this.setupEventListeners();
            this.checkTextHeight();
        }
        
        setupEventListeners() {
            this.readMoreBtn.addEventListener('click', () => this.toggleText());
        }
        
        toggleText() {
            this.descriptionText.classList.toggle('expanded');
            
            if (this.descriptionText.classList.contains('expanded')) {
                this.readMoreBtn.textContent = 'Свернуть';
            } else {
                this.readMoreBtn.textContent = 'Читать далее';
            }
        }
        
        checkTextHeight() {
            // Проверяем высоту текста и скрываем кнопку если текст короткий
            const textHeight = this.descriptionText.scrollHeight;
            if (textHeight <= 200) {
                this.readMoreBtn.style.display = 'none';
            } else {
                this.readMoreBtn.style.display = 'block';
            }
        }
    }

    // Класс для модальных окон
    class ModalManager {
        constructor(scrollToTopInstance) {
            this.categoryCards = document.querySelectorAll('.categories-card');
            this.modals = document.querySelectorAll('.modal');
            this.closeButtons = document.querySelectorAll('.close');
            this.modalButtons = document.querySelectorAll('.modal-btn');
            this.scrollToTop = scrollToTopInstance;
            this.scrollPosition = 0;
            this.isModalOpen = false;
            
            this.init();
        }
        
        init() {
            this.setupAccessibility();
            this.setupEventListeners();
        }
        
        setupAccessibility() {
            this.modals.forEach(modal => {
                modal.setAttribute('aria-hidden', 'true');
                modal.setAttribute('role', 'dialog');
                modal.setAttribute('aria-modal', 'true');
            });
            
            this.categoryCards.forEach(card => {
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'button');
            });
        }
        
        setupEventListeners() {
            this.categoryCards.forEach(card => {
                card.addEventListener('click', () => {
                    const category = card.getAttribute('data-category');
                    this.openModal(category);
                });
                
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const category = card.getAttribute('data-category');
                        this.openModal(category);
                    }
                });
            });
            
            this.closeButtons.forEach(button => {
                button.addEventListener('click', () => this.closeModal());
                button.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.closeModal();
                    }
                });
            });
            
            this.modalButtons.forEach(button => {
                button.addEventListener('click', () => {
                    alert('Переход на страницу категории');
                    this.closeModal();
                });
                
                button.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        alert('Переход на страницу категории');
                        this.closeModal();
                    }
                });
            });
            
            window.addEventListener('click', (event) => {
                this.modals.forEach(modal => {
                    if (event.target === modal) {
                        this.closeModal();
                    }
                });
            });
            
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    const isModalOpen = Array.from(this.modals).some(modal => 
                        modal.style.display === 'block'
                    );
                    
                    if (isModalOpen) {
                        this.closeModal();
                    }
                }
            });
            
            document.addEventListener('wheel', (e) => {
                if (this.isModalOpen) {
                    e.preventDefault();
                }
            }, { passive: false });
            
            document.addEventListener('touchmove', (e) => {
                if (this.isModalOpen) {
                    e.preventDefault();
                }
            }, { passive: false });
            
            document.addEventListener('keydown', (e) => {
                if (this.isModalOpen && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageUp' || e.key === 'PageDown')) {
                    e.preventDefault();
                }
            });
        }
        
        disableBodyScroll() {
            this.scrollPosition = window.pageYOffset;
            this.isModalOpen = true;
            
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${scrollbarWidth}px`;
            
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${this.scrollPosition}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
        }
        
        enableBodyScroll() {
            this.isModalOpen = false;
            
            document.body.style.removeProperty('overflow');
            document.body.style.removeProperty('position');
            document.body.style.removeProperty('top');
            document.body.style.removeProperty('left');
            document.body.style.removeProperty('right');
            document.body.style.removeProperty('padding-right');
            
            window.scrollTo(0, this.scrollPosition);
        }
        
        openModal(category) {
            const modalId = `modal-${category}`;
            const modal = document.getElementById(modalId);
            
            if (modal) {
                this.disableBodyScroll();
                
                modal.style.display = 'block';
                modal.setAttribute('aria-hidden', 'false');
                modal.scrollTop = 0;
                
                if (this.scrollToTop) {
                    this.scrollToTop.toggleVisibility(false);
                }
            }
        }
        
        closeModal() {
            this.modals.forEach(modal => {
                modal.style.display = 'none';
                modal.setAttribute('aria-hidden', 'true');
            });
            
            this.enableBodyScroll();
            
            if (this.scrollToTop) {
                setTimeout(() => {
                    this.scrollToTop.checkScrollPosition();
                }, 100);
            }
        }
    }
    
    // Инициализация всех компонентов
    
    // Загрузка ингредиентов
    new IngredientsLoader();
    
    // Галерея рецептов
    const galleryContainer = document.querySelector('.recipes-gallery-container');
    if (galleryContainer) new RecipesGallery(galleryContainer);
    
    // Кнопка прокрутки вверх и модальные окна
    const scrollToTop = new ScrollToTop();
    new ModalManager(scrollToTop);
    
    // Кнопка "Читать далее" для описания ингредиентов
    new ReadMore();
});