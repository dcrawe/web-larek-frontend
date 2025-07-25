import { Observable } from './base/Observable';
import { IEvents } from '../components/base/events';
import { IProduct, AppEvent } from '../types';

export class BasketModel extends Observable {
	private _items: Map<string, IProduct> = new Map();

	constructor(events: IEvents) {
		super(events);
	}

	/**
	 * Добавляет товар в корзину
	 */
	addItem(product: IProduct): void {
		this._items.set(product.id, product);
		this._notifyBasketUpdate();
	}

	/**
	 * Удаляет товар из корзины
	 */
	removeItem(id: string): void {
		const removed = this._items.delete(id);

		if (removed) {
			this._notifyBasketUpdate();
		}
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
	getItems(): Map<string, IProduct> {
		return new Map(this._items);
	}

	/**
	 * Возвращает массив товаров в корзине
	 */
	getItemsArray(): IProduct[] {
		return Array.from(this._items.values());
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
		return Array.from(this._items.values()).reduce((total, item) => total + item.price, 0);
	}

	/**
	 * Проверяет, есть ли товар в корзине
	 */
	hasItem(id: string): boolean {
		return this._items.has(id);
	}

	/**
	 * Возвращает количество товаров в корзине
	 */
	getItemCount(): number {
		return this._items.size;
	}

	/**
	 * Уведомляет об изменениях в корзине
	 */
	private _notifyBasketUpdate(): void {
		const items = this.getItemsArray();
		const total = this.getTotalPrice();
		const count = this.getItemCount();

		// Уведомляем компонент корзины
		this._notifyChange(AppEvent.BASKET_UPDATE, {
			items,
			total,
			count
		});

		// Уведомляем модель заказа
		this._notifyChange(AppEvent.ORDER_UPDATE, {
			items: this.getItemIds(),
			total
		});
	}
}