import { IEvents } from '../components';
import { IProductDTO, IProduct, AppEvent } from '../types';

export class ProductModel {
  private _products: IProduct[] = [];

  constructor(private readonly _events: IEvents) {}

  /**
   * Преобразует DTO продукта в модель продукта
   */
  mapProduct(dto: IProductDTO): IProduct {
    return {
      id: dto.id,
      description: dto.description,
      image: dto.image,
      title: dto.title,
      category: dto.category as any, // Предполагаем, что категории с API соответствуют нашим
      price: dto.price
    };
  }

  /**
   * Загружает список продуктов из массива DTO
   */
  setProducts(productsDTO: IProductDTO[]): void {
    this._products = productsDTO.map(dto => this.mapProduct(dto));

    this._events.emit(AppEvent.PRODUCTS_LOADED, {
      products: this._products
    });
  }

  /**
   * Возвращает список всех продуктов
   */
  getProducts(): IProduct[] {
    return this._products;
  }

  /**
   * Находит продукт по ID
   */
  getProductById(id: string): IProduct | undefined {
    return this._products.find(product => product.id === id);
  }
}
