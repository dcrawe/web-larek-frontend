import { TemplateComponent } from './base/TemplateComponent';
import { IEvents } from './base/events';
import { IOrderForm, AppEvent, PaymentMethod } from '../types';
import { CLASS_NAMES, MESSAGES, TEMPLATE_IDS } from '../utils/constants';

export class OrderForm extends TemplateComponent implements IOrderForm {
	private readonly _submitButton: HTMLButtonElement;
	private readonly _addressInput: HTMLInputElement;
	private readonly _paymentButtons: NodeListOf<HTMLButtonElement>;
	private readonly _errorElement: HTMLElement;
	private _address = '';
	private _paymentMethod: PaymentMethod | null = null;
	private _isValid = false;

	constructor(private readonly _events: IEvents) {
		super(TEMPLATE_IDS.ORDER);

		// Находим кнопку отправки формы
		this._submitButton = this._element.querySelector(
			`.${CLASS_NAMES.ORDER_BUTTON}`
		) as HTMLButtonElement;
		if (!this._submitButton) {
			throw new Error('Кнопка отправки формы не найдена');
		}

		// Находим поле ввода адреса
		this._addressInput = this._element.querySelector(
			`input[name="address"]`
		) as HTMLInputElement;
		if (!this._addressInput) {
			throw new Error('Поле ввода адреса не найдено');
		}

		// Находим кнопки выбора способа оплаты
		this._paymentButtons = this._element.querySelectorAll(
			`.${CLASS_NAMES.ORDER_BUTTONS} .${CLASS_NAMES.BUTTON}`
		);
		if (!this._paymentButtons.length) {
			throw new Error('Кнопки выбора способа оплаты не найдены');
		}

		// Находим элемент для отображения ошибок
		this._errorElement = this._element.querySelector(
			`.${CLASS_NAMES.FORM_ERRORS}`
		) as HTMLElement;
		if (!this._errorElement) {
			throw new Error('Элемент для отображения ошибок не найден');
		}

		this._initEventListeners();
	}

	/**
	 * Возвращает выбранный способ оплаты
	 */
	get paymentMethod(): PaymentMethod | null {
		return this._paymentMethod;
	}

	/**
	 * Возвращает адрес доставки
	 */
	get address(): string {
		return this._address;
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
		this._paymentMethod = method;

		// Обновляем внешний вид кнопок
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

		// Отправляем событие выбора способа оплаты
		this._events.emit(AppEvent.ORDER_PAYMENT_SELECT, { method: method });
	}

	/**
	 * Устанавливает адрес доставки
	 */
	setAddress(address: string): void {
		this._address = address;
		this._addressInput.value = address;

		// Отправляем событие установки адреса
		this._events.emit(AppEvent.ORDER_ADDRESS_SET, { address: address });
	}

	/**
	 * Обновляет состояние валидности формы
	 */
	updateValidState(isValid: boolean): void {
		this._isValid = isValid;
		this._submitButton.disabled = !isValid;
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
	 * Инициализирует обработчики событий
	 */
	private _initEventListeners(): void {
		// Обработчик отправки формы
		this._element.addEventListener('submit', (event) => {
			event.preventDefault();

			if (this._isValid) {
				this._events.emit(AppEvent.ORDER_SUBMIT);
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
		this._events.on<{ isValid: boolean }>(AppEvent.ORDER_FORM_VALID, (data) => {
			this.updateValidState(data.isValid);
		});

		// Обработчик обновления ошибок формы заказа
		this._events.on<{ errors: string[] }>(AppEvent.ORDER_FORM_ERRORS, (data) => {
			this.updateErrors(data.errors);
		});
	}
}