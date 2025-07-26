import { TemplateComponent } from './TemplateComponent';
import { IEvents } from './events';
import { IProduct, IProductCard, ProductCategory } from '../../types';
import { CLASS_NAMES } from '../../utils/constants';

/**
 * Абстрактный базовый класс для всех компонентов отображения товара
 */
export abstract class AbstractProductView extends TemplateComponent implements IProductCard {
	protected _productId: string;

	protected constructor(
		productId: string,
		protected readonly _events: IEvents,
		templateId: string,
		protected readonly _getProduct: (id: string) => IProduct | null
	) {
		super(templateId);
		this._productId = productId;
	}

	/**
	 * Получает актуальные данные товара из модели
	 */
	get product(): IProduct {
		const product = this._getProduct(this._productId);
		if (!product) {
			throw new Error(`Product with id ${this._productId} not found`);
		}
		return product;
	}

	/**
	 * Обновляет отображение компонента
	 */
	update(): void {
		this.renderProductInfo();
	}

	/**
	 * Отрисовывает основную информацию о товаре
	 */
	protected renderProductInfo(): void {
		const currentProduct = this.product;

		// Устанавливаем название товара
		const titleElement = this._element.querySelector(`.${CLASS_NAMES.CARD_TITLE}`);
		if (titleElement) {
			titleElement.textContent = currentProduct.title;
		}

		// Устанавливаем цену товара
		const priceElement = this._element.querySelector(`.${CLASS_NAMES.CARD_PRICE}`);
		if (priceElement) {
			priceElement.textContent = currentProduct.price ? `${currentProduct.price} синапсов` : 'Бесценно';
		}

		// Устанавливаем изображение товара
		const imageElement = this._element.querySelector(`.${CLASS_NAMES.CARD_IMAGE}`) as HTMLImageElement;
		if (imageElement) {
			imageElement.src = currentProduct.image;
			imageElement.alt = currentProduct.title;
		}

		// Устанавливаем категорию товара
		const categoryElement = this._element.querySelector(`.${CLASS_NAMES.CARD_CATEGORY}`);
		if (categoryElement) {
			categoryElement.textContent = currentProduct.category;
			this.setCategoryClass(categoryElement, currentProduct.category);
		}

		// Устанавливаем описание товара, если элемент существует
		const textElement = this._element.querySelector(`.${CLASS_NAMES.CARD_TEXT}`);
		if (textElement) {
			textElement.textContent = currentProduct.description;
		}
	}

	/**
	 * Устанавливает класс категории для элемента
	 */
	protected setCategoryClass(element: Element, category: ProductCategory): void {
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