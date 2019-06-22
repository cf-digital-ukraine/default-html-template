# Исходный шаблон для верстки
 - Подробные зависимости можно посмотреть в [Пакет зависимостей](./package.json)
 - По умолчанию webpack prodaction собирает
   - JavaScript совместимый с "ES6<" - браузерами
   - postCss прогоняет вендоры - ```["last 2 versions", "ie >= 11", 'Firefox > 20', 'iOS > 8', 'Safari > 8']```
   - postCss минимизирует и групирует медиа-запросы
 - По умолчанию webpack development делает тоже самое что и прод, за исключением компилирования babel, очистки и минификации кода
   - postCss прогоняет вендоры - ```["last 1 versions"]```

# INSTALL

Обязательно необходимо установить [Node.js with npm 6+](https://nodejs.org/uk/download/)
### Команды выполнять в терминале - корень package.json
`npm install` - Для загрузки всех development зависимостей  
`npm run watch` - Для запуска слушателей файлов  

Чтобы установить библиотеку, необходимо ее добавить в секцию dependencies файла [Пакет зависимостей](./package.json), после чего запустить `npm install`. Или выполнить команду `npm install *package-name* -S`

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
<pre>
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
│   │   ├── <a href="./resources/sass/_default.sass" title="CF.Digital git">_default.sass</a>
│   │   ├── <a href="./resources/sass/_fonts.sass" title="CF.Digital git">_fonts.sass</a>
│   │   ├── <a href="./resources/sass/_functions.sass" title="CF.Digital git">_functions.sass</a>
│   │   ├── <a href="./resources/sass/_normalize.sass" title="CF.Digital git">_normalize.sass</a>
│   │   ├── <a href="./resources/sass/_variables.sass" title="CF.Digital git">_variables.sass</a>
│   │   ├── <a href="./resources/sass/app.sass" title="CF.Digital git">app.sass</a>
│   │   └── old-ie.sass
│   ├── js
│   │   ├── ...custom-modules.js
│   │   ├── <a href="./resources/js/delta-functions.js" title="CF.Digital git">delta-functions.js</a>
│   │   └── <a href="./resources/js/app.js" title="CF.Digital git">app.js</a>
│   └── to-remove
│       ├── ...
│       └── ***.ext
├── <a href="./.gitignore" title="CF.Digital git">.gitignore</a>
├── <a href="./package.json" title="CF.Digital git">package.json</a>
├── <a href="./webpack.mix.js" title="CF.Digital git">webpack.mix.js</a>
└── <a href="./mix-manifest.json" title="CF.Digital git">mix-manifest.json</a>
</pre>
