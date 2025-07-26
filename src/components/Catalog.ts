import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ICatalog, IProduct } from '../types';
import { ProductCard } from './ProductCard';
import { CLASS_NAMES, ERROR_MESSAGES } from '../utils/constants';

export class Catalog extends Component implements ICatalog {
	readonly template: HTMLTemplateElement = null;
	readonly container: HTMLElement;
	readonly cards: ProductCard[] = [];

	constructor(
		private readonly _events: IEvents,
		private readonly _getProduct: (id: string) => IProduct | null,
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
	 * Добавляет готовую карточку в каталог
	 */
	addCard(card: ProductCard): void {
		this.cards.push(card);
		this._element.appendChild(card.render());
	}

	/**
	 * Устанавливает набор карточек в каталоге
	 */
	setCards(cards: ProductCard[]): void {
		this._element.innerHTML = '';
		this.cards.length = 0;

		cards.forEach(card => this.addCard(card));
	}

	/**
	 * Создает карточки из продуктов используя фабрику
	 */
	createCardsFromProducts(products: IProduct[]): void {
		const cards = products.map(product =>
			this._cardFactory(product.id)
		);

		this.setCards(cards);
	}

	/**
	 * Обновляет отображение карточек без пересоздания
	 */
	updateCards(): void {
		this.cards.forEach(card => card.update());
	}

	/**
	 * Удаляет карточку из каталога
	 */
	removeCard(card: ProductCard): void {
		const index = this.cards.indexOf(card);

		if (index !== -1) {
			this.cards.splice(index, 1);

			card.render().remove();
		}
	}

	/**
	 * Очищает каталог
	 */
	clear(): void {
		this._element.innerHTML = '';
		this.cards.length = 0;
	}
}