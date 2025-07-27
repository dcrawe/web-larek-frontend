import { TemplateComponent } from './base/TemplateComponent';
import { IEvents } from './base/events';
import { AppEvent, IOrderSuccessEvent, EmptyEvent } from '../types';
import { CLASS_NAMES, ERROR_MESSAGES, TEMPLATE_IDS } from '../utils/constants';

export class Success extends TemplateComponent {
	private readonly _title: HTMLElement;
	private readonly _description: HTMLElement;
	private readonly _button: HTMLButtonElement;

	constructor(private readonly _events: IEvents) {
		super(TEMPLATE_IDS.SUCCESS);

		// Находим элементы
		this._title = this._element.querySelector(`.${CLASS_NAMES.ORDER_SUCCESS_TITLE}`);
		this._description = this._element.querySelector(`.${CLASS_NAMES.ORDER_SUCCESS_DESCRIPTION}`);
		this._button = this._element.querySelector(`.${CLASS_NAMES.ORDER_SUCCESS_CLOSE}`) as HTMLButtonElement;

		if (!this._title || !this._description || !this._button) {
			throw new Error(ERROR_MESSAGES.SUCCESS_COMPONENT_ELEMENTS_NOT_FOUND);
		}

		this._initEventListeners();
	}

	/**
	 * Обновляет отображение информации о заказе
	 */
	private _updateOrderInfo(orderId: string, total: number): void {
		this._title.textContent = 'Заказ оформлен';
		this._description.textContent = `Списано ${total} синапсов`;
	}

	/**
	 * Инициализирует обработчики событий
	 */
	private _initEventListeners(): void {
		// Обработчик клика по кнопке закрытия
		this._button.addEventListener('click', () => {
			this._events.emit<EmptyEvent>(AppEvent.MODAL_CLOSE, {});
		});

		// Обработчик события успешного оформления заказа от модели
		this._events.on<IOrderSuccessEvent>(AppEvent.ORDER_SUCCESS, (data) => {
			this._updateOrderInfo(data.orderId, data.total);
		});
	}
}