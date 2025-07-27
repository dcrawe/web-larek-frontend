import { IEvents } from '../components';
import {
	PaymentMethod,
	IFormErrorsEvent,
	IOrderAddressSetEvent,
	IOrderContactsSetEvent,
	IOrderPaymentSelectEvent,
	IOrderFormValidEvent,
	IContactsFormValidEvent,
	IOrderFormErrorsEvent,
	IContactsFormErrorsEvent,
	EmptyEvent,
} from '../types';
import { AppEvent } from '../types';
import { ERROR_MESSAGES, REGEX } from '../utils/constants';

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
	 * Получает ошибки валидации контактов
	 */
	private _getContactsValidationErrors(): string[] {
		const errors: string[] = [];

		if (!this._isPhoneValid() && !this._isEmailValid()) {
			errors.push(ERROR_MESSAGES.PHONE_REQUIRED);
		} else {
			if (!this._isEmailValid()) {
				if (!this._email.trim()) {
					errors.push(ERROR_MESSAGES.EMAIL_REQUIRED);
				} else {
					errors.push(ERROR_MESSAGES.INVALID_EMAIL);
				}
			}

			if (!this._isPhoneValid()) {
				if (!this._phone.trim()) {
					errors.push(ERROR_MESSAGES.PHONE_REQUIRED);
				} else {
					errors.push(ERROR_MESSAGES.INVALID_PHONE);
				}
			}
		}

		return errors;
	}

	/**
	 * Общий метод для валидации и отправки событий
	 */
	private _validateAndEmit(
		validationFn: () => string[],
		validEvent: AppEvent.ORDER_FORM_VALID | AppEvent.CONTACTS_FORM_VALID,
		errorEvent: AppEvent.ORDER_FORM_ERRORS | AppEvent.CONTACTS_FORM_ERRORS
	): void {
		const errors = validationFn();
		const isValid = errors.length === 0;

		if (validEvent === AppEvent.ORDER_FORM_VALID) {
			this._events.emit<IOrderFormValidEvent>(validEvent, { isValid });
		} else {
			this._events.emit<IContactsFormValidEvent>(validEvent, { isValid });
		}

		if (!isValid) {
			if (errorEvent === AppEvent.ORDER_FORM_ERRORS) {
				this._events.emit<IOrderFormErrorsEvent>(errorEvent, { errors });
			} else {
				this._events.emit<IContactsFormErrorsEvent>(errorEvent, { errors });
			}
		}
	}

	/**
	 * Валидирует форму заказа и отправляет соответствующие события
	 */
	private _validateOrderForm(): void {
		this._validateAndEmit(
			() => {
				const errors: string[] = [];

				if (!this._isAddressValid()) {
					errors.push(ERROR_MESSAGES.ADDRESS_REQUIRED);
				}

				if (!this._paymentMethod) {
					errors.push(ERROR_MESSAGES.PAYMENT_REQUIRED);
				}

				return errors;
			},
			AppEvent.ORDER_FORM_VALID,
			AppEvent.ORDER_FORM_ERRORS
		);
	}

	/**
	 * Валидирует форму контактов и отправляет соответствующие события
	 */
	private _validateContactsForm(): void {
		this._validateAndEmit(
			() => this._getContactsValidationErrors(),
			AppEvent.CONTACTS_FORM_VALID,
			AppEvent.CONTACTS_FORM_ERRORS
		);
	}

	/**
	 * Валидирует заказ целиком и отправляет соответствующие события
	 */
	private _validateOrder(): void {
		const isValid = this.isValid();

		this._events.emit<EmptyEvent>(AppEvent.FORM_VALID, {});

		if (!isValid) {
			const errors: string[] = [];

			if (!this._isAddressValid()) {
				errors.push(ERROR_MESSAGES.ADDRESS_REQUIRED);
			}

			errors.push(...this._getContactsValidationErrors());

			if (!this._paymentMethod) {
				errors.push(ERROR_MESSAGES.PAYMENT_REQUIRED);
			}

			this._events.emit<IFormErrorsEvent>(AppEvent.FORM_ERRORS, { errors });
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
		this._events.on<IOrderAddressSetEvent>(
			AppEvent.ORDER_ADDRESS_SET,
			(data) => {
				this.setAddress(data.address);
			}
		);

		this._events.on<IOrderContactsSetEvent>(
			AppEvent.ORDER_CONTACTS_SET,
			(data) => {
				this.setContacts(data.email, data.phone);
			}
		);

		this._events.on<IOrderPaymentSelectEvent>(
			AppEvent.ORDER_PAYMENT_SELECT,
			(data) => {
				this.setPaymentMethod(data.method);
			}
		);
	}
}
