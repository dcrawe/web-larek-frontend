import { TemplateComponent } from './base/TemplateComponent';
import { IEvents } from './base/events';
import { IOrderForm, AppEvent, PaymentMethod } from '../types';
import { CLASS_NAMES, MESSAGES, TEMPLATE_IDS } from '../utils/constants';

export class OrderForm extends TemplateComponent implements IOrderForm {
  paymentMethod: PaymentMethod | null = null;
  address: string = '';
  isValid: boolean = false;
  private readonly _submitButton: HTMLButtonElement;
  private readonly _addressInput: HTMLInputElement;
  private readonly _paymentButtons: NodeListOf<HTMLButtonElement>;
  private readonly _errorElement: HTMLElement;

  constructor(private readonly _events: IEvents) {
    super(TEMPLATE_IDS.ORDER);

    // Находим кнопку отправки формы
    this._submitButton = this._element.querySelector(`.${CLASS_NAMES.ORDER_BUTTON}`) as HTMLButtonElement;
    if (!this._submitButton) {
      throw new Error('Кнопка отправки формы не найдена');
    }

    // Находим поле ввода адреса
    this._addressInput = this._element.querySelector(`input[name="address"]`) as HTMLInputElement;
    if (!this._addressInput) {
      throw new Error('Поле ввода адреса не найдено');
    }

    // Находим кнопки выбора способа оплаты
    this._paymentButtons = this._element.querySelectorAll(`.${CLASS_NAMES.ORDER_BUTTONS} .${CLASS_NAMES.BUTTON}`);
    if (!this._paymentButtons.length) {
      throw new Error('Кнопки выбора способа оплаты не найдены');
    }

    // Находим элемент для отображения ошибок
    this._errorElement = this._element.querySelector(`.${CLASS_NAMES.FORM_ERRORS}`) as HTMLElement;
    if (!this._errorElement) {
      throw new Error('Элемент для отображения ошибок не найден');
    }

    this._initEventListeners();
  }

  /**
   * Устанавливает способ оплаты
   */
  setPaymentMethod(method: PaymentMethod): void {
    this.paymentMethod = method;

    // Обновляем внешний вид кнопок
    this._paymentButtons.forEach(button => {
      if (
        (method === 'online' && button.name === 'card') ||
        (method === 'cash' && button.name === 'cash')
      ) {
        button.classList.add(CLASS_NAMES.BUTTON_SELECTED);
      } else {
        button.classList.remove(CLASS_NAMES.BUTTON_SELECTED);
      }
    });

    // Проверяем валидность формы
    this._validateForm();
  }

  /**
   * Устанавливает адрес доставки
   */
  setAddress(address: string): void {
    this.address = address;
    this._addressInput.value = address;

    // Проверяем валидность формы
    this._validateForm();
  }

  /**
   * Проверяет валидность формы
   */
  private _validateForm(): void {
    const errors: string[] = [];

    // Проверяем, выбран ли способ оплаты
    if (!this.paymentMethod) {
      errors.push(MESSAGES.PAYMENT_REQUIRED);
    }

    // Проверяем, введен ли адрес
    if (!this.address.trim()) {
      errors.push(MESSAGES.ADDRESS_REQUIRED);
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
        this._events.emit(AppEvent.ORDER_ADDRESS_SET, { address: this.address });
        this._events.emit(AppEvent.ORDER_PAYMENT_SELECT, { method: this.paymentMethod });
      }
    });

    // Обработчик изменения адреса
    this._addressInput.addEventListener('input', () => {
      this.setAddress(this._addressInput.value);
    });

    // Обработчик выбора способа оплаты
    this._paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        const method = button.name === 'card' ? 'online' : 'cash';
        this.setPaymentMethod(method as PaymentMethod);
      });
    });
  }
}
