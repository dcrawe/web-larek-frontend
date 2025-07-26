import { Component } from './Component';
import { ITemplateComponent } from '../../types';
import { ERROR_MESSAGES } from '../../utils/constants';

/**
 * Базовый класс для компонентов с шаблоном
 */
export abstract class TemplateComponent extends Component implements ITemplateComponent {
  readonly template: HTMLTemplateElement;
  readonly container: HTMLElement;

  constructor(templateId: string, containerSelector?: string) {
    super();

    // Получаем шаблон
    const template = document.getElementById(templateId) as HTMLTemplateElement;
    if (!template) {
      throw new Error(ERROR_MESSAGES.TEMPLATE_NOT_FOUND.replace(':template', templateId));
    }
    this.template = template;

    // Клонируем шаблон
    const clone = this.template.content.cloneNode(true) as DocumentFragment;
    const element = clone.firstElementChild as HTMLElement;
    if (!element) {
			throw new Error(ERROR_MESSAGES.TEMPLATE_EMPTY.replace(':template', templateId));
    }
    this._element = element;

    // Устанавливаем контейнер
    if (containerSelector) {
      const container = document.querySelector(containerSelector);
      if (!container) {
				throw new Error(ERROR_MESSAGES.CONTAINER_NOT_FOUND.replace(':template', containerSelector));
      }
      this.container = container as HTMLElement;
    } else {
      this.container = document.body;
    }
  }

  /**
   * Вставляет компонент в контейнер
   */
  appendToContainer(): void {
    this.container.appendChild(this._element);
  }

  /**
   * Вставляет содержимое в компонент
   */
  replaceElement(selector: string, element: HTMLElement): void {
    const target = this._element.querySelector(selector);
    if (target) {
      target.replaceWith(element);
    }
  }

  /**
   * Устанавливает данные для шаблона
   */
  setData(data: Record<string, unknown>): void {
    Object.entries(data).forEach(([key, value]) => {
      const elements = this._element.querySelectorAll(`[data-${key}]`);
      elements.forEach(element => {
        if (element instanceof HTMLElement) {
          element.textContent = String(value);
        }
      });
    });
  }

  /**
   * Скрывает компонент
   */
  hide(): void {
    this._element.style.display = 'none';
  }

  /**
   * Показывает компонент
   */
  show(): void {
    this._element.style.display = '';
  }
}
