import { IEvents } from '../components';
import { AppEvent, IProduct } from '../types';
import { Observable } from './base/Observable';

export interface ICatalogModel {
	readonly products: IProduct[];
	setProducts(products: IProduct[]): void;
	addProduct(product: IProduct): void;
	removeProduct(productId: string): void;
	clear(): void;
	getProductById(id: string): IProduct | null;
}

export class CatalogModel extends Observable implements ICatalogModel {
	private _products: IProduct[] = [];

	constructor(events: IEvents) {
		super(events);
	}

	get products(): IProduct[] {
		return [...this._products];
	}

	setProducts(products: IProduct[]): void {
		this._products = [...products];
		this._notifyChange<AppEvent.PRODUCTS_LOADED>(AppEvent.PRODUCTS_LOADED, {
			products: this._products
		});
	}

	addProduct(product: IProduct): void {
		this._products.push(product);
		this._notifyChange<AppEvent.PRODUCTS_LOADED>(AppEvent.PRODUCTS_LOADED, {
			products: this._products
		});
	}

	removeProduct(productId: string): void {
		const index = this._products.findIndex(product => product.id === productId);
		if (index !== -1) {
			this._products.splice(index, 1);
			this._notifyChange<AppEvent.PRODUCTS_LOADED>(AppEvent.PRODUCTS_LOADED, {
				products: this._products
			});
		}
	}

	clear(): void {
		this._products = [];
		this._notifyChange<AppEvent.PRODUCTS_LOADED>(AppEvent.PRODUCTS_LOADED, {
			products: this._products
		});
	}

	getProductById(id: string): IProduct | null {
		return this._products.find(product => product.id === id) || null;
	}
}
