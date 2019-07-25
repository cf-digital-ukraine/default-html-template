

window.sendStatistics = function(bannerId, isClick) {
    if (typeof isClick === undefined || typeof isClick === 'undefined') {
        isClick = null;
    }
    
    let statisticsUrl = ('https:' == document.location.protocol ? 'https://' : 'http://') + window.location.hostname + '/banners-statistics-request';
    
    try {
        fetch(statisticsUrl + '?id='+ bannerId +'&click=' + isClick, {
            method: 'GET',
            cache: 'no-cache',
            mode: 'no-cors',
            headers:{
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        }).catch(function (e) {
            console.log(e);
        });
    }
    catch (e) {
        console.log(e);
    }
};

import axios from "axios"
global.axios = axios;

window.axios.defaults.headers.common = {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-TOKEN' : document.querySelector('meta[name="csrf-token"]').getAttribute('content')
};

import FormController from "./_system-classes/FormController"
import AxiosGet from "./_system-classes/AxiosGet"



document.addEventListener('DOMContentLoaded', function () {
    
    formControllerInit();
    
});

global.onOpenModal = function(selectors) {
    document.querySelector('html').style.overflow = 'hidden';
    document.querySelector('body').style.overflow = 'hidden';
    document.querySelector('html').style.marginRight = window.scrollBarWidth+'px';
    
    document.querySelectorAll(selectors).forEach((item) => {
        item.style.right = window.scrollBarWidth + "px";
        console.log(getComputedStyle(item).width);
        if(parseFloat(getComputedStyle(item).width) === window.innerWidth) {
            item.style.width = "auto";
        }
    });
};

global.onCloseModal = function(selectors) {
    document.querySelector('html').style.overflow = "";
    document.querySelector('body').style.overflow = "";
    document.querySelector('html').style.marginRight = "";
    
    document.querySelectorAll(selectors).forEach((item) => {
        item.style.right = "";
        if(parseFloat(getComputedStyle(item).width) === window.innerWidth) {
            item.style.width = "";
        }
    });
};

global.formControllerInit = function() {
    
    let formTypeField = ['input', 'textarea', 'select', 'button'];
    
    if(document.querySelector('.label-phone input')) {
        document.querySelectorAll('.label-phone input').forEach(function (item) {
            new IMask(item, {
                mask: 'start (`zero`99) 999-99-99',
                definitions: {
                    '9': /[0-9]/
                },
                blocks: {
                    zero: {
                        mask: IMask.MaskedRange,
                        maxLength: 1,
                        from: 0,
                        to: 0
                    },
                    start: {
                        mask: '{+38 }'
                    }
                }
            });
        });
    }
    
    document.querySelectorAll('form[action]').forEach((form) => {
        form.querySelectorAll('label>*').forEach((item) => {
            if(formTypeField.includes(item.tagName.toLowerCase())) {
                item.addEventListener('input', () => {
                    item.value ? item.classList.add('focus') : item.classList.remove('focus');
                });
            }
        });
    });
    
    new FormController().init('form[action]', function (formObject, data, response) {
    
        console.log('target: formObject - ', formObject);
        console.log('target: data - ', data);
        console.log('target: response - ', response);
        console.log('target: form object - ', this);
        
        if (data.error) {
            self.alertError(data.msg);
        } else if(data.html && !data.html.hasOwnProperty('id')) {
            this.element.classList.add('form-success');
            this.element.style.height = this.element.getBoundingClientRect().height + 'px';
            this.element.innerHTML = data.html.content;
        }
        
    });
};

global.showAjaxForm = function (e, code) {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.add('disabled');
    
    let action = `/get-html`;
    
    new AxiosGet({
        url: action,
        options: {
            module : 'forms',
            code: code
        }
    }, function (self, response) {
        
        if(response) {
            let time = Date.now() + Math.floor(Math.random() * (1000 - 1)) + 1;
            document.querySelector('#ajax-content').insertAdjacentHTML('beforeend', `<div id="system-ajax-${time}" class="fancy-flex-wrap">${response}</div>`);
            let content = document.querySelector('#ajax-content>*:first-child');
    
            window.$.fancybox.open({
                src  : `#system-ajax-${time}`,
                type : 'inline',
                opts : {
                    beforeShow: onOpenModal('.header, .right-bar'),
                    afterShow : function( instance, current ) {
                        e.target.classList.remove('disabled');
                        formControllerInit();
                    },
                    afterClose : function( instance, current ) {
                        onCloseModal('.header, .right-bar');
                        document.querySelector('#ajax-content').removeChild(content);
                    },
                    btnTpl: {
                        smallBtn: `<button type="button" data-fancybox-close class="fancybox-button fancybox-close-small" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.65 17.65"><line x1="0.71" y1="0.71" x2="16.94" y2="16.94" style="fill: none;stroke: #000;stroke-width: 2px"/><path d="M16.94.71.71,16.94" style="fill: none;stroke: #000;stroke-width: 2px"/></svg></button>`
                    },
                }
            });
        }
    });
    return false;
};

global.isDomainLink = function (link) {
    return link.indexOf(location.origin) === 0 || link.startsWith("/");
};

global.getMoreNews = function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.add('disabled');
    
    new AxiosGet({
        url: e.target.getAttribute('href')
    }, function (self, response) {
        if(response) {
            e.target.classList.remove('disabled');
            if(response.pagination.nextPage) {
                e.target.setAttribute('href', response.pagination.nextPage);
            } else {
                e.target.removeAttribute('href');
                e.target.style.visibility = 'hidden';
            }
            if(response.html.content) {
                document.querySelector('.news').insertAdjacentHTML('beforeend', response.html.content);
                animateContent();
            }
            
        }
    });
    return false;
};