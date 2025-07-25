import { IEvents } from '../components';
import { IProduct, PaymentMethod } from './models';
import { ProductCard } from '../components/ProductCard';

// Базовый интерфейс для всех компонентов
export interface IComponent {
	render(): HTMLElement;
}

// Интерфейс для компонента с шаблоном
export interface ITemplateComponent extends IComponent {
	readonly template: HTMLTemplateElement;
	readonly container: HTMLElement;
}

// Интерфейс для модального окна
export interface IModal extends ITemplateComponent {
	open(): void;
	close(): void;
	setContent(content: HTMLElement): void;
}

// Интерфейс для карточки товара
export interface IProductCard extends ITemplateComponent {
	readonly product: IProduct;
}

// Интерфейс для каталога товаров
export interface ICatalog extends ITemplateComponent {
	readonly cards: ProductCard[];
	addCard(card: ProductCard): void;
	setCards(cards: ProductCard[]): void;
	removeCard(card: ProductCard): void;
	clear(): void;
}

// Интерфейс для корзины
export interface IBasket extends ITemplateComponent {
	readonly items: Map<string, IProduct>;
	readonly total: number;
}

// Интерфейс для формы заказа
export interface IOrderForm extends ITemplateComponent {
	readonly paymentMethod: PaymentMethod | null;
	readonly address: string;
	readonly isValid: boolean;
	setPaymentMethod(method: PaymentMethod): void;
	setAddress(address: string): void;
}

// Интерфейс для формы контактов
export interface IContactsForm extends ITemplateComponent {
	readonly email: string;
	readonly phone: string;
	readonly isValid: boolean;
	setEmail(email: string): void;
	setPhone(phone: string): void;
}

// Интерфейс для уведомлений
export interface INotification extends ITemplateComponent {
	show(message: string): void;
	hide(): void;
}

// Интерфейс для представления
export interface IView {
	readonly events: IEvents;
}

// Интерфейс для презентера
export interface IPresenter {
	readonly view: IView;
	init(): void;
}