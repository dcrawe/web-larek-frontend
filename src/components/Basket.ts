import { TemplateComponent } from './base/TemplateComponent';
import { IEvents } from './base/events';
import { AppEvent, IProduct } from '../types';
import { CLASS_NAMES, ERROR_MESSAGES, TEMPLATE_IDS } from '../utils/constants';

export class Basket extends TemplateComponent {
	private _list: HTMLElement;
	private _price: HTMLElement;
	private _button: HTMLButtonElement;

	constructor(private readonly _events: IEvents) {
		super(TEMPLATE_IDS.BASKET);

		// Находим элементы
		this._list = this._element.querySelector(`.${CLASS_NAMES.BASKET_LIST}`);
		this._price = this._element.querySelector(`.${CLASS_NAMES.BASKET_PRICE}`);
		this._button = this._element.querySelector(`.${CLASS_NAMES.BASKET_BUTTON}`);

		if (!this._list || !this._price || !this._button) {
			throw new Error(ERROR_MESSAGES.BASKET_CONTAINER_NOT_FOUND);
		}

		this._button.disabled = true;

		this._initEventListeners();
	}

	/**
	 * Обновляет отображение корзины
	 */
	private _updateDisplay(items: IProduct[], total: number, count: number): void {
		this._list.innerHTML = '';

		items.forEach((item, index) => {
			const template = document.getElementById(TEMPLATE_IDS.CARD_BASKET) as HTMLTemplateElement;
			const clone = template.content.cloneNode(true) as DocumentFragment;
			const basketItem = clone.firstElementChild as HTMLElement;

			const indexElement = basketItem.querySelector(`.${CLASS_NAMES.BASKET_ITEM_INDEX}`);
			if (indexElement) {
				indexElement.textContent = String(index + 1);
			}

			const titleElement = basketItem.querySelector(`.${CLASS_NAMES.CARD_TITLE}`);
			if (titleElement) {
				titleElement.textContent = item.title;
			}

			const priceElement = basketItem.querySelector(`.${CLASS_NAMES.CARD_PRICE}`);
			if (priceElement) {
				priceElement.textContent = `${item.price} синапсов`;
			}

			const deleteButton = basketItem.querySelector(`.${CLASS_NAMES.BASKET_ITEM_DELETE}`);
			if (deleteButton) {
				deleteButton.addEventListener('click', () => {
					this._events.emit(AppEvent.BASKET_REMOVE, { productId: item.id });
				});
			}

			this._list.appendChild(basketItem);
		});

		this._price.textContent = `${total} синапсов`;
		this._button.disabled = count === 0 || total === 0;
	}

	/**
	 * Инициализирует обработчики событий
	 */
	private _initEventListeners(): void {
		// Обработчик обновления корзины от модели
		this._events.on<{ items: IProduct[], total: number, count: number }>(AppEvent.BASKET_UPDATE, (data) => {
			this._updateDisplay(data.items, data.total, data.count);
		});

		// Обработчик клика по кнопке оформления заказа
		this._button.addEventListener('click', () => {
			this._events.emit(AppEvent.ORDER_OPEN);
		});
	}
}