import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ICatalog, AppEvent, IProduct } from '../types';
import { ProductCard } from './ProductCard';
import { CLASS_NAMES } from '../utils/constants';

export class Catalog extends Component implements ICatalog {
	readonly template: HTMLTemplateElement = null;
	readonly container: HTMLElement;
	readonly cards: ProductCard[] = [];

	constructor(
		private readonly _events: IEvents,
		private readonly _getProduct: (id: string) => IProduct | null,
		containerSelector: string = `.${CLASS_NAMES.GALLERY}`
	) {
		super();

		const gallery = document.querySelector(containerSelector);

		if (!gallery) {
			throw new Error(`Контейнер с селектором ${containerSelector} не найден`);
		}

		this._element = gallery as HTMLElement;
		this.container = document.body;

		this._initEventListeners();
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
	 * Создает карточки из продуктов
	 */
	private _createCards(products: IProduct[]): void {
		const cards = products.map(product =>
			new ProductCard(product.id, this._events, this._getProduct)
		);

		this.setCards(cards);
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

	/**
	 * Инициализирует обработчики событий
	 */
	private _initEventListeners(): void {
		// Обработчик события загрузки товаров из модели
		this._events.on<{ products: IProduct[] }>(AppEvent.PRODUCTS_LOADED, (data) => {
			this._createCards(data.products);
		});
	}
}