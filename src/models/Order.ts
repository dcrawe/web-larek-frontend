import { IEvents } from '../components';
import { PaymentMethod } from '../types';
import { AppEvent } from '../types';

export class OrderModel {
	private _address: string = '';
	private _email: string = '';
	private _phone: string = '';
	private _paymentMethod: PaymentMethod | null = null;

	constructor(private readonly _events: IEvents) {
		this._initEventListeners();
	}

	/**
	 * Устанавливает адрес доставки
	 */
	setAddress(address: string): void {
		this._address = address;
	}

	/**
	 * Устанавливает контактные данные
	 */
	setContacts(email: string, phone: string): void {
		this._email = email;
		this._phone = phone;
	}

	/**
	 * Устанавливает способ оплаты
	 */
	setPaymentMethod(method: PaymentMethod): void {
		this._paymentMethod = method;
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
	 * Проверяет, заполнены ли все обязательные поля
	 */
	isValid(): boolean {
		return !!(
			this._address &&
			this._email &&
			this._phone &&
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