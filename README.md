# Проектная работа "Веб-ларек"

Проект интернет-магазина с каталогом товаров, корзиной и оформлением заказа.

## Технологии

- HTML
- SCSS
- TypeScript
- Webpack
- MVP архитектура с брокером событий

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```bash
  npm install
```
```bash
  npm run start
```

или

```bash
  yarn
```

```bash
  yarn start
```
## Сборка

```bash
  npm run build
```

или

```bash
  yarn build
```

## Функциональность

- Просмотр каталога товаров
- Детальная информация о товаре
- Добавление/удаление товаров из корзины
- Оформление заказа
- Выбор способа оплаты
- Подтверждение заказа

## Архитектура

Проект построен на основе MVP (Model-View-Presenter) архитектуры с использованием брокера событий для взаимодействия между компонентами.

![uml.jpeg](.readme/uml.jpeg)

## Описание компонентов

### Базовые компоненты

---
#### Component
**Назначение**: Базовый абстрактный класс для всех компонентов приложения.

**Методы**:
- `render(): HTMLElement` - возвращает корневой элемент компонента
- `remove(): void` - удаляет элемент из DOM
- `setChildren(children: HTMLElement[]): void` - устанавливает дочерние элементы
- `setContent(content: string): void` - устанавливает содержимое элемента
- `on<K>(eventName: K, callback): void` - добавляет обработчик события
- `off<K>(eventName: K, callback): void` - удаляет обработчик события
---
#### TemplateComponent
**Назначение**: Базовый класс для создания компонентов на основе HTML-шаблонов.

**Конструктор**:
```typescript
constructor(templateId: string, containerSelector?: string)
```
- `templateId` - ID шаблона в DOM
- `containerSelector` - селектор контейнера (опционально)

**Методы**:
- `appendToContainer(): void` - добавляет элемент в контейнер
- `replaceElement(selector: string, element: HTMLElement): void` - заменяет элемент по селектору
- `setData(data: Record<string, unknown>): void` - устанавливает данные в шаблон
- `hide(): void` - скрывает элемент
- `show(): void` - показывает элемент

### Компоненты представления

---
#### Catalog
**Назначение**: Управление каталогом товаров, отображение списка товаров.

**Конструктор**:
```typescript
constructor(events: IEvents, containerSelector?: string)
```
- `events` - брокер событий
- `containerSelector` - селектор контейнера галереи (по умолчанию `.gallery`)

**Методы**:
- `addCard(card: ProductCard): void` - добавляет карточку в каталог
- `setCards(cards: ProductCard[]): void` - устанавливает набор карточек
- `removeCard(card: ProductCard): void` - удаляет карточку из каталога
- `clear(): void` - очищает каталог
- `_initEventListeners(): void` - инициализирует обработчики событий
---
#### Basket
**Назначение**: Управление корзиной товаров, отображение содержимого корзины.

**Конструктор**:
```typescript
constructor(events: IEvents)
```
- `events` - брокер событий

**Методы**:
- `_updateDisplay(items: IProduct[], total: number, count: number): void` - обновляет отображение корзины
- `_initEventListeners(): void` - инициализирует обработчики событий
---
#### ProductCard
**Назначение**: Отображение карточки товара в каталоге.

**Конструктор**:
```typescript
constructor(product: IProduct, events: IEvents, template?: string)
```
- `product` - данные товара
- `events` - брокер событий
- `template` - ID шаблона (по умолчанию `TEMPLATE_IDS.CARD_CATALOG`)

**Методы**:
- `_render(): void` - отрисовывает карточку товара
- `_initEventListeners(): void` - инициализирует обработчики событий
---
#### ProductPreview
**Назначение**: Отображение детального просмотра товара в модальном окне.

**Конструктор**:
```typescript
constructor(product: IProduct, events: IEvents)
```
- `product` - данные товара
- `events` - брокер событий

**Методы**:
- `updateAddButton(isInBasket: boolean): void` - обновляет состояние кнопки добавления
- `_render(): void` - отрисовывает детальную информацию о товаре
- `_initEventListeners(): void` - инициализирует обработчики событий
---
#### Modal
**Назначение**: Управление модальными окнами.

