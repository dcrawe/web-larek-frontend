import { EventEmitter, BasketCounter } from '../components';
import { ApiService } from '../services/ApiService';
import { BasketModel, ProductModel, OrderModel } from '../models';
import { AppEvent, IPresenter, IView, IOrderDTO, IProduct, IProductDTO } from '../types';
import { Basket, Catalog, ContactsForm, ProductPreview, OrderForm, Modal, Success } from '../components';
import { CLASS_NAMES } from '../utils/constants';
import { toProductCategory } from '../utils/utils';

/**
 * Главный презентер приложения
 */
export class AppPresenter implements IPresenter {
	readonly view: IView;
	private readonly _api: ApiService;
	private readonly _eventEmitter: EventEmitter;
	private readonly _productModel: ProductModel;
	private readonly _basketModel: BasketModel;
	private readonly _orderModel: OrderModel;
	private readonly _modal: Modal;
	private readonly _catalog: Catalog;
	private readonly _basket: Basket;
	private readonly _orderForm: OrderForm;
	private readonly _contactsForm: ContactsForm;
	private readonly _success: Success;
	private _basketButton: HTMLElement;
	private _basketCounter: BasketCounter;

	constructor() {
		// Инициализация брокера событий
		this._eventEmitter = new EventEmitter();

		// Инициализация API сервиса
		this._api = new ApiService();

		// Инициализация моделей
		this._productModel = new ProductModel(this._eventEmitter);
		this._basketModel = new BasketModel(this._eventEmitter);
		this._orderModel = new OrderModel(this._eventEmitter);
		this._basketCounter = new BasketCounter(this._eventEmitter);

		// Инициализация компонентов представления
		this._modal = new Modal(this._eventEmitter);
		this._catalog = new Catalog(
			this._eventEmitter,
			(id: string) => this._productModel.getProduct(id),
			`.${CLASS_NAMES.GALLERY}`
		);
		this._basket = new Basket(this._eventEmitter);
		this._orderForm = new OrderForm(this._eventEmitter, this._orderModel);
		this._contactsForm = new ContactsForm(this._eventEmitter, this._orderModel);
		this._success = new Success(this._eventEmitter);

		// Инициализация представления
		this.view = {
			events: this._eventEmitter
		};

		// Находим кнопку корзины
		this._basketButton = document.querySelector(`.${CLASS_NAMES.HEADER_BASKET}`);

		if (!this._basketButton) {
			throw new Error('Кнопка корзины не найдена');
		}

		// Инициализация обработчиков событий
		this._initEventListeners();
	}

	/**
	 * Преобразует DTO товара в модель товара
	 */
	private _mapProductDTOToProduct(dto: IProductDTO): IProduct {
		return { ...dto, category: toProductCategory(dto.category) };
	}

	/**
	 * Инициализирует приложение
	 */
	async init(): Promise<void> {
		try {
			// Загружаем список товаров в модель
			const productsDTO = await this._api.getProducts();
			const products = productsDTO.map(dto => this._mapProductDTOToProduct(dto));

			this._productModel.setProducts(products);

			// Инициализируем кнопку корзины
			this._basketButton.addEventListener('click', () => {
				this._eventEmitter.emit(AppEvent.BASKET_OPEN);
			});
		} catch (error) {
			console.error('Ошибка при инициализации приложения:', error);
		}
	}

	/**
	 * Создает объект заказа для отправки на сервер
	 */
	private _createOrderDTO(): IOrderDTO | null {
		// Проверяем, что модель заказа валидна
		if (!this._orderModel.isValid()) {
			return null;
		}

		// Проверяем, что в корзине есть товары
		if (this._basketModel.getItemCount() === 0) {
			return null;
		}

		// Собираем данные из разных моделей
		return {
			address: this._orderModel.getAddress(),
			email: this._orderModel.getEmail(),
			phone: this._orderModel.getPhone(),
			payment: this._orderModel.getPaymentMethod()!,
			items: this._basketModel.getItemIds(),
			total: this._basketModel.getTotalPrice()
		};
	}

	/**
	 * Инициализирует обработчики событий
	 */
	private _initEventListeners(): void {
		// Обработчик выбора товара
		this._eventEmitter.on<{ productId: string }>(AppEvent.PRODUCT_SELECT, (data) => {
			const preview = new ProductPreview(
				data.productId,
				this._eventEmitter,
				(id: string) => this._productModel.getProduct(id),
				(productId: string) => this._basketModel.hasItem(productId)
			);

			this._eventEmitter.emit(AppEvent.MODAL_OPEN, { content: preview.render() });
		});

		// Обработчик открытия корзины
		this._eventEmitter.on(AppEvent.BASKET_OPEN, () => {
			this._eventEmitter.emit(AppEvent.MODAL_OPEN, { content: this._basket.render() });
		});

		// Обработчик добавления товара в корзину
		this._eventEmitter.on<{ productId: string }>(AppEvent.BASKET_ADD, (data) => {
			const product = this._productModel.getProduct(data.productId);
			if (product) {
				this._basketModel.addItem(product);
			}
		});

		// Обработчик удаления товара из корзины
		this._eventEmitter.on<{ productId: string }>(AppEvent.BASKET_REMOVE, (data) => {
			this._basketModel.removeItem(data.productId);
		});

		// Обработчик открытия формы заказа
		this._eventEmitter.on(AppEvent.ORDER_OPEN, () => {
			this._eventEmitter.emit(AppEvent.MODAL_OPEN, { content: this._orderForm.render() });
		});

		// Обработчик изменения контактных данных
		this._eventEmitter.on<{ email: string; phone: string }>(AppEvent.ORDER_CONTACTS_SET, (data) => {
			this._orderModel.setContacts(data.email, data.phone);

			if (this._orderModel.isValid()) {
				this._contactsForm.updateValidState(true);
			}
		});

		// Обработчик подтверждения заказа
		this._eventEmitter.on(AppEvent.ORDER_CONFIRM, async () => {
			try {
				if (!this._orderModel.isValid()) {
					return;
				}

				const orderDTO = this._createOrderDTO();

				if (orderDTO) {
					const response = await this._api.createOrder(orderDTO);

					this._basketModel.clear();
					this._orderModel.clear();

					this._eventEmitter.emit(AppEvent.ORDER_CLEAR);
					this._eventEmitter.emit(AppEvent.ORDER_SUCCESS, {
						orderId: response.id,
						total: response.total
					});

					this._eventEmitter.emit(AppEvent.MODAL_OPEN, { content: this._success.render() });
				}
			} catch (error) {
				console.error('Ошибка при оформлении заказа:', error);
			}
		});

		// Обработчик подтверждения заказа с контактной информацией
		this._eventEmitter.on(AppEvent.ORDER_SUBMIT, () => {
			this._eventEmitter.emit(AppEvent.MODAL_OPEN, { content: this._contactsForm.render() });
		});
	}
}