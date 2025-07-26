import { TemplateComponent } from './base/TemplateComponent';
import { IEvents } from './base/events';
import { IContactsForm, AppEvent } from '../types';
import { ERROR_MESSAGES, FORM_SELECTORS, TEMPLATE_IDS } from '../utils/constants';
import { OrderModel } from '../models';

export class ContactsForm extends TemplateComponent implements IContactsForm {
	private readonly _submitButton: HTMLButtonElement;
	private readonly _emailInput: HTMLInputElement;
	private readonly _phoneInput: HTMLInputElement;
	private readonly _errorElement: HTMLElement;
	private _isValid = false;

	constructor(
		private readonly _events: IEvents,
		private readonly _orderModel?: OrderModel
	) {
		super(TEMPLATE_IDS.CONTACTS);

		this._submitButton = this._element.querySelector(
			FORM_SELECTORS.SUBMIT_BUTTON
		) as HTMLButtonElement;

		if (!this._submitButton) {
			throw new Error(ERROR_MESSAGES.SUBMIT_BUTTON_NOT_FOUND);
		}

		this._emailInput = this._element.querySelector(
			FORM_SELECTORS.EMAIL_INPUT
		) as HTMLInputElement;
		if (!this._emailInput) {
			throw new Error(ERROR_MESSAGES.EMAIL_INPUT_NOT_FOUND);
		}

		this._phoneInput = this._element.querySelector(
			FORM_SELECTORS.PHONE_INPUT
		) as HTMLInputElement;
		if (!this._phoneInput) {
			throw new Error(ERROR_MESSAGES.PHONE_INPUT_NOT_FOUND);
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
	 * Возвращает email пользователя
	 */
	get email(): string {
		return this._orderModel ? this._orderModel.getEmail() : '';
	}

	/**
	 * Возвращает телефон пользователя
	 */
	get phone(): string {
		return this._orderModel ? this._orderModel.getPhone() : '';
	}

	/**
	 * Возвращает статус валидности формы
	 */
	get isValid(): boolean {
		return this._isValid;
	}

	/**
	 * Устанавливает email
	 */
	setEmail(email: string): void {
		this._emailInput.value = email;

		this._events.emit(AppEvent.ORDER_CONTACTS_SET, {
			email: email,
			phone: this.phone,
		});
	}

	/**
	 * Устанавливает телефон
	 */
	setPhone(phone: string): void {
		this._phoneInput.value = phone;

		this._events.emit(AppEvent.ORDER_CONTACTS_SET, {
			email: this.email,
			phone: phone,
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
		this._emailInput.value = '';
		this._phoneInput.value = '';
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
				this._events.emit(AppEvent.ORDER_CONFIRM);
			}
		});

		// Обработчик изменения email
		this._emailInput.addEventListener('input', () => {
			this.setEmail(this._emailInput.value);
		});

		// Обработчик изменения телефона
		this._phoneInput.addEventListener('input', () => {
			this.setPhone(this._phoneInput.value);
		});

		// Обработчик обновления валидности формы контактов
		this._events.on<{ isValid: boolean }>(
			AppEvent.CONTACTS_FORM_VALID,
			(data) => {
				this.updateValidState(data.isValid);
			}
		);

		// Обработчик обновления ошибок формы контактов
		this._events.on<{ errors: string[] }>(
			AppEvent.CONTACTS_FORM_ERRORS,
			(data) => {
				this.updateErrors(data.errors);
			}
		);

		// Обработчик очистки заказа
		this._events.on(AppEvent.ORDER_CLEAR, () => {
			this.clear();
			this.updateValidState(false);
		});
	}
}