export type ProductCategory = 'софт-скил' | 'хард-скил' | 'другое' | 'кнопка' | 'дополнительное';

// Модель товара от API
export interface IProductDTO {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

// Модель товара для отображения
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: ProductCategory;
  price: number;
}

// Типы способов оплаты
export type PaymentMethod = 'online' | 'cash';

// Модель для заказа (запрос к API)
export interface IOrderDTO {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}

// Модель ответа от API при оформлении заказа
export interface IOrderResponseDTO {
  id: string;
  total: number;
}

// Модель для ошибки от API
export interface IErrorResponseDTO {
  error: string;
}

// Модель для корзины
export interface IBasketItem {
  product: IProduct;
  quantity: number;
}

// Модель для пользователя
export interface IUser {
  email: string;
  phone: string;
  address: string;
  payment: PaymentMethod;
}

// Состояние приложения
export interface IAppState {
  catalog: IProduct[];
  basket: Map<string, IBasketItem>;
  preview: IProduct | null;
  order: IOrderDTO | null;
  formErrors: string[];
}
