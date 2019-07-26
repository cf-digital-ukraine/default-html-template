export default class FormController {
    constructor(props) {
        this.data = Object.assign({
            forms: [],
            ajaxTrigger: 'data-ajax',
            errorClass: 'error',
            disabledClass: 'disabled'
        }, props);
    }
    
    send(formObject) {
        
        let self = this;
        let method = formObject.element.getAttribute('method').toUpperCase();
        let action = formObject.element.getAttribute('action');
        let formData = new FormData(formObject.element);
        
        formObject.submitBtn.classList.add(this.data.disabledClass);
        
        if (!action) throw new Error(`Can't send form without action link`);
        
        switch (method) {
            case 'GET':
                
                console.log('need work with this');
                break;
            case 'POST':
                axios({method: 'post', url: action, data: formData})
                    .then(function (response) {
                        formObject.submitBtn.classList.remove(self.data.disabledClass);
                        formObject.success(self, response.data, response);
                    })
                    .catch(function (error) {
                        formObject.submitBtn.classList.remove(self.data.disabledClass);
                        formObject.error(self, error.response.data, error);
                    });
                break;
            default:
                throw new Error(`Can't send form without request method`);
        }
        
    }
    
    init(params) {
        document.querySelectorAll(params.forms).forEach((item) => {
            if (!item.hasAttribute(this.data.ajaxTrigger)) {
                let submitButton = item.querySelector('[type="submit"]');
                let requiredFields = item.querySelectorAll('[required]');
                if (!submitButton) throw new Error(`This form ${item.id} not have submit trigger`);
            
                this.data.forms.push({
                    element: item,
                    id: item.id,
                    submitBtn: submitButton,
                    required: requiredFields,
                    success: params.success,
                    error: params.error
                });
                item.setAttribute(this.data.ajaxTrigger, "on");
            }
        });
        this.bindAjaxSubmit();
    }
    bindAjaxSubmit() {
        let self = this;
        this.data.forms.forEach((item) => {
            item.element.addEventListener('submit', function (e) {
                e.stopPropagation();
                e.preventDefault();
                let state = self.checkRequiredField(item);
                
                if (state) {
                    self.send(item);
                }
                return false;
            })
        });
    }
    
    checkRequiredField(formObject) {
        let send = true;
        formObject.required.forEach((item) => {
            if (item.value) {
                this.removeError(item);
            } else {
                this.addError(item);
                send = false;
            }
        });
        return send;
    }
    
    addError(field) {
        field.classList.add(this.data.errorClass);
    }
    
    removeError(field) {
        field.classList.remove(this.data.errorClass);
    }
    
    alertError(msg) {
        let time = Date.now() + Math.floor(Math.random() * (1000 - 1)) + 1;
        document.body.insertAdjacentHTML('afterbegin', `<div onclick="this.parentElement.removeChild(this);" id="system-msg-${time}" class="system-js-error">${msg}</div>`);
    }
    
}