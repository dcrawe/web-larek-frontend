import { Observable } from './base/Observable';
import { IEvents } from '../components';
import { IProduct, IProductDTO, AppEvent } from '../types';
import { CDN_URL } from '../utils/constants';

export class ProductModel extends Observable {
	private _products: IProduct[] = [];

	constructor(events: IEvents) {
		super(events);
	}

	/**
	 * Преобразует DTO продукта в модель продукта
	 */
	mapProduct(dto: IProductDTO): IProduct {
		return {
			id: dto.id,
			description: dto.description,
			image: `${CDN_URL}/${dto.image}`,
			title: dto.title,
			category: dto.category as any,
			price: dto.price || 0
		};
	}

	/**
	 * Устанавливает список товаров
	 */
	setProducts(productsDTO: IProduct[]): void {
		this._products = productsDTO.map(dto => this.mapProduct(dto));
		this._notifyChange(AppEvent.PRODUCTS_LOADED, { products: this._products });
	}

	/**
	 * Получает товар по ID
	 */
	getProduct(id: string): IProduct | null {
		return this._products.find(product => product.id === id) || null;
	}
}