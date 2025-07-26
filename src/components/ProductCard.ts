import { IEvents } from './base/events';
import { IProduct, AppEvent } from '../types';
import { TEMPLATE_IDS } from '../utils/constants';
import { AbstractProductView } from './base/AbstractProductView';

export class ProductCard extends AbstractProductView {
	constructor(
		productId: string,
		private readonly events: IEvents,
		getProduct: (id: string) => IProduct | null,
		template: string = TEMPLATE_IDS.CARD_CATALOG
	) {
		super(productId, events, template, getProduct);

		this.renderProductInfo();
		this.initEvents();
	}

	/**
	 * Инициализирует обработчики событий
	 */
	protected initEvents(): void {
		// Обработчик клика по карточке товара
		this._element.addEventListener('click', () => {
			this.events.emit(AppEvent.PRODUCT_SELECT, { productId: this._productId });
		});
	}
}