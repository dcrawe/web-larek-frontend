import { IApi, IOrderDTO, IOrderResponseDTO, IProductDTO, IProductsResponseDTO } from '../types';
import { API_URL } from '../utils/constants';
import { Api } from '../components/base/api';

export class ApiService extends Api implements IApi {
	constructor(baseUrl: string = API_URL.BASE_URL) {
		super(baseUrl);
	}

	/**
	 * Получает список товаров
	 */
	async getProducts(): Promise<IProductDTO[]> {
		try {
			const data = await this.get(API_URL.PRODUCTS) as IProductsResponseDTO;
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
			return await this.post(API_URL.ORDERS, order) as IOrderResponseDTO;
		} catch (error) {
			console.error('Ошибка при оформлении заказа:', error);
			throw error;
		}
	}
}