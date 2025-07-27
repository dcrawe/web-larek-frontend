import { TemplateComponent } from './base/TemplateComponent';
import { IEvents } from './base/events';
import {
	AppEvent,
	IBasketUpdateEvent,
	EmptyEvent,
} from '../types';
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
	 * @param items - массив готовых HTML элементов товаров
	 * @param total - общая стоимость
	 */
	private _updateDisplay(items: HTMLElement[], total: number): void {
		this._list.innerHTML = '';

		items.forEach(item => {
			this._list.appendChild(item);
		});

		this._price.textContent = `${total} синапсов`;
		this._button.disabled = items.length === 0 || total === 0;
	}

	/**
	 * Инициализирует обработчики событий
	 */
	private _initEventListeners(): void {
		// Обработчик обновления корзины от модели
		this._events.on<IBasketUpdateEvent>(AppEvent.BASKET_UPDATE, (data) => {
			this._updateDisplay(data.renderedItems, data.total);
		});

		// Обработчик клика по кнопке оформления заказа
		this._button.addEventListener('click', () => {
			this._events.emit<EmptyEvent>(AppEvent.ORDER_OPEN, {});
		});
	}
}
