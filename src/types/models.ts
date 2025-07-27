export type ProductCategory =
	| 'софт-скил'
	| 'хард-скил'
	| 'другое'
	| 'кнопка'
	| 'дополнительное';

// Типы способов оплаты
export type PaymentMethod = 'online' | 'cash';

// Базовая модель товара
export interface IProductBase {
	id: string;
	description: string;
	image: string;
	title: string;
	price: number;
}

// Модель товара от API
export interface IProductDTO extends IProductBase {
	category: string;
}

// Модель товара для отображения
export interface IProduct extends IProductBase {
	category: ProductCategory;
}

// Базовая модель для контактных данных
export interface IContactInfo {
	email: string;
	phone: string;
	address: string;
}

// Модель для пользователя
export interface IUser extends IContactInfo {
	payment: PaymentMethod;
}

// Модель для заказа (запрос к API)
export interface IOrderDTO extends IContactInfo {
	payment: PaymentMethod;
	total: number;
	items: string[];
}

// Модель ответа от API при оформлении заказа
export interface IOrderResponseDTO {
	id: string;
	total: number;
}
