import { EventEmitter } from '../components';
import { ApiService } from '../services/ApiService';
import { BasketModel, ProductModel, OrderModel } from '../models';
import { AppEvent, IPresenter, IView, IOrderDTO } from '../types';
import { Basket, Catalog, ContactsForm, ProductPreview, OrderForm, Modal, Success } from '../components';
import { CLASS_NAMES } from '../utils/constants';
import { BasketCounter } from '../components/BasketCounter';

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
    this._catalog = new Catalog(this._eventEmitter);
    this._basket = new Basket(this._eventEmitter);
    this._orderForm = new OrderForm(this._eventEmitter);
    this._contactsForm = new ContactsForm(this._eventEmitter);
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
   * Инициализирует приложение
   */
  async init(): Promise<void> {
    try {
      // Загружаем список товаров в модель
      const products = await this._api.getProducts();
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
    this._eventEmitter.on<{ product: any }>(AppEvent.PRODUCT_SELECT, (data) => {
      const preview = new ProductPreview(data.product, this._eventEmitter);
      
      // Проверяем, есть ли товар в корзине
      const isInBasket = this._basketModel.hasItem(data.product.id);
      preview.updateAddButton(isInBasket);

      // Открываем модальное окно с предпросмотром товара
      this._eventEmitter.emit(AppEvent.MODAL_OPEN, { content: preview.render() });
    });

    // Обработчик открытия корзины
    this._eventEmitter.on(AppEvent.BASKET_OPEN, () => {
      this._eventEmitter.emit(AppEvent.MODAL_OPEN, { content: this._basket.render() });
    });

    // Обработчик добавления товара в корзину
    this._eventEmitter.on<{ product: any }>(AppEvent.BASKET_ADD, (data) => {
      this._basketModel.addItem(data.product);
    });

    // Обработчик удаления товара из корзины
    this._eventEmitter.on<{ productId: string }>(AppEvent.BASKET_REMOVE, (data) => {
      this._basketModel.removeItem(data.productId);
    });

    // Обработчик открытия формы заказа
    this._eventEmitter.on(AppEvent.ORDER_OPEN, () => {
      this._eventEmitter.emit(AppEvent.MODAL_OPEN, { content: this._orderForm.render() });
    });

    // Обработчик завершения первого шага оформления заказа
    this._eventEmitter.on(AppEvent.ORDER_ADDRESS_SET, (data) => {
      // Если выбран способ оплаты и указан адрес, переходим ко второму шагу
      if (this._orderModel.isValid() && this._basketModel.getItemCount() > 0) {
        this._eventEmitter.emit(AppEvent.MODAL_OPEN, { content: this._contactsForm.render() });
      }
    });

    // Обработчик завершения второго шага оформления заказа
    this._eventEmitter.on(AppEvent.ORDER_CONTACTS_SET, async (data) => {
      try {
        // Презентер создает объект заказа, собирая данные из разных моделей
        const orderDTO = this._createOrderDTO();

        if (orderDTO) {
          // Отправляем заказ на сервер
          const response = await this._api.createOrder(orderDTO);

          // Очищаем корзину и заказ после успешного оформления
          this._basketModel.clear();
          this._orderModel.clear();

          // Оповещаем об успешном оформлении заказа
          this._eventEmitter.emit(AppEvent.ORDER_SUCCESS, {
            orderId: response.id,
            total: response.total
          });

          // Открываем модальное окно с сообщением об успешном оформлении заказа
          this._eventEmitter.emit(AppEvent.MODAL_OPEN, { content: this._success.render() });
        }
      } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
      }
    });

		this._eventEmitter.on(AppEvent.ORDER_SUBMIT, () => {
			// Открываем модальное окно с формой контактов
			this._eventEmitter.emit(AppEvent.MODAL_OPEN, { content: this._contactsForm.render() });
		});
  }
}