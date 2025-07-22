import { TemplateComponent } from './base/TemplateComponent';
import { IEvents } from './base/events';
import { IProductCard, AppEvent, IProduct } from '../types';
import { CLASS_NAMES, TEMPLATE_IDS } from '../utils/constants';

export class ProductPreview extends TemplateComponent implements IProductCard {
  readonly product: IProduct;
  private readonly _addButton: HTMLButtonElement;

  constructor(product: IProduct, private readonly _events: IEvents) {
    super(TEMPLATE_IDS.CARD_PREVIEW);
    this.product = product;

    // Находим кнопку добавления в корзину
    this._addButton = this._element.querySelector(`.${CLASS_NAMES.CARD_BUTTON}`) as HTMLButtonElement;
    if (!this._addButton) {
      throw new Error('Кнопка добавления в корзину не найдена');
    }

    this._render();
    this._initEventListeners();
  }

  /**
   * Отрисовывает детальную информацию о товаре
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

    // Устанавливаем описание товара
    const textElement = this._element.querySelector(`.${CLASS_NAMES.CARD_TEXT}`);
    if (textElement) {
      textElement.textContent = this.product.description;
    }
  }

  /**
   * Обновляет состояние кнопки добавления в корзину
   * @param isInBasket - находится ли товар в корзине
   */
  updateAddButton(isInBasket: boolean): void {
    if (isInBasket) {
      this._addButton.textContent = 'Убрать';
      this._addButton.classList.add(CLASS_NAMES.BUTTON_ALT);
    } else {
      this._addButton.textContent = 'В корзину';
      this._addButton.classList.remove(CLASS_NAMES.BUTTON_ALT);
    }
  }

  /**
   * Инициализирует обработчики событий
   */
  private _initEventListeners(): void {
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
