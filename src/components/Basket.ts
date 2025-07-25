import { TemplateComponent } from './base/TemplateComponent';
import { IEvents } from './base/events';
import { IBasket, AppEvent, IProduct } from '../types';
import { CLASS_NAMES, TEMPLATE_IDS } from '../utils/constants';

export class Basket extends TemplateComponent implements IBasket {
	readonly items: Map<string, IProduct> = new Map();
	readonly total: number = 0;
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
			throw new Error('Не удалось найти обязательные элементы корзины');
		}

		this._button.disabled = true;

		this._initEventListeners();
	}

	/**
	 * Обновляет отображение корзины
	 */
	private _updateDisplay(items: IProduct[], total: number, count: number): void {
		// Очищаем список товаров
		this._list.innerHTML = '';

		// Добавляем товары в список
		items.forEach((item, index) => {
			const template = document.getElementById(TEMPLATE_IDS.CARD_BASKET) as HTMLTemplateElement;
			const clone = template.content.cloneNode(true) as DocumentFragment;
			const basketItem = clone.firstElementChild as HTMLElement;

			// Устанавливаем индекс товара
			const indexElement = basketItem.querySelector(`.${CLASS_NAMES.BASKET_ITEM_INDEX}`);
			if (indexElement) {
				indexElement.textContent = String(index + 1);
			}

			// Устанавливаем название товара
			const titleElement = basketItem.querySelector(`.${CLASS_NAMES.CARD_TITLE}`);
			if (titleElement) {
				titleElement.textContent = item.title;
			}

			// Устанавливаем цену товара
			const priceElement = basketItem.querySelector(`.${CLASS_NAMES.CARD_PRICE}`);
			if (priceElement) {
				priceElement.textContent = `${item.price} синапсов`;
			}

			// Добавляем обработчик удаления товара
			const deleteButton = basketItem.querySelector(`.${CLASS_NAMES.BASKET_ITEM_DELETE}`);
			if (deleteButton) {
				deleteButton.addEventListener('click', () => {
					this._events.emit(AppEvent.BASKET_REMOVE, { productId: item.id });
				});
			}

			this._list.appendChild(basketItem);
		});

		// Обновляем общую стоимость
		this._price.textContent = `${total} синапсов`;

		// Обновляем состояние кнопки
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