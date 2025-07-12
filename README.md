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
- `addProduct(product: IProduct): void` - добавляет товар в каталог
- `setProducts(products: IProduct[]): void` - устанавливает список товаров
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
- `addItem(item: IBasketItem): void` - добавляет товар в корзину
- `removeItem(id: string): void` - удаляет товар из корзины
- `clear(): void` - очищает корзину
- `setItems(items: Map<string, IBasketItem>): void` - устанавливает товары в корзине
- `_updateBasket(): void` - обновляет отображение корзины
- `_initEventListeners(): void` - инициализирует обработчики событий
---
#### ProductCard
**Назначение**: Отображение карточки товара в каталоге.

**Конструктор**:
```typescript
constructor(product: IProduct, events: IEvents)
```
- `product` - данные товара
- `events` - брокер событий

**Методы**:
- `updateDisplay(): void` - обновляет отображение карточки
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
- `_initEventListeners(): void` - инициализирует обработчики событий
---
#### Modal
**Назначение**: Управление модальными окнами.

**Конструктор**:
```typescript
constructor(events: IEvents)
```
- `events` - брокер событий

**Методы**:
- `open(): void` - открывает модальное окно
- `close(): void` - закрывает модальное окно
- `setContent(content: HTMLElement): void` - устанавливает содержимое модального окна
- `_initEventListeners(): void` - инициализирует обработчики событий
---
#### OrderForm
**Назначение**: Форма для ввода данных заказа (способ оплаты и адрес).

**Конструктор**:
```typescript
constructor(events: IEvents)
```
- `events` - брокер событий

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
- `setOrderInfo(orderId: string, total: number): void` - устанавливает информацию о заказе
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
- `addItem(product: IProduct, quantity?: number): void` - добавляет товар в корзину
- `removeItem(id: string): void` - удаляет товар из корзины
- `clear(): void` - очищает корзину
- `getItems(): Map<string, IBasketItem>` - возвращает товары в корзине
- `getItemIds(): string[]` - возвращает ID товаров в корзине
- `getTotalPrice(): number` - вычисляет общую стоимость
- `hasItem(id: string): boolean` - проверяет наличие товара в корзине
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
- `setProducts(products: IProduct[]): void` - устанавливает список товаров
- `getProducts(): IProduct[]` - возвращает список товаров
- `getProductById(id: string): IProduct` - возвращает товар по ID
- `addProduct(product: IProduct): void` - добавляет товар в каталог
- `_notifyProductsUpdate(): void` - уведомляет об обновлении товаров

---
#### OrderModel
**Назначение**: Модель данных заказа, управление информацией о заказе.

**Конструктор**:
```typescript
constructor(events: IEvents, basketModel: BasketModel)
```
- `events` - брокер событий
- `basketModel` - модель корзины

**Методы**:
- `setPaymentMethod(method: PaymentMethod): void` - устанавливает способ оплаты
- `setAddress(address: string): void` - устанавливает адрес доставки
- `setContacts(email: string, phone: string): void` - устанавливает контактные данные
- `createOrder(): IOrderDTO` - создает объект заказа
- `isReadyToSubmit(): boolean` - проверяет готовность к отправке
- `clear(): void` - очищает данные заказа

## Сервисы

---
#### ApiService
**Назначение**: Сервис для взаимодействия с API сервера.

**Конструктор**:
```typescript
constructor(baseUrl?: string)
```
- `baseUrl` - базовый URL API (опционально)

**Методы**:
- `getProducts(): Promise<IProductDTO[]>` - получает список товаров
- `getProductById(id: string): Promise<IProductDTO>` - получает товар по ID
- `createOrder(order: IOrderDTO): Promise<IOrderResponseDTO>` - создает заказ
- `_get<T>(url: string): Promise<T>` - выполняет GET запрос
- `_post<T, R>(url: string, data: T): Promise<R>` - выполняет POST запрос

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

#### IProduct
```typescript
interface IProduct {
  id: string;              // Уникальный идентификатор товара
  description: string;     // Описание товара
  image: string;           // URL изображения товара
  title: string;           // Название товара
  category: ProductCategory; // Категория товара
  price: number;           // Цена товара
}
```

#### IBasketItem
```typescript
interface IBasketItem {
  product: IProduct;       // Товар в корзине
  quantity: number;        // Количество товара
}
```

#### IOrderDTO
```typescript
interface IOrderDTO {
  payment: PaymentMethod;  // Способ оплаты
  email: string;           // Email покупателя
  phone: string;           // Телефон покупателя
  address: string;         // Адрес доставки
  total: number;           // Общая сумма заказа
  items: string[];         // Массив ID товаров
}
```

#### PaymentMethod
```typescript
type PaymentMethod = 'card' | 'cash'; // Способ оплаты: карта или наличные
```

#### ProductCategory
```typescript
type ProductCategory = 'софт-скил' | 'хард-скил' | 'другое' | 'дополнительное' | 'кнопка';
```

### Тип с событиями и типы событий

#### AppEvent
```typescript
enum AppEvent {
  // События товаров
  PRODUCTS_LOADED = 'products:loaded',
  PRODUCT_SELECT = 'product:select',
  
  // События корзины
  BASKET_ADD = 'basket:add',
  BASKET_REMOVE = 'basket:remove',
  BASKET_UPDATE = 'basket:update',
  BASKET_OPEN = 'basket:open',
  BASKET_CLEAR = 'basket:clear',
  
  // События заказа
  ORDER_OPEN = 'order:open',
  ORDER_CONTACTS_SET = 'order:contacts:set',
  ORDER_SUCCESS = 'order:success',
  
  // События модального окна
  MODAL_OPEN = 'modal:open',
  MODAL_CLOSE = 'modal:close',
  
  // События форм
  FORM_VALID = 'form:valid',
  FORM_ERRORS = 'form:errors'
}
```

#### Типы данных событий
```typescript
// Данные для события загрузки товаров
interface ProductsLoadedEvent {
	products: IProduct[];
}

// Данные для события добавления в корзину
interface BasketAddEvent {
	product: IProduct;
}

// Данные для события удаления из корзины
interface BasketRemoveEvent {
	productId: string;
}

// Данные для события обновления корзины
interface BasketUpdateEvent {
	items: IBasketItem[];
	total: number;
}

// Данные для события установки контактов
interface OrderContactsSetEvent {
	email: string;
	phone: string;
}

// Данные для события ошибок формы
interface FormErrorsEvent {
	errors: string[];
}
```

#### EventEmitter типы
```typescript
type EventName = string | RegExp;    // Имя события
type Subscriber = Function;          // Подписчик на событие
type EmitterEvent = {               // Событие эмиттера
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