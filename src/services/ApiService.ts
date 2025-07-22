import { IApi, IOrderDTO, IOrderResponseDTO, IProductDTO, IProductsResponseDTO } from '../types';
import { API_URL } from '../utils/constants';

export class ApiService implements IApi {
  readonly baseUrl: string;

  constructor(baseUrl: string = API_URL.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Выполняет GET-запрос к API
   */
  private async _get<T>(url: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as T;
  }

  /**
   * Выполняет POST-запрос к API
   */
  private async _post<T, R>(url: string, data: T): Promise<R> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as R;
  }

  /**
   * Получает список товаров
   */
  async getProducts(): Promise<IProductDTO[]> {
    try {
      const data = await this._get<IProductsResponseDTO>(API_URL.PRODUCTS);
      return data.items;
    } catch (error) {
      console.error('Ошибка при получении списка товаров:', error);
      throw error;
    }
  }

  /**
   * Оформляет заказ
   */
  async createOrder(order: IOrderDTO): Promise<IOrderResponseDTO> {
    try {
      return await this._post<IOrderDTO, IOrderResponseDTO>(API_URL.ORDERS, order);
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      throw error;
    }
  }
}
