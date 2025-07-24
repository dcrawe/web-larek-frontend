import { IEvents } from '../components';
	 import { PaymentMethod } from '../types';
	 import { AppEvent } from '../types';
	 import { REGEX } from '../utils/constants';

	 export class OrderModel {
	 	private _address = '';
	 	private _email = '';
	 	private _phone = '';
	 	private _paymentMethod: PaymentMethod | null = null;

	 	constructor(private readonly _events: IEvents) {
	 		this._initEventListeners();
	 	}

	 	/**
	 	 * Устанавливает адрес доставки
	 	 */
	 	setAddress(address: string): void {
	 		this._address = address;
	 		this._validateOrder();
	 		this._validateOrderForm();
	 	}

	 	/**
	 	 * Устанавливает email
	 	 */
	 	setEmail(email: string): void {
	 		this._email = email;
	 		this._validateOrder();
	 		this._validateContactsForm();
	 	}

	 	/**
	 	 * Устанавливает телефон
	 	 */
	 	setPhone(phone: string): void {
	 		this._phone = phone;
	 		this._validateOrder();
	 		this._validateContactsForm();
	 	}

	 	/**
	 	 * Устанавливает контактные данные
	 	 */
	 	setContacts(email: string, phone: string): void {
	 		this._email = email;
	 		this._phone = phone;
	 		this._validateOrder();
	 		this._validateContactsForm();
	 	}

	 	/**
	 	 * Устанавливает способ оплаты
	 	 */
	 	setPaymentMethod(method: PaymentMethod): void {
	 		this._paymentMethod = method;
	 		this._validateOrder();
	 		this._validateOrderForm();
	 	}

	 	/**
	 	 * Возвращает адрес доставки
	 	 */
	 	getAddress(): string {
	 		return this._address;
	 	}

	 	/**
	 	 * Возвращает email
	 	 */
	 	getEmail(): string {
	 		return this._email;
	 	}

	 	/**
	 	 * Возвращает номер телефона
	 	 */
	 	getPhone(): string {
	 		return this._phone;
	 	}

	 	/**
	 	 * Возвращает способ оплаты
	 	 */
	 	getPaymentMethod(): PaymentMethod | null {
	 		return this._paymentMethod;
	 	}

	 	/**
	 	 * Валидирует email
	 	 */
	 	private _isEmailValid(): boolean {
	 		return Boolean(this._email.trim() && REGEX.EMAIL.test(this._email));
	 	}

	 	/**
	 	 * Валидирует телефон
	 	 */
	 	private _isPhoneValid(): boolean {
	 		return Boolean(this._phone.trim() && REGEX.PHONE.test(this._phone));
	 	}

	 	/**
	 	 * Валидирует адрес
	 	 */
	 	private _isAddressValid(): boolean {
	 		return Boolean(this._address.trim());
	 	}

	 	/**
	 	 * Валидирует форму заказа и отправляет соответствующие события
	 	 */
	 	private _validateOrderForm(): void {
	 		const errors: string[] = [];

	 		if (!this._isAddressValid()) {
	 			errors.push('Необходимо указать адрес');
	 		}

	 		if (!this._paymentMethod) {
	 			errors.push('Выберите способ оплаты');
	 		}

	 		const isValid = errors.length === 0;

	 		// Отправляем специфические события для формы заказа
	 		this._events.emit(AppEvent.ORDER_FORM_VALID, { isValid });

	 		if (!isValid) {
	 			this._events.emit(AppEvent.ORDER_FORM_ERRORS, { errors });
	 		}
	 	}

	 	/**
	 	 * Валидирует форму контактов и отправляет соответствующие события
	 	 */
	 	private _validateContactsForm(): void {
	 		const errors: string[] = [];

	 		if (!this._isEmailValid()) {
	 			if (!this._email.trim()) {
	 				errors.push('Необходимо указать email');
	 			} else {
	 				errors.push('Указан некорректный email');
	 			}
	 		}

	 		if (!this._isPhoneValid()) {
	 			if (!this._phone.trim()) {
	 				errors.push('Необходимо указать телефон');
	 			} else {
	 				errors.push('Указан некорректный формат телефона');
	 			}
	 		}

	 		const isValid = errors.length === 0;

	 		// Отправляем специфические события для формы контактов
	 		this._events.emit(AppEvent.CONTACTS_FORM_VALID, { isValid });

	 		if (!isValid) {
	 			this._events.emit(AppEvent.CONTACTS_FORM_ERRORS, { errors });
	 		}
	 	}

	 	/**
	 	 * Валидирует заказ целиком и отправляет соответствующие события
	 	 */
	 	private _validateOrder(): void {
	 		const isValid = this.isValid();

	 		// Отправляем общие события валидации (для обратной совместимости)
	 		this._events.emit(AppEvent.FORM_VALID, { isValid });

	 		if (!isValid) {
	 			const errors: string[] = [];

	 			if (!this._isAddressValid()) {
	 				errors.push('Необходимо указать адрес');
	 			}

	 			if (!this._isEmailValid()) {
	 				if (!this._email.trim()) {
	 					errors.push('Необходимо указать email');
	 				} else {
	 					errors.push('Указан некорректный email');
	 				}
	 			}

	 			if (!this._isPhoneValid()) {
	 				if (!this._phone.trim()) {
	 					errors.push('Необходимо указать телефон');
	 				} else {
	 					errors.push('Указан некорректный формат телефона');
	 				}
	 			}

	 			if (!this._paymentMethod) {
	 				errors.push('Выберите способ оплаты');
	 			}

	 			this._events.emit(AppEvent.FORM_ERRORS, { errors });
	 		}
	 	}

	 	/**
	 	 * Проверяет, заполнены ли все обязательные поля
	 	 */
	 	isValid(): boolean {
	 		return !!(
	 			this._isAddressValid() &&
	 			this._isEmailValid() &&
	 			this._isPhoneValid() &&
	 			this._paymentMethod
	 		);
	 	}

	 	/**
	 	 * Очищает данные заказа
	 	 */
	 	clear(): void {
	 		this._address = '';
	 		this._email = '';
	 		this._phone = '';
	 		this._paymentMethod = null;
	 	}

	 	/**
	 	 * Инициализирует обработчики событий
	 	 */
	 	private _initEventListeners(): void {
	 		this._events.on<{ address: string }>(AppEvent.ORDER_ADDRESS_SET, (data) => {
	 			this.setAddress(data.address);
	 		});

	 		this._events.on<{ email: string, phone: string }>(AppEvent.ORDER_CONTACTS_SET, (data) => {
	 			this.setContacts(data.email, data.phone);
	 		});

	 		this._events.on<{ method: PaymentMethod }>(AppEvent.ORDER_PAYMENT_SELECT, (data) => {
	 			this.setPaymentMethod(data.method);
	 		});
	 	}
	 }