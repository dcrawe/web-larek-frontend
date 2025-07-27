import { Component } from './base/Component';
import { IEvents } from './base/events';
import { AppEvent, IBasketUpdateEvent } from '../types';
import { CLASS_NAMES, ERROR_MESSAGES } from '../utils/constants';

/**
 * Компонент для отображения количества товаров в корзине
 */
export class BasketCounter extends Component {
  private _counter: HTMLElement;

  constructor(private readonly _events: IEvents) {
    super();

    this._counter = document.querySelector(`.${CLASS_NAMES.HEADER_BASKET_COUNTER}`);
    if (!this._counter) {
      throw new Error(ERROR_MESSAGES.BASKET_COUNTER_NOT_FOUND);
    }

    this._element = this._counter;
    this._initEventListeners();
  }

  /**
   * Обновляет отображение счетчика
   */
  private _updateCounter(count: number): void {
    this._counter.textContent = String(count);
  }

  /**
   * Инициализирует обработчики событий
   */
  private _initEventListeners(): void {
    // Обработчик обновления корзины
    this._events.on<IBasketUpdateEvent>(AppEvent.BASKET_UPDATE, (data) => {
      this._updateCounter(data.count);
    });
  }
}
