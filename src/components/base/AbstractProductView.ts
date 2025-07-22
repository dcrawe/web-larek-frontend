import { TemplateComponent } from './TemplateComponent';
import { IEvents } from './events';
import { IProduct, IProductCard, ProductCategory, AppEvent } from '../../types';
import { CLASS_NAMES } from '../../utils/constants';

/**
 * Абстрактный базовый класс для всех компонентов отображения товара
 */
export abstract class AbstractProductView extends TemplateComponent implements IProductCard {
  readonly product: IProduct;

  constructor(product: IProduct, protected readonly _events: IEvents, templateId: string) {
    super(templateId);
    this.product = product;
  }

  /**
   * Отрисовывает основную информацию о товаре
   */
  protected renderProductInfo(): void {
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
      this.setCategoryClass(categoryElement, this.product.category);
    }

    // Устанавливаем описание товара, если элемент существует
    const textElement = this._element.querySelector(`.${CLASS_NAMES.CARD_TEXT}`);
    if (textElement) {
      textElement.textContent = this.product.description;
    }
  }

  /**
   * Устанавливает класс категории для элемента
   */
  protected setCategoryClass(element: Element, category: ProductCategory): void {
    // Удаляем все классы категорий
    element.classList.remove(
      CLASS_NAMES.CARD_CATEGORY_SOFT,
      CLASS_NAMES.CARD_CATEGORY_HARD,
      CLASS_NAMES.CARD_CATEGORY_OTHER,
      CLASS_NAMES.CARD_CATEGORY_BUTTON,
      CLASS_NAMES.CARD_CATEGORY_ADDITIONAL
    );

    // Добавляем соответствующий класс категории
    switch (category) {
      case 'софт-скил':
        element.classList.add(CLASS_NAMES.CARD_CATEGORY_SOFT);
        break;
      case 'хард-скил':
        element.classList.add(CLASS_NAMES.CARD_CATEGORY_HARD);
        break;
      case 'другое':
        element.classList.add(CLASS_NAMES.CARD_CATEGORY_OTHER);
        break;
      case 'кнопка':
        element.classList.add(CLASS_NAMES.CARD_CATEGORY_BUTTON);
        break;
      case 'дополнительное':
        element.classList.add(CLASS_NAMES.CARD_CATEGORY_ADDITIONAL);
        break;
    }
  }

  /**
   * Обновляет состояние кнопки добавления в корзину
   */
  updateAddButton(isInBasket: boolean, button: HTMLButtonElement): void {
    if (isInBasket) {
      button.textContent = 'Убрать';
      button.classList.add(CLASS_NAMES.BUTTON_ALT);
    } else {
      button.textContent = 'В корзину';
      button.classList.remove(CLASS_NAMES.BUTTON_ALT);
    }
  }

  /**
   * Инициализирует обработчики событий
   */
  protected abstract initEvents(): void;
}
