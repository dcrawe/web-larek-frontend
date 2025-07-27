import './scss/styles.scss';
import { AppPresenter } from './presenters/AppPresenter';

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
  const app = new AppPresenter();

  app.init().catch(err => {
    console.error('Ошибка при инициализации приложения:', err);
  });
});
