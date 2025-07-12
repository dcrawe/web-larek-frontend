import { IEvents } from '../components/base/events';
import { PaymentMethod, IOrderDTO } from '../types';
import { AppEvent } from '../types';

export class OrderModel {
	private _address: string = '';
	private _email: string = '';
	private _phone: string = '';
	private _paymentMethod: PaymentMethod | null = null;
	private _items: string[] = [];
	private _total: number = 0;

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
	 * Устанавливает товары и общую стоимость заказа
	 */
	setOrderItems(items: string[], total: number): void {
		this._items = [...items];
		this._total = total;
	}

	/**
	 * Возвращает идентификаторы товаров в заказе
	 */
	getItems(): string[] {
		return [...this._items];
	}

	/**
	 * Возвращает общую стоимость заказа
	 */
	getTotal(): number {
		return this._total;
	}

	/**
	 * Формирует объект заказа для отправки на сервер
	 */
	createOrder(): IOrderDTO | null {
		if (
			!this._address ||
			!this._email ||
			!this._phone ||
			!this._paymentMethod ||
			this._items.length === 0
		) {
			return null;
		}

		return {
			address: this._address,
			email: this._email,
			phone: this._phone,
			payment: this._paymentMethod,
			items: this._items,
			total: this._total
		};
	}

	/**
	 * Проверяет, готов ли заказ к оформлению
	 */
	isReadyToSubmit(): boolean {
		return !!(
			this._address &&
			this._email &&
			this._phone &&
			this._paymentMethod &&
			this._items.length > 0
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
		this._items = [];
		this._total = 0;
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

		// Обработчик обновления данных заказа при изменении корзины
		this._events.on<{ items: string[], total: number }>(AppEvent.ORDER_UPDATE, (data) => {
			this.setOrderItems(data.items, data.total);
		});
	}
}