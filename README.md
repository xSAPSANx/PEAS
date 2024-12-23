# PEAS - Сервис распределения сотрудников по проектам


## Основные функции
- Управление проектами<br>
Создание, редактирование и удаление проектов  с возможностью указания максимального количества сотрудников.
- Распределение сотрудников<br>
Добавление сотрудников в проекты с учетом лимитов и требований каждого проекта.
- Иерархическая структура<br>
Поддержка древовидной структуры проектов и подразделений с неограниченной вложенностью.
- Отображение информации<br>
Визуализация проектов и сотрудников с помощью удобного интерфейса.
- Одностраничное приложение<br>
Быстрый и отзывчивый интерфейс без перезагрузки страниц.

## Технологии

- React: Библиотека.
- React Router: Маршрутизация (SPA).
- Redux Toolkit: Управление состоянием приложения.
- SCSS: Препроцессор для стилизации компонентов.
- Axios: HTTP-клиент для взаимодействия с сервером.
- AgGrid: Компонент таблицы для отображения и управления данными сотрудников.
- Material UI: Набор компонентов интерфейса.
- FSD архитектура.

## Установка и запуск

Клонируйте репозиторий:
```bash
git clone https://github.com/xSAPSANx/PEAS.git
```

Перейдите в директорию проекта:
```bash
cd peas
```

Установите зависимости:
```bash
npm install
```

В первом терминале запустите сервер разработки:
```bash
npm run dev
```

Во втором терминале запустите сервер API:
```bash
npm run server
```

## Откройте приложение в браузере:

Перейдите по адресу http://localhost:5173/
