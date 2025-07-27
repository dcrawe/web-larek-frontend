import { TemplateComponent } from './base/TemplateComponent';
import { IEvents } from './base/events';
import {
	IOrderForm,
	AppEvent,
	PaymentMethod,
	IOrderPaymentSelectEvent,
	IOrderAddressSetEvent,
	IOrderFormValidEvent,
	IOrderFormErrorsEvent,
	EmptyEvent,
} from '../types';
import {
	CLASS_NAMES,
	ERROR_MESSAGES,
	FORM_SELECTORS,
	TEMPLATE_IDS,
} from '../utils/constants';
import { OrderModel } from '../models';

export class OrderForm extends TemplateComponent implements IOrderForm {
	private readonly _submitButton: HTMLButtonElement;
	private readonly _addressInput: HTMLInputElement;
	private readonly _paymentButtons: NodeListOf<HTMLButtonElement>;
	private readonly _errorElement: HTMLElement;
	private _isValid = false;

	constructor(
		private readonly _events: IEvents,
		private readonly _orderModel?: OrderModel
	) {
		super(TEMPLATE_IDS.ORDER);

		this._submitButton = this._element.querySelector(
			FORM_SELECTORS.SUBMIT_BUTTON
		) as HTMLButtonElement;

		if (!this._submitButton) {
			throw new Error(ERROR_MESSAGES.SUBMIT_BUTTON_NOT_FOUND);
		}

		this._addressInput = this._element.querySelector(
			FORM_SELECTORS.ADDRESS_INPUT
		) as HTMLInputElement;

		if (!this._addressInput) {
			throw new Error(ERROR_MESSAGES.ADDRESS_INPUT_NOT_FOUND);
		}

		this._paymentButtons = this._element.querySelectorAll(
			FORM_SELECTORS.PAYMENT_BUTTONS
		);

		if (!this._paymentButtons.length) {
			throw new Error(ERROR_MESSAGES.PAYMENT_BUTTONS_NOT_FOUND);
		}

		this._errorElement = this._element.querySelector(
			FORM_SELECTORS.FORM_ERRORS
		) as HTMLElement;

		if (!this._errorElement) {
			throw new Error(ERROR_MESSAGES.FORM_ERRORS_ELEMENT_NOT_FOUND);
		}

		this._initEventListeners();
	}

	/**
	 * Возвращает выбранный способ оплаты
	 */
	get paymentMethod(): PaymentMethod | null {
		return this._orderModel ? this._orderModel.getPaymentMethod() : null;
	}

	/**
	 * Возвращает адрес доставки
	 */
	get address(): string {
		return this._orderModel ? this._orderModel.getAddress() : '';
	}

	/**
	 * Возвращает статус валидности формы
	 */
	get isValid(): boolean {
		return this._isValid;
	}

	/**
	 * Устанавливает способ оплаты
	 */
	setPaymentMethod(method: PaymentMethod): void {
		this._paymentButtons.forEach((button) => {
			if (
				(method === 'online' && button.name === 'card') ||
				(method === 'cash' && button.name === 'cash')
			) {
				button.classList.add(CLASS_NAMES.BUTTON_SELECTED);
			} else {
				button.classList.remove(CLASS_NAMES.BUTTON_SELECTED);
			}
		});

		this._events.emit<IOrderPaymentSelectEvent>(AppEvent.ORDER_PAYMENT_SELECT, {
			method: method,
		});
	}

	/**
	 * Устанавливает адрес доставки
	 */
	setAddress(address: string): void {
		this._addressInput.value = address;

		this._events.emit<IOrderAddressSetEvent>(AppEvent.ORDER_ADDRESS_SET, {
			address: address,
		});
	}

	/**
	 * Обновляет состояние валидности формы
	 */
	updateValidState(isValid: boolean): void {
		this._isValid = isValid;
		this._submitButton.disabled = !isValid;

		this.updateErrors([]);
	}

	/**
	 * Обновляет отображение ошибок
	 */
	updateErrors(errors: string[]): void {
		if (errors.length > 0) {
			this._errorElement.textContent = errors.join('. ');
		} else {
			this._errorElement.textContent = '';
		}
	}

	/**
	 * Очищает форму
	 */
	clear(): void {
		this._addressInput.value = '';
		this._paymentButtons.forEach((button) => {
			button.classList.remove(CLASS_NAMES.BUTTON_SELECTED);
		});
		this._errorElement.textContent = '';
	}

	/**
	 * Инициализирует обработчики событий
	 */
	private _initEventListeners(): void {
		// Обработчик отправки формы
		this._element.addEventListener('submit', (event) => {
			event.preventDefault();

			if (this._isValid) {
				this._events.emit<EmptyEvent>(AppEvent.ORDER_SUBMIT, {});
			}
		});

		// Обработчик изменения адреса
		this._addressInput.addEventListener('input', () => {
			this.setAddress(this._addressInput.value);
		});

		// Обработчик выбора способа оплаты
		this._paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				const method = button.name === 'card' ? 'online' : 'cash';
				this.setPaymentMethod(method as PaymentMethod);
			});
		});

		// Обработчик обновления валидности формы заказа
		this._events.on<IOrderFormValidEvent>(AppEvent.ORDER_FORM_VALID, (data) => {
			this.updateValidState(data.isValid);
		});

		// Обработчик обновления ошибок формы заказа
		this._events.on<IOrderFormErrorsEvent>(
			AppEvent.ORDER_FORM_ERRORS,
			(data) => {
				this.updateErrors(data.errors);
			}
		);

		// Обработчик очистки заказа
		this._events.on<EmptyEvent>(AppEvent.ORDER_CLEAR, () => {
			this.clear();
			this.updateValidState(false);
		});
	}
}
