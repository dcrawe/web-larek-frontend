import { IEvents } from './base/events';
import { AppEvent, IProduct } from '../types';
import {  TEMPLATE_IDS } from '../utils/constants';
import { AbstractProductView } from './base/AbstractProductView';

export class ProductCard extends AbstractProductView {
	readonly product: IProduct;

	constructor(
		product: IProduct,
		private readonly events: IEvents,
		template: string = TEMPLATE_IDS.CARD_CATALOG
	) {
		super(product, events, template);
		this.product = product;
		this.renderProductInfo();
		this.initEvents();
	}

	/**
	 * Инициализирует обработчики событий
	 */
	protected initEvents(): void {
		// Обработчик клика по карточке товара
		this._element.addEventListener('click', () => {
			this.events.emit(AppEvent.PRODUCT_SELECT, { product: this.product });
		});
	}
}
