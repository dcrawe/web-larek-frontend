import { Component } from './base/Component';
import { IEvents } from './base/events';
import { AppEvent } from '../types';
import { CLASS_NAMES } from '../utils/constants';

/**
 * Компонент для отображения количества товаров в корзине
 */
export class BasketCounter extends Component {
  private _counter: HTMLElement;

  constructor(private readonly _events: IEvents) {
    super();

    // Находим элемент счетчика в DOM
    this._counter = document.querySelector(`.${CLASS_NAMES.HEADER_BASKET_COUNTER}`);
    if (!this._counter) {
      throw new Error('Элемент счетчика корзины не найден');
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
    this._events.on<{ items: any[], total: number, count: number }>(AppEvent.BASKET_UPDATE, (data) => {
      this._updateCounter(data.count);
    });
  }
}
