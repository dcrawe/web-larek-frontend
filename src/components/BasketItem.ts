import { Component } from './base/Component';
import { IEvents } from './base/events';
import { AppEvent, IBasketRemoveEvent, IProduct } from '../types';
import { CLASS_NAMES, TEMPLATE_IDS } from '../utils/constants';

/**
 * Компонент элемента корзины
 */
export class BasketItem extends Component {
	constructor(
		private readonly _events: IEvents,
		private readonly _product: IProduct,
		private readonly _index: number
	) {
		super();
		this._render();
	}

	/**
	 * Рендерит элемент корзины
	 */
	private _render(): void {
		const template = document.getElementById(
			TEMPLATE_IDS.CARD_BASKET
		) as HTMLTemplateElement;
		const clone = template.content.cloneNode(true) as DocumentFragment;
		const basketItem = clone.firstElementChild as HTMLElement;

		const indexElement = basketItem.querySelector(
			`.${CLASS_NAMES.BASKET_ITEM_INDEX}`
		);

		if (indexElement) {
			indexElement.textContent = String(this._index + 1);
		}

		const titleElement = basketItem.querySelector(`.${CLASS_NAMES.CARD_TITLE}`);

		if (titleElement) {
			titleElement.textContent = this._product.title;
		}

		const priceElement = basketItem.querySelector(`.${CLASS_NAMES.CARD_PRICE}`);

		if (priceElement) {
			priceElement.textContent = `${this._product.price} синапсов`;
		}

		const deleteButton = basketItem.querySelector(
			`.${CLASS_NAMES.BASKET_ITEM_DELETE}`
		);

		if (deleteButton) {
			deleteButton.addEventListener('click', () => {
				this._events.emit<IBasketRemoveEvent>(AppEvent.BASKET_REMOVE, {
					productId: this._product.id,
				});
			});
		}

		this._element = basketItem;
	}
}
