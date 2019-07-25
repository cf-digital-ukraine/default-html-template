export default class AxiosGet {
    
    constructor(props, callback) {
        this.data = Object.assign({
            url: null,
            options: false
            
        }, props);
        this.send(callback)
    }
    
    
    send(callback) {
        if(!this.data.url) throw new Error('Can`t send get request without url');
        let self = this;
        
        if(this.data.options) {
            axios.get(this.data.url, {
                    params: this.data.options
                })
                .then(function (response) {
                    callback(self, response.data);
                })
                .catch(function (error) {
                    callback(self, error.response.data);
                })
                .then(function () {
                    callback(self, false);
                });
        } else {
            axios.get(this.data.url)
                .then(function (response) {
                    callback(self, response.data);
                })
                .catch(function (error) {
                    callback(self, error.response.data);
                })
                .finally(function () {
                    callback(self, false);
                });
        }
        
        
    }
}