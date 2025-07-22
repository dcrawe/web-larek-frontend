import { TemplateComponent } from './base/TemplateComponent';
import { IEvents } from './base/events';
import { IContactsForm, AppEvent } from '../types';
import { CLASS_NAMES, MESSAGES, REGEX, TEMPLATE_IDS } from '../utils/constants';

export class ContactsForm extends TemplateComponent implements IContactsForm {
  email: string = '';
  phone: string = '';
  isValid: boolean = false;
  private readonly _submitButton: HTMLButtonElement;
  private readonly _emailInput: HTMLInputElement;
  private readonly _phoneInput: HTMLInputElement;
  private readonly _errorElement: HTMLElement;

  constructor(private readonly _events: IEvents) {
    super(TEMPLATE_IDS.CONTACTS);

    // Находим кнопку отправки формы
    this._submitButton = this._element.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (!this._submitButton) {
      throw new Error('Кнопка отправки формы не найдена');
    }

    // Находим поле ввода email
    this._emailInput = this._element.querySelector('input[name="email"]') as HTMLInputElement;
    if (!this._emailInput) {
      throw new Error('Поле ввода email не найдено');
    }

    // Находим поле ввода телефона
    this._phoneInput = this._element.querySelector('input[name="phone"]') as HTMLInputElement;
    if (!this._phoneInput) {
      throw new Error('Поле ввода телефона не найдено');
    }

    // Находим элемент для отображения ошибок
    this._errorElement = this._element.querySelector(`.${CLASS_NAMES.FORM_ERRORS}`) as HTMLElement;
    if (!this._errorElement) {
      throw new Error('Элемент для отображения ошибок не найден');
    }

    this._initEventListeners();
  }

  /**
   * Устанавливает email
   */
  setEmail(email: string): void {
    this.email = email;
    this._emailInput.value = email;

    // Проверяем валидность формы
    this._validateForm();
  }

  /**
   * Устанавливает телефон
   */
  setPhone(phone: string): void {
    this.phone = phone;
    this._phoneInput.value = phone;

    // Проверяем валидность формы
    this._validateForm();
  }

  /**
   * Проверяет валидность формы
   */
  private _validateForm(): void {
    const errors: string[] = [];

    // Проверяем, введен ли email
    if (!this.email.trim()) {
      errors.push(MESSAGES.EMAIL_REQUIRED);
    } else if (!REGEX.EMAIL.test(this.email)) {
      errors.push(MESSAGES.INVALID_EMAIL);
    }

    // Проверяем, введен ли телефон
    if (!this.phone.trim()) {
      errors.push(MESSAGES.PHONE_REQUIRED);
    } else if (!REGEX.PHONE.test(this.phone)) {
      errors.push(MESSAGES.INVALID_PHONE);
    }

    // Устанавливаем статус валидности
    this.isValid = errors.length === 0;
    this._submitButton.disabled = !this.isValid;

    // Отображаем ошибки, если они есть
    if (errors.length > 0) {
      this._errorElement.textContent = errors.join('. ');
      this._events.emit(AppEvent.FORM_ERRORS, { errors });
    } else {
      this._errorElement.textContent = '';
      this._events.emit(AppEvent.FORM_VALID);
    }
  }

  /**
   * Инициализирует обработчики событий
   */
  private _initEventListeners(): void {
    // Обработчик отправки формы
    this._element.addEventListener('submit', (event) => {
      event.preventDefault();

      if (this.isValid) {
        this._events.emit(AppEvent.ORDER_CONTACTS_SET, {
          email: this.email,
          phone: this.phone
        });
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
  }
}
