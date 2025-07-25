import { Observable } from './base/Observable';
import { IEvents } from '../components';
import { IProduct, IProductDTO, AppEvent } from '../types';
import { CDN_URL } from '../utils/constants';

export class ProductModel extends Observable {
	private _products: IProduct[] = [];
	private _selectedProduct: IProduct | null = null;

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
	 * Загружает список продуктов из массива DTO
	 */
	setProducts(productsDTO: IProductDTO[]): void {
		this._products = productsDTO.map(dto => this.mapProduct(dto));
		this._notifyChange(AppEvent.PRODUCTS_LOADED, {
			products: this._products
		});
	}

	/**
	 * Возвращает список всех продуктов
	 */
	getProducts(): IProduct[] {
		return [...this._products];
	}

	/**
	 * Находит продукт по ID
	 */
	getProductById(id: string): IProduct | undefined {
		return this._products.find(product => product.id === id);
	}
}