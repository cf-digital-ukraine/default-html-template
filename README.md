[![Build Status](https://travis-ci.com/cf-digital-ukraine/default-html-template.svg?branch=master)](https://travis-ci.com/cf-digital-ukraine/default-html-template) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/43d32cd89e5e42dabcef8c0ad6aeb5a7)](https://www.codacy.com/app/cf-digital-ukraine/default-html-template?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=cf-digital-ukraine/default-html-template&amp;utm_campaign=Badge_Grade) [![Greenkeeper badge](https://badges.greenkeeper.io/cf-digital-ukraine/default-html-template.svg)](https://greenkeeper.io/) [![devDependency Status](https://david-dm.org/cf-digital-ukraine/default-html-template/dev-status.svg)](https://david-dm.org/cf-digital-ukraine/default-html-template#info=devDependencies) [![Dependency Status](https://david-dm.org/cf-digital-ukraine/default-html-template.svg)](https://david-dm.org/cf-digital-ukraine/default-html-template)
<p align="left">
  <img src="https://cdn.rawgit.com/hjnilsson/country-flags/master/svg/ua.svg" width="25px" height="10px">  
    <a href="./README.ua.md" title="CF.Digital git" style="vertical-align: middle;margin-left: 25px;">README Українською</a>
</p>

# Standard template CF.Digital

- Webpack is an extended package of "laravel-mix" and its configuration differs from the standard one.
- This template works separately from the Laravel itself, and is intended solely for layout.
- Before you begin, you need to configure the configuration:
  - _File paths and directories_  
  - _Clear unnecessary parameters_  
  - _If necessary, update dependencies_  
 
- More information about dependencies is in the file [package](./package.json)  
- By default webpack prodaction (npm run prod command) collects:  
  - _JavaScript is compatible with "ES6 <" - browsers_  
  - _postCss minimizes and groups mediaQueries with logic: (min-width) - to increase, (max-width) - to decrease_  

- By default webpack development (npm run dev / watch) performs a similar function, except:
  - _JavaScript ES6 +, enabled soucemap, does not delete comments and console._  

## INSTALL

Обязательно необходимо установить [Node.js with npm 6+](https://nodejs.org/uk/download/)
### Команды выполнять в терминале - корень package.json
<sup>Для загрузки всех development зависимостей </sup>
```shell
npm install
```
<sup>Для запуска слушателей файлов</sup>
```shell
npm run watch
```
  
Чтобы установить библиотеку, необходимо ее добавить в секцию dependencies файла [Пакет зависимостей](./package.json), после чего запустить `npm install`. Или выполнить команду `npm install *package-name* -S`

## Project tree
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
<sup>Недостающие каталоги необходимо создать ручками</sup>
<pre>root
├── <a href="./resources/public" title="CF.Digital git">public</a>
│   ├── *.html
│   └── <a href="./resources/public/index.html" title="CF.Digital git">index.html</a>
├── <a href="./resources/resources" title="CF.Digital git">resources</a>
│   └── <a href="./resources/fonts" title="CF.Digital git">fonts</a>
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
│   ├── <a href="./resources/image" title="CF.Digital git">image</a>
│   │   ├── folder  
│   │   │   ├── ...  
│   │   │   └── *.jpg|.svg|.png 
│   │   ├── ...  
│   │   └── *.jpg|.svg|.png 
│   ├── <a href="./resources/sass" title="CF.Digital git">sass</a>
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
│   │   └── <a href="./resources/sass/old-ie.sass" title="CF.Digital git">old-ie.sass</a>
│   ├── <a href="./resources/js" title="CF.Digital git">js</a>
│   │   ├── ...custom-modules.js
│   │   ├── <a href="./resources/js/delta-functions.js" title="CF.Digital git">delta-functions.js</a>
│   │   └── <a href="./resources/js/app.js" title="CF.Digital git">app.js</a>
│   └── <a href="./resources/to-remove" title="CF.Digital git">to-remove</a>
│       ├── ...
│       └── ***.ext
├── <a href="./.gitignore" title="CF.Digital git">.gitignore</a>
├── <a href="./package.json" title="CF.Digital git">package.json</a>
├── <a href="./webpack.mix.js" title="CF.Digital git">webpack.mix.js</a>
└── <a href="./mix-manifest.json" title="CF.Digital git">mix-manifest.json</a>
</pre>
