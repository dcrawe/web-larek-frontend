import { IOrderDTO, IProduct, PaymentMethod } from './models';
import { ProductCard } from '../components';

// Список событий в приложении
export const enum AppEvent {
	// События каталога
	PRODUCTS_LOADED = 'products:loaded',
	PRODUCT_SELECT = 'product:select',
	PRODUCT_PREVIEW = 'product:preview',

	// События карточек
	CARDS_LOADED = 'cards:loaded',
	CARD_ADD = 'card:add',
	CARD_REMOVE = 'card:remove',

	// События корзины
	BASKET_ADD = 'basket:add',
	BASKET_REMOVE = 'basket:remove',
	BASKET_UPDATE = 'basket:update',
	BASKET_CLEAR = 'basket:clear',
	BASKET_OPEN = 'basket:open',

	// События заказа
	ORDER_OPEN = 'order:open',
	ORDER_UPDATE = 'order:update',
	ORDER_PAYMENT_SELECT = 'order:payment:select',
	ORDER_ADDRESS_SET = 'order:address:set',
	ORDER_CONTACTS_SET = 'order:contacts:set',
	ORDER_SUBMIT = 'order:submit',
	ORDER_SUCCESS = 'order:success',

	// События модальных окон
	MODAL_OPEN = 'modal:open',
	MODAL_CLOSE = 'modal:close',

	// События формы
	FORM_ERRORS = 'form:errors',
	FORM_VALID = 'form:valid',
}

// Интерфейсы для событий
export interface IProductsLoadedEvent {
	products: IProduct[];
}

export interface ICardsLoadedEvent {
	cards: ProductCard[];
}

export interface ICardAddEvent {
	card: ProductCard;
}

export interface ICardRemoveEvent {
	card: ProductCard;
}

export interface IProductSelectEvent {
	product: IProduct;
}

export interface IBasketAddEvent {
	product: IProduct;
}

export interface IBasketRemoveEvent {
	productId: string;
}

export interface IBasketUpdateEvent {
	items: IProduct[];
	total: number;
}

export interface IOrderPaymentSelectEvent {
	method: PaymentMethod;
}

export interface IOrderAddressSetEvent {
	address: string;
}

export interface IOrderContactsSetEvent {
	email: string;
	phone: string;
}

export interface IOrderSubmitEvent {
	order: IOrderDTO;
}

export interface IOrderSuccessEvent {
	orderId: string;
	total: number;
}

export interface IModalOpenEvent {
	content: HTMLElement;
}

export interface IFormErrorsEvent {
	errors: string[];
}

export interface IEventPayloadMap {
	[AppEvent.PRODUCTS_LOADED]: IProductsLoadedEvent;
	[AppEvent.CARDS_LOADED]: ICardsLoadedEvent;
	[AppEvent.CARD_ADD]: ICardAddEvent;
	[AppEvent.CARD_REMOVE]: ICardRemoveEvent;
	[AppEvent.PRODUCT_SELECT]: IProductSelectEvent;
	[AppEvent.PRODUCT_PREVIEW]: IProductSelectEvent;
	[AppEvent.BASKET_ADD]: IBasketAddEvent;
	[AppEvent.BASKET_REMOVE]: IBasketRemoveEvent;
	[AppEvent.BASKET_UPDATE]: IBasketUpdateEvent;
	[AppEvent.BASKET_CLEAR]: Record<string, never>;
	[AppEvent.BASKET_OPEN]: Record<string, never>;
	[AppEvent.ORDER_OPEN]: Record<string, never>;
	[AppEvent.ORDER_PAYMENT_SELECT]: IOrderPaymentSelectEvent;
	[AppEvent.ORDER_ADDRESS_SET]: IOrderAddressSetEvent;
	[AppEvent.ORDER_CONTACTS_SET]: IOrderContactsSetEvent;
	[AppEvent.ORDER_SUBMIT]: IOrderSubmitEvent;
	[AppEvent.ORDER_SUCCESS]: IOrderSuccessEvent;
	[AppEvent.MODAL_OPEN]: IModalOpenEvent;
	[AppEvent.MODAL_CLOSE]: Record<string, never>;
	[AppEvent.FORM_ERRORS]: IFormErrorsEvent;
	[AppEvent.FORM_VALID]: Record<string, never>;
}