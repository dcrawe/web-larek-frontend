import { IOrderDTO, IOrderResponseDTO, IProductDTO } from './models';

// Интерфейс API-клиента
export interface IApi {
  // Получение списка товаров
  getProducts(): Promise<IProductDTO[]>;

  // Получение информации о товаре по ID
  getProductById(id: string): Promise<IProductDTO>;

  // Оформление заказа
  createOrder(order: IOrderDTO): Promise<IOrderResponseDTO>;
}

// Интерфейс ответа при получении списка товаров
export interface IProductsResponseDTO {
  total: number;
  items: IProductDTO[];
}
