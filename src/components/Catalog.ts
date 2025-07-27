import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ICatalog, IProduct, IView } from '../types';
import { ProductCard } from './ProductCard';
import { CLASS_NAMES, ERROR_MESSAGES } from '../utils/constants';

export class Catalog extends Component implements ICatalog, IView {
	readonly template: HTMLTemplateElement = null;
	readonly container: HTMLElement;
	private _cards: ProductCard[] = [];

	constructor(
		public readonly events: IEvents,
		private readonly _cardFactory: (productId: string) => ProductCard,
		containerSelector: string = `.${CLASS_NAMES.GALLERY}`
	) {
		super();

		const gallery = document.querySelector(containerSelector);

		if (!gallery) {
			throw new Error(ERROR_MESSAGES.CONTAINER_WITH_SELECTOR_NOT_FOUND.replace(':container', containerSelector));
		}

		this._element = gallery as HTMLElement;
		this.container = document.body;
	}

	/**
	 * Отображает список продуктов в каталоге
	 */
	renderProducts(products: IProduct[]): void {
		this.clear();

		this._cards = products.map(product => {
			const card = this._cardFactory(product.id);
			this._element.appendChild(card.render());
			return card;
		});
	}

	/**
	 * Обновляет отображение без пересоздания карточек
	 */
	updateView(): void {
		this._cards.forEach(card => card.update());
	}

	/**
	 * Очищает каталог
	 */
	clear(): void {
		this._element.innerHTML = '';
		this._cards = [];
	}
}