// API URLs
export const API_URL = {
	BASE_URL: `${process.env.API_ORIGIN}/api/weblarek`,
	PRODUCTS: '/product',
	ORDERS: '/order'
};
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

// Селекторы элементов
export const CLASS_NAMES = {
	// Общие классы
	PAGE: 'page',
	PAGE_WRAPPER: 'page__wrapper',
	BUTTON: 'button',
	BUTTON_ALT: 'button_alt',
	BUTTON_SELECTED: 'button_alt-active',

	// Шапка
	HEADER: 'header',
	HEADER_CONTAINER: 'header__container',
	HEADER_LOGO: 'header__logo',
	HEADER_LOGO_IMAGE: 'header__logo-image',
	HEADER_BASKET: 'header__basket',
	HEADER_BASKET_COUNTER: 'header__basket-counter',

	// Галерея (каталог)
	GALLERY: 'gallery',
	GALLERY_ITEM: 'gallery__item',

	// Карточка товара
	CARD: 'card',
	CARD_FULL: 'card_full',
	CARD_COMPACT: 'card_compact',
	CARD_IMAGE: 'card__image',
	CARD_COLUMN: 'card__column',
	CARD_CATEGORY: 'card__category',
	CARD_CATEGORY_SOFT: 'card__category_soft',
	CARD_CATEGORY_HARD: 'card__category_hard',
	CARD_CATEGORY_OTHER: 'card__category_other',
	CARD_CATEGORY_BUTTON: 'card__category_button',
	CARD_CATEGORY_ADDITIONAL: 'card__category_additional',
	CARD_TITLE: 'card__title',
	CARD_TEXT: 'card__text',
	CARD_ROW: 'card__row',
	CARD_PRICE: 'card__price',
	CARD_BUTTON: 'card__button',

	// Модальное окно
	MODAL: 'modal',
	MODAL_ACTIVE: 'modal_active',
	MODAL_CONTAINER: 'modal__container',
	MODAL_CLOSE: 'modal__close',
	MODAL_CONTENT: 'modal__content',
	MODAL_TITLE: 'modal__title',
	MODAL_ACTIONS: 'modal__actions',

	// Корзина
	BASKET: 'basket',
	BASKET_LIST: 'basket__list',
	BASKET_ITEM: 'basket__item',
	BASKET_ITEM_INDEX: 'basket__item-index',
	BASKET_ITEM_DELETE: 'basket__item-delete',
	BASKET_PRICE: 'basket__price',
	BASKET_BUTTON: 'basket__button',

	// Форма
	FORM: 'form',
	FORM_LABEL: 'form__label',
	FORM_INPUT: 'form__input',
	FORM_ERRORS: 'form__errors',

	// Заказ
	ORDER: 'order',
	ORDER_FIELD: 'order__field',
	ORDER_BUTTONS: 'order__buttons',
	ORDER_BUTTON: 'order__button',

	// Успешный заказ
	ORDER_SUCCESS: 'order-success',
	ORDER_SUCCESS_TITLE: 'order-success__title',
	ORDER_SUCCESS_DESCRIPTION: 'order-success__description',
	ORDER_SUCCESS_CLOSE: 'order-success__close'
};

// Селекторы для форм
export const FORM_SELECTORS = {
	// Общие селекторы
	SUBMIT_BUTTON: 'button[type="submit"]',
	FORM_ERRORS: `.${CLASS_NAMES.FORM_ERRORS}`,

	// Форма контактов
	EMAIL_INPUT: 'input[name="email"]',
	PHONE_INPUT: 'input[name="phone"]',

	// Форма заказа
	ADDRESS_INPUT: 'input[name="address"]',
	PAYMENT_BUTTONS: `.${CLASS_NAMES.ORDER_BUTTONS} .${CLASS_NAMES.BUTTON}`,
	ORDER_BUTTON: `.${CLASS_NAMES.BUTTON}`,

	// Кнопки способов оплаты
	CARD_BUTTON: 'button[name="card"]',
	CASH_BUTTON: 'button[name="cash"]'
};

// ID шаблонов
export const TEMPLATE_IDS = {
	CARD_CATALOG: 'card-catalog',
	CARD_PREVIEW: 'card-preview',
	CARD_BASKET: 'card-basket',
	BASKET: 'basket',
	ORDER: 'order',
	CONTACTS: 'contacts',
	SUCCESS: 'success'
};

// ID модальных окон
export const MODAL_IDS = {
	MODAL_CONTAINER: 'modal-container'
};

// Тексты сообщений
// Сообщения об ошибках для форм
export const ERROR_MESSAGES = {
	// Ошибки компонентов
	SUBMIT_BUTTON_NOT_FOUND: 'Кнопка отправки формы не найдена',
	EMAIL_INPUT_NOT_FOUND: 'Поле ввода email не найдено',
	PHONE_INPUT_NOT_FOUND: 'Поле ввода телефона не найдено',
	ADDRESS_INPUT_NOT_FOUND: 'Поле ввода адреса не найдено',
	PAYMENT_BUTTONS_NOT_FOUND: 'Кнопки выбора способа оплаты не найдены',
	FORM_ERRORS_ELEMENT_NOT_FOUND: 'Элемент для отображения ошибок не найден',

	// Ошибки валидации
	ADDRESS_REQUIRED: 'Необходимо указать адрес',
	EMAIL_REQUIRED: 'Необходимо указать email',
	PHONE_REQUIRED: 'Необходимо указать телефон',
	PAYMENT_REQUIRED: 'Необходимо выбрать способ оплаты',
	INVALID_EMAIL: 'Некорректный формат email',
	INVALID_PHONE: 'Некорректный формат телефона',
};


// Регулярные выражения для валидации
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s()-]{10,}$/
};