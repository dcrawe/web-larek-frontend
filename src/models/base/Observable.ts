import { IEvents } from '../../components';
import { AppEvent, IEventPayloadMap } from '../../types';

/**
 * Базовый класс для наблюдаемых моделей
 */
export abstract class Observable {
	protected constructor(protected readonly _events: IEvents) {}

	/**
	 * Уведомляет подписчиков об изменениях
	 */
	protected _notifyChange<T extends AppEvent>(
		eventName: T,
		data?: IEventPayloadMap[T]
	): void {
		this._events.emit(eventName, data);
	}
}
