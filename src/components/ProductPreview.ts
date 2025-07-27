import { IEvents } from './base/events';
import {
	AppEvent,
	IBasketAddEvent,
	IBasketRemoveEvent,
	IProduct,
} from '../types';
import { CLASS_NAMES, ERROR_MESSAGES, TEMPLATE_IDS } from '../utils/constants';
import { AbstractProductView } from './base/AbstractProductView';

export class ProductPreview extends AbstractProductView {
	private readonly _addButton: HTMLButtonElement;

	constructor(
		productId: string,
		events: IEvents,
		getProduct: (id: string) => IProduct | null,
		private readonly _isInBasket: (productId: string) => boolean
	) {
		super(productId, events, TEMPLATE_IDS.CARD_PREVIEW, getProduct);

		this._addButton = this._element.querySelector(
			`.${CLASS_NAMES.CARD_BUTTON}`
		) as HTMLButtonElement;

		if (!this._addButton) {
			throw new Error(ERROR_MESSAGES.ADD_TO_BASKET_BUTTON_NOT_FOUND);
		}

		this.renderProductInfo();
		this.updateAddButtonState();
		this.initEvents();
	}

	/**
	 * Обновляет компонент и состояние кнопки
	 */
	update(): void {
		super.update();

		this.updateAddButtonState();
	}

	/**
	 * Обновляет состояние кнопки на основе текущего состояния корзины
	 */
	private updateAddButtonState(): void {
		const isInBasket = this._isInBasket(this._productId);

		this.updateAddButton(isInBasket, this._addButton);
	}

	/**
	 * Инициализирует обработчики событий
	 */
	protected initEvents(): void {
		// Обработчик клика по кнопке добавления/удаления из корзины
		this._addButton.addEventListener('click', () => {
			if (this._isInBasket(this._productId)) {
				this._events.emit<IBasketRemoveEvent>(AppEvent.BASKET_REMOVE, {
					productId: this._productId,
				});
			} else {
				this._events.emit<IBasketAddEvent>(AppEvent.BASKET_ADD, {
					productId: this._productId,
				});
			}

			this.updateAddButtonState();
		});
	}
}
