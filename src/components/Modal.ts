import { IEvents } from './base/events';
import { Component } from './base/Component';
import { IModal, IModalOpenEvent, EmptyEvent } from '../types';
import { MODAL_IDS, CLASS_NAMES, ERROR_MESSAGES } from '../utils/constants';
import { AppEvent } from '../types';

export class Modal extends Component implements IModal {
	readonly template: HTMLTemplateElement = null;
	readonly container: HTMLElement;
	private _content: HTMLElement;
	private readonly _closeButton: HTMLButtonElement;
	private readonly _contentContainer: HTMLElement;

	constructor(
		private readonly _events: IEvents,
		modalId: string = MODAL_IDS.MODAL_CONTAINER
	) {
		super();

		const modal = document.getElementById(modalId);
		if (!modal) {
			throw new Error(
				ERROR_MESSAGES.MODAL_NOT_FOUND.replace(':modal', modalId)
			);
		}
		this._element = modal as HTMLElement;
		this.container = document.body;

		this._contentContainer = this._element.querySelector(
			`.${CLASS_NAMES.MODAL_CONTENT}`
		);
		if (!this._contentContainer) {
			throw new Error(ERROR_MESSAGES.MODAL_CONTENT_CONTAINER_NOT_FOUND);
		}

		this._closeButton = this._element.querySelector(
			`.${CLASS_NAMES.MODAL_CLOSE}`
		);
		if (!this._closeButton) {
			throw new Error(ERROR_MESSAGES.MODAL_CLOSE_BUTTON_NOT_FOUND);
		}

		this._initEventListeners();
	}

	/**
	 * Открывает модальное окно
	 */
	open(): void {
		this._element.classList.add(CLASS_NAMES.MODAL_ACTIVE);
		document.body.style.overflow = 'hidden';
	}

	/**
	 * Закрывает модальное окно
	 */
	close(): void {
		this._element.classList.remove(CLASS_NAMES.MODAL_ACTIVE);
		document.body.style.overflow = '';
		this._events.emit<EmptyEvent>(AppEvent.MODAL_CLOSE, {});
	}

	/**
	 * Устанавливает содержимое модального окна
	 */
	setContent(content: HTMLElement | string): void {
		if (typeof content === 'string') {
			this._contentContainer.innerHTML = content;
		} else {
			this._content = content;
			this._contentContainer.innerHTML = '';
			this._contentContainer.appendChild(this._content);
		}
	}

	/**
	 * Инициализирует обработчики событий
	 */
	private _initEventListeners(): void {
		// Закрытие по клику на крестик
		this._closeButton.addEventListener('click', () => {
			this.close();
		});

		// Закрытие по клику вне модального окна
		this._element.addEventListener('click', (event) => {
			if (event.target === this._element) {
				this.close();
			}
		});

		// Обработчик события открытия модального окна
		this._events.on<IModalOpenEvent>(AppEvent.MODAL_OPEN, (data) => {
			this.setContent(data.content);
			this.open();
		});

		// Обработчик события закрытия модального окна
		this._events.on<EmptyEvent>(AppEvent.MODAL_CLOSE, () => {
			if (this._element.classList.contains(CLASS_NAMES.MODAL_ACTIVE)) {
				this.close();
			}
		});
	}
}