**Конструктор**:
```typescript
constructor(events: IEvents, modalId?: string)
```
- `events` - брокер событий
- `modalId` - ID модального окна (по умолчанию `MODAL_IDS.MODAL_CONTAINER`)

**Методы**:
- `open(): void` - открывает модальное окно
- `close(): void` - закрывает модальное окно
- `setContent(content: HTMLElement | string): void` - устанавливает содержимое модального окна
- `_initEventListeners(): void` - инициализирует обработчики событий
---
#### OrderForm
**Назначение**: Форма для ввода данных заказа (способ оплаты и адрес).

**Конструктор**:
```typescript
constructor(events: IEvents)
```
- `events` - брокер событий

**Свойства**:
- `paymentMethod: PaymentMethod | null` - выбранный способ оплаты
- `address: string` - адрес доставки
- `isValid: boolean` - статус валидности формы

**Методы**:
- `setPaymentMethod(method: PaymentMethod): void` - устанавливает способ оплаты
- `setAddress(address: string): void` - устанавливает адрес доставки
- `_validateForm(): void` - проверяет валидность формы
- `_initEventListeners(): void` - инициализирует обработчики событий
---
#### ContactsForm
**Назначение**: Форма для ввода контактных данных (email и телефон).

**Конструктор**:
```typescript
constructor(events: IEvents)
```
- `events` - брокер событий

**Свойства**:
- `email: string` - email пользователя
- `phone: string` - телефон пользователя
- `isValid: boolean` - статус валидности формы

**Методы**:
- `setEmail(email: string): void` - устанавливает email
- `setPhone(phone: string): void` - устанавливает телефон
- `_validateForm(): void` - проверяет валидность формы
- `_initEventListeners(): void` - инициализирует обработчики событий
---
#### Success
**Назначение**: Отображение сообщения об успешном оформлении заказа.

**Конструктор**:
```typescript
constructor(events: IEvents)
```
- `events` - брокер событий

**Методы**:
- `_updateOrderInfo(orderId: string, total: number): void` - обновляет информацию о заказе
- `_initEventListeners(): void` - инициализирует обработчики событий

### Модели данных

---
#### BasketModel
**Назначение**: Модель данных корзины, управление состоянием товаров в корзине.

**Конструктор**:
```typescript
constructor(events: IEvents)
```
- `events` - брокер событий

**Методы**:
- `addItem(product: IProduct): void` - добавляет товар в корзину
- `removeItem(id: string): void` - удаляет товар из корзины
- `clear(): void` - очищает корзину
- `getItems(): Map<string, IProduct>` - возвращает товары в корзине
- `getItemsArray(): IProduct[]` - возвращает массив товаров в корзине
- `getItemIds(): string[]` - возвращает ID товаров в корзине
- `getTotalPrice(): number` - вычисляет общую стоимость
- `hasItem(id: string): boolean` - проверяет наличие товара в корзине
- `getItemCount(): number` - возвращает количество товаров в корзине
- `_notifyBasketUpdate(): void` - уведомляет об изменении корзины
- `_initEventListeners(): void` - инициализирует обработчики событий

---
#### ProductModel
**Назначение**: Модель данных товаров, управление каталогом товаров.

**Конструктор**:
```typescript
constructor(events: IEvents)
```
- `events` - брокер событий

**Методы**:
- `mapProduct(dto: IProductDTO): IProduct` - преобразует DTO в модель продукта
- `setProducts(productsDTO: IProductDTO[]): void` - устанавливает список товаров
- `getProducts(): IProduct[]` - возвращает список товаров
- `getProductById(id: string): IProduct | undefined` - возвращает товар по ID

---
#### OrderModel
**Назначение**: Модель данных заказа, управление информацией о заказе.

**Конструктор**:
```typescript
constructor(events: IEvents)
```
- `events` - брокер событий

