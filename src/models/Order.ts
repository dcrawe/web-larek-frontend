import { IEvents } from '../components';
import { IOrderDTO, PaymentMethod, AppEvent } from '../types';
import { BasketModel } from './Basket';

export class OrderModel {
  private _address: string = '';
  private _email: string = '';
  private _phone: string = '';
  private _paymentMethod: PaymentMethod | null = null;

  constructor(
    private readonly _events: IEvents,
    private readonly _basketModel: BasketModel
  ) {
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
   * Формирует объект заказа для отправки на сервер
   */
  createOrder(): IOrderDTO | null {
    if (
      !this._address ||
      !this._email ||
      !this._phone ||
      !this._paymentMethod ||
      this._basketModel.getItemIds().length === 0
    ) {
      return null;
    }

    return {
      address: this._address,
      email: this._email,
      phone: this._phone,
      payment: this._paymentMethod,
      items: this._basketModel.getItemIds(),
      total: this._basketModel.getTotalPrice()
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
      this._basketModel.getItemIds().length > 0
    );
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
