import { IAppState, IBasketItem, IOrderDTO, IProduct, PaymentMethod } from './models';

// Список событий в приложении
export const enum AppEvent {
  // События каталога
  PRODUCTS_LOADED = 'products:loaded',
  PRODUCT_SELECT = 'product:select',
  PRODUCT_PREVIEW = 'product:preview',

  // События корзины
  BASKET_ADD = 'basket:add',
  BASKET_REMOVE = 'basket:remove',
  BASKET_UPDATE = 'basket:update',
  BASKET_CLEAR = 'basket:clear',
  BASKET_OPEN = 'basket:open',

  // События заказа
  ORDER_OPEN = 'order:open',
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

  // События состояния приложения
  STATE_CHANGE = 'state:change'
}

// Интерфейсы для событий
export interface IProductsLoadedEvent {
  products: IProduct[];
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
  items: IBasketItem[];
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

export interface IStateChangeEvent {
  state: Partial<IAppState>;
}

export interface IEventPayloadMap {
  [AppEvent.PRODUCTS_LOADED]: IProductsLoadedEvent;
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
  [AppEvent.STATE_CHANGE]: IStateChangeEvent;
}
