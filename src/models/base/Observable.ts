import { IEvents } from '../../components/base/events';

/**
 * Базовый класс для наблюдаемых моделей
 */
export abstract class Observable {
	constructor(protected readonly _events: IEvents) {}

	/**
	 * Уведомляет подписчиков об изменениях
	 */
	protected _notifyChange(eventName: string, data?: any): void {
		this._events.emit(eventName, data);
	}
}