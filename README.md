# Исходный шаблон для верстки
 - подробные зависимости можно посмотреть в [Пакет зависимостей](./package.json)


# Project tree
.
 * [public](./public)
   * [Пример файла в системе](./public/app.blade.php)
   * [Исходный шаблон HTML](./public/index.html)
 * [resources](./resources)
   * [Точка входа sass](./resources/sass/app.sass)
   * [Точка входа js](./resources/js/app.js)
 * [README.md](./README.md)
 * [Пакет зависимостей](./package.json)
 * [Конфиг Webpack с (laravel mix)](./webpack.mix.js)
---
## Обязательная структура каталогов
```
├── public  
│   ├── *.html  
│   └── index.html  
├── resources  
│   └── fonts  
│   │   └── bold  
│   │   │   ├── font-name.eot  
│   │   │   ├── font-name.svg  
│   │   │   ├── font-name.ttf  
│   │   │   ├── font-name.woff  
│   │   │   └── font-name.woff2  
│   │   ...
│   │   └── medium  
│   │       ├── font-name.eot  
│   │       ├── font-name.svg  
│   │       ├── font-name.ttf  
│   │       ├── font-name.woff  
│   │       └── font-name.woff2  
│   ├── image  
│   │   ├── folder  
│   │   │   ├── ...  
│   │   │   └── *.jpg|.svg|.png 
│   │   ├── ...  
│   │   └── *.jpg|.svg|.png 
│   ├── sass  
│   │   ├── infoblock  
│   │   │   ├── ...
│   │   │   └── *.sass 
│   │   ├── pages  
│   │   │   ├── ...
│   │   │   └── *.sass  
│   │   ├── elements  
│   │   │   ├── ...
│   │   │   └── *.sass 
│   │   ├── _default.sass
│   │   ├── _fonts.sass
│   │   ├── _functions.sass
│   │   ├── _normalize.sass
│   │   ├── _variables.sass
│   │   ├── app.sass
│   │   └── old-ie.sass
│   ├── js
│   │   ├── ...custom-modules.js
│   │   ├── delta-functions.js
│   │   └── app.js
│   └── to-remove
│       ├── ...
│       └── ***.ext
├── .gitignore
├── package.json
├── webpack.mix.js
└── mix-manifest.json
```
