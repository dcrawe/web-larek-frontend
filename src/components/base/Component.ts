import { IComponent } from '../../types';

/**
 * Базовый класс для всех компонентов
 */
export abstract class Component implements IComponent {
  protected _element: HTMLElement;

  constructor() {
    this._element = document.createElement('div');
  }

  /**
   * Возвращает корневой элемент компонента
   */
  render(): HTMLElement {
    return this._element;
  }

  /**
   * Удаляет элемент из DOM
   */
  remove(): void {
    this._element.remove();
  }

  /**
   * Устанавливает дочерние элементы
   */
  setChildren(children: HTMLElement[]): void {
    this._element.innerHTML = '';
    children.forEach(child => this._element.appendChild(child));
  }

  /**
   * Устанавливает содержимое элемента
   */
  setContent(content: string): void {
    this._element.innerHTML = content;
  }

  /**
   * Добавляет обработчик события на элемент
   */
  on<K extends keyof HTMLElementEventMap>(
    eventName: K,
    callback: (event: HTMLElementEventMap[K]) => void
  ): void {
    this._element.addEventListener(eventName, callback);
  }

  /**
   * Удаляет обработчик события с элемента
   */
  off<K extends keyof HTMLElementEventMap>(
    eventName: K,
    callback: (event: HTMLElementEventMap[K]) => void
  ): void {
    this._element.removeEventListener(eventName, callback);
  }
}
