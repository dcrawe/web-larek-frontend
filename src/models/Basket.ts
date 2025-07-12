import { IEvents } from '../components';
import { IBasketItem, IProduct, AppEvent } from '../types';

export class BasketModel {
  private _items: Map<string, IBasketItem> = new Map();

  constructor(private readonly _events: IEvents) {
    this._initEventListeners();
  }

  /**
   * Добавляет товар в корзину
   */
  addItem(product: IProduct, quantity: number = 1): void {
    if (this._items.has(product.id)) {
      const existingItem = this._items.get(product.id);
      existingItem.quantity += quantity;
    } else {
      this._items.set(product.id, { product, quantity });
    }

    this._notifyBasketUpdate();
  }

  /**
   * Удаляет товар из корзины
   */
  removeItem(id: string): void {
    this._items.delete(id);
    this._notifyBasketUpdate();
  }

  /**
   * Очищает корзину
   */
  clear(): void {
    this._items.clear();
    this._notifyBasketUpdate();
  }

  /**
   * Возвращает товары в корзине
   */
  getItems(): Map<string, IBasketItem> {
    return this._items;
  }

  /**
   * Возвращает массив идентификаторов товаров в корзине
   */
  getItemIds(): string[] {
    return Array.from(this._items.keys());
  }

  /**
   * Вычисляет общую стоимость товаров в корзине
   */
  getTotalPrice(): number {
    let total = 0;

    this._items.forEach(item => {
      total += item.product.price * item.quantity;
    });

    return total;
  }

  /**
   * Проверяет, есть ли товар в корзине
   */
  hasItem(id: string): boolean {
    return this._items.has(id);
  }

  /**
   * Оповещает об изменении корзины
   */
  private _notifyBasketUpdate(): void {
    this._events.emit(AppEvent.BASKET_UPDATE, {
      items: Array.from(this._items.values()),
      total: this.getTotalPrice()
    });
  }

  /**
   * Инициализирует обработчики событий
   */
  private _initEventListeners(): void {
    this._events.on<{ product: IProduct }>(AppEvent.BASKET_ADD, (data) => {
      this.addItem(data.product);
    });

    this._events.on<{ productId: string }>(AppEvent.BASKET_REMOVE, (data) => {
      this.removeItem(data.productId);
    });

    this._events.on(AppEvent.BASKET_CLEAR, () => {
      this.clear();
    });

    this._events.on(AppEvent.ORDER_SUCCESS, () => {
      this.clear();
    });
  }
}