**Методы**:
- `setAddress(address: string): void` - устанавливает адрес доставки
- `setContacts(email: string, phone: string): void` - устанавливает контактные данные
- `setPaymentMethod(method: PaymentMethod): void` - устанавливает способ оплаты
- `getAddress(): string` - возвращает адрес доставки
- `getEmail(): string` - возвращает email
- `getPhone(): string` - возвращает номер телефона
- `getPaymentMethod(): PaymentMethod | null` - возвращает способ оплаты
- `isValid(): boolean` - проверяет валидность данных заказа
- `clear(): void` - очищает данные заказа
- `_initEventListeners(): void` - инициализирует обработчики событий

### Базовые модели

---
#### Observable
**Назначение**: Базовый класс для наблюдаемых моделей.

**Конструктор**:
```typescript
constructor(events: IEvents)
```
- `events` - брокер событий

**Методы**:
- `_notifyChange(eventName: string, data?: any): void` - уведомляет подписчиков об изменениях

## Сервисы

---
#### EventEmitter
**Назначение**: Брокер событий для организации взаимодействия между компонентами.

**Конструктор**:
```typescript
constructor()
```

**Методы**:
- `on<T>(eventName: EventName, callback: (event: T) => void): void` - подписка на событие
- `off(eventName: EventName, callback: Subscriber): void` - отписка от события
- `emit<T>(eventName: string, data?: T): void` - генерация события
- `onAll(callback: (event: EmitterEvent) => void): void` - подписка на все события
- `offAll(): void` - отписка от всех событий
- `trigger<T>(eventName: string, context?: Partial<T>): Function` - создание триггера события

### Презентер

---
#### AppPresenter
**Назначение**: Главный контроллер приложения, координирует взаимодействие всех компонентов.

**Методы**:
- `init(): Promise<void>` - инициализирует приложение
- `_initEventListeners(): void` - инициализирует обработчики событий

## Используемые типы данных

### Ключевые типы данных

#### IProductBase
```typescript
interface IProductBase {
  id: string;           // Уникальный идентификатор товара
  description: string;  // Описание товара
  image: string;        // URL изображения товара
  title: string;        // Название товара
  price: number;        // Цена товара
}
```

#### IProduct
```typescript
interface IProduct extends IProductBase {
  category: ProductCategory; // Категория товара
}
```

#### IProductDTO
```typescript
interface IProductDTO extends IProductBase {
  category: string;        // Категория товара (строка)
}
```

#### IContactInfo
```typescript
  interface IContactInfo {
  email: string;    // Email покупателя
  phone: string;    // Телефон покупателя
  address: string;  // Адрес доставки
}
```

#### IUser
```typescript
interface IUser extends IContactInfo {
  payment: PaymentMethod;  // Способ оплаты
}
```

#### IOrderDTO
```typescript
interface IOrderDTO {
  payment: PaymentMethod;  // Способ оплаты
  total: number;           // Общая сумма заказа
  items: string[];         // Массив ID товаров
}
```

#### PaymentMethod
```typescript
type PaymentMethod = 'online' | 'cash'; // Способ оплаты: онлайн или наличными
```

#### ProductCategory
```typescript
type ProductCategory = 'софт-скил' | 'хард-скил' | 'другое' | 'дополнительное' | 'кнопка';
```

### Типы компонентов

#### IComponent
```typescript
interface IComponent {
  render(): HTMLElement;  // возвращает HTML-элемент компонента для отображения
}
```
#### ITemplateComponent

```typescript
interface ITemplateComponent extends IComponent {
  readonly template: HTMLTemplateElement;   // ссылка на HTML-шаблон (только для чтения)
  readonly container: HTMLElement;          // контейнер для размещения компонента (только для чтения)
}
```

#### IModal
```typescript
interface IModal extends ITemplateComponent {
  open(): void;                           // открывает модальное окно
  close(): void;                          // закрывает модальное окно
  setContent(content: HTMLElement): void; // устанавливает содержимое модального окна
}
```

#### IProductCard
```typescript
interface IProductCard extends ITemplateComponent {
  readonly product: IProduct; // товар, отображаемый в карточке
}
```

