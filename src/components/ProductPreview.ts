import { IEvents } from './base/events';
import { AppEvent, IProduct } from '../types';
import { CLASS_NAMES, TEMPLATE_IDS } from '../utils/constants';
import { AbstractProductView } from './base/AbstractProductView';

  export class ProductPreview extends AbstractProductView {
  private readonly _addButton: HTMLButtonElement;

  constructor(product: IProduct, events: IEvents) {
    super(product, events, TEMPLATE_IDS.CARD_PREVIEW);

    // Находим кнопку добавления в корзину
    this._addButton = this._element.querySelector(`.${CLASS_NAMES.CARD_BUTTON}`) as HTMLButtonElement;
    if (!this._addButton) {
      throw new Error('Кнопка добавления в корзину не найдена');
    }

    this.renderProductInfo();
    this.initEvents();
  }

  /**
   * Обновляет состояние кнопки добавления в корзину
   * @param isInBasket - находится ли товар в корзине
   */
  updateAddButton(isInBasket: boolean): void {
    super.updateAddButton(isInBasket, this._addButton);
  }

  /**
   * Инициализирует обработчики событий
   */
  protected initEvents(): void {
    // Обработчик клика по кнопке добавления/удаления из корзины
    this._addButton.addEventListener('click', () => {
      if (this._addButton.textContent === 'Убрать') {
        // Если товар в корзине - удаляем его
        this._events.emit(AppEvent.BASKET_REMOVE, { productId: this.product.id });
        this.updateAddButton(false);
      } else {
        // Если товара нет в корзине - добавляем его
        this._events.emit(AppEvent.BASKET_ADD, { product: this.product });
        this.updateAddButton(true);
      }
    });
  }
}
