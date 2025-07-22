import { TemplateComponent } from './base/TemplateComponent';
import { IEvents } from './base/events';
import { IProductCard, AppEvent, IProduct } from '../types';
import { CLASS_NAMES, TEMPLATE_IDS } from '../utils/constants';

export class ProductCard extends TemplateComponent implements IProductCard {
  readonly product: IProduct;

  constructor(
    product: IProduct,
    private readonly _events: IEvents,
    template: string = TEMPLATE_IDS.CARD_CATALOG
  ) {
    super(template);
    this.product = product;
    this._render();
    this._initEventListeners();
  }

  /**
   * Отрисовывает карточку товара
   */
  private _render(): void {
    // Устанавливаем название товара
    const titleElement = this._element.querySelector(`.${CLASS_NAMES.CARD_TITLE}`);
    if (titleElement) {
      titleElement.textContent = this.product.title;
    }

    // Устанавливаем цену товара
    const priceElement = this._element.querySelector(`.${CLASS_NAMES.CARD_PRICE}`);
    if (priceElement) {
      priceElement.textContent = `${this.product.price} синапсов`;
    }

    // Устанавливаем изображение товара
    const imageElement = this._element.querySelector(`.${CLASS_NAMES.CARD_IMAGE}`) as HTMLImageElement;
    if (imageElement) {
      imageElement.src = this.product.image;
      imageElement.alt = this.product.title;
    }

    // Устанавливаем категорию товара
    const categoryElement = this._element.querySelector(`.${CLASS_NAMES.CARD_CATEGORY}`);
    if (categoryElement) {
      categoryElement.textContent = this.product.category;

      // Удаляем все классы категорий
      categoryElement.classList.remove(
        CLASS_NAMES.CARD_CATEGORY_SOFT,
        CLASS_NAMES.CARD_CATEGORY_HARD,
        CLASS_NAMES.CARD_CATEGORY_OTHER,
        CLASS_NAMES.CARD_CATEGORY_BUTTON,
        CLASS_NAMES.CARD_CATEGORY_ADDITIONAL
      );

      // Добавляем соответствующий класс категории
      switch (this.product.category) {
        case 'софт-скил':
          categoryElement.classList.add(CLASS_NAMES.CARD_CATEGORY_SOFT);
          break;
        case 'хард-скил':
          categoryElement.classList.add(CLASS_NAMES.CARD_CATEGORY_HARD);
          break;
        case 'другое':
          categoryElement.classList.add(CLASS_NAMES.CARD_CATEGORY_OTHER);
          break;
        case 'кнопка':
          categoryElement.classList.add(CLASS_NAMES.CARD_CATEGORY_BUTTON);
          break;
        case 'дополнительное':
          categoryElement.classList.add(CLASS_NAMES.CARD_CATEGORY_ADDITIONAL);
          break;
      }
    }

    // Устанавливаем описание товара (если есть в шаблоне)
    const textElement = this._element.querySelector(`.${CLASS_NAMES.CARD_TEXT}`);
    if (textElement) {
      textElement.textContent = this.product.description;
    }
  }

  /**
   * Инициализирует обработчики событий
   */
  private _initEventListeners(): void {
    // Обработчик клика по карточке товара
    this._element.addEventListener('click', () => {
      this._events.emit(AppEvent.PRODUCT_SELECT, { product: this.product });
    });

    // Обработчик клика по кнопке "В корзину" (если есть в шаблоне)
    const addButton = this._element.querySelector(`.${CLASS_NAMES.CARD_BUTTON}`);
    if (addButton) {
      addButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Предотвращаем всплытие события
        this._events.emit(AppEvent.BASKET_ADD, { product: this.product });
      });
    }
  }
}