#### IOrderForm
```typescript
interface IOrderForm extends ITemplateComponent {
  readonly paymentMethod: PaymentMethod | null;   // выбранный способ оплаты (может быть null, если не выбран)
  readonly address: string;                       // адрес доставки
  readonly isValid: boolean;                      // валидность формы заказа
  setPaymentMethod(method: PaymentMethod): void;  // устанавливает способ оплаты
  setAddress(address: string): void;              // устанавливает адрес доставки
}
```

#### IContactsForm
```typescript
interface IContactsForm extends ITemplateComponent {
  readonly email: string;         // email пользователя
  readonly phone: string;         // телефон пользователя
  readonly isValid: boolean;      // валидность формы контактов
  setEmail(email: string): void;  // устанавливает email
  setPhone(phone: string): void;  // устанавливает телефон
}
```

### Типы событий

#### AppEvent
```typescript
enum AppEvent {
  // События товаров
  PRODUCTS_LOADED = 'products:loaded',
  PRODUCT_SELECT = 'product:select',
  PRODUCT_PREVIEW = 'product:preview',

  // События карточек
  CARDS_LOADED = 'cards:loaded',
  CARD_ADD = 'card:add',
  CARD_REMOVE = 'card:remove',

  // События корзины
  BASKET_ADD = 'basket:add',
  BASKET_REMOVE = 'basket:remove',
  BASKET_UPDATE = 'basket:update',
  BASKET_CLEAR = 'basket:clear',
  BASKET_OPEN = 'basket:open',

  // События заказа
  ORDER_OPEN = 'order:open',
  ORDER_UPDATE = 'order:update',
  ORDER_PAYMENT_SELECT = 'order:payment:select',
  ORDER_ADDRESS_SET = 'order:address:set',
  ORDER_CONTACTS_SET = 'order:contacts:set',
  ORDER_SUBMIT = 'order:submit',
  ORDER_SUCCESS = 'order:success',

  // События модальных окон
  MODAL_OPEN = 'modal:open',
  MODAL_CLOSE = 'modal:close',

  // События формы
  FORM_ERRORS = 'form:errors',
  FORM_VALID = 'form:valid',
}
```

### Интерфейсы событий

```typescript
// Событие загрузки товаров
interface IProductsLoadedEvent {
  products: IProduct[];
}

// Событие загрузки карточек
interface ICardsLoadedEvent {
  cards: ProductCard[];
}

// Событие добавления карточки
interface ICardAddEvent {
  card: ProductCard;
}

// Событие удаления карточки
interface ICardRemoveEvent {
  card: ProductCard;
}

// Событие выбора товара
interface IProductSelectEvent {
  product: IProduct;
}

// Событие добавления в корзину
interface IBasketAddEvent {
  product: IProduct;
}

// Событие удаления из корзины
interface IBasketRemoveEvent {
  productId: string;
}

// Событие обновления корзины
interface IBasketUpdateEvent {
  items: IProduct[];
  total: number;
}

// Событие выбора способа оплаты
interface IOrderPaymentSelectEvent {
  method: PaymentMethod;
}

// Событие установки адреса доставки
interface IOrderAddressSetEvent {
  address: string;
}

// Событие установки контактных данных
interface IOrderContactsSetEvent {
  email: string;
  phone: string;
}

// Событие отправки заказа
interface IOrderSubmitEvent {
  order: IOrderDTO;
}

// Событие успешного оформления заказа
interface IOrderSuccessEvent {
  orderId: string;
  total: number;
}

// Событие открытия модального окна
interface IModalOpenEvent {
  content: HTMLElement;
}

// Событие ошибок формы
interface IFormErrorsEvent {
  errors: string[];
}
```

#### EventEmitter типы
```typescript
type EventName = string | RegExp;    // Имя события
type Subscriber = Function;          // Подписчик на событие
type EmitterEvent = {                // Событие эмиттера
  eventName: string;
  data: unknown;
};
```

#### IEvents интерфейс
```typescript
interface IEvents {
  on<T extends object>(event: EventName, callback: (data: T) => void): void;
  emit<T extends object>(event: string, data?: T): void;
  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```