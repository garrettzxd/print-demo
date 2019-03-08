export default class websocket {
    //构造函数
    constructor(route) {
        this.socket = null;
        this.connect_ok = null;
        this.route = route;
    }

    //连接初始化
    connect(callback) {        
        let vm = this;
        this.socket = new WebSocket(this.route);
        this.socket.onopen = function(event) {
            // vm.connect_ok = false;
            callback(vm.socket,event)
        }

        this.socket.onerror = function(event) {
            console.log("websocket occur an error!");
            vm.connect_ok = false;
            callback(vm.socket,event);
        }
    }

    //消息监听获取
    getMessage(callback) {
        let vm = this;
        this.socket.onmessage = function(event) {
            vm.connect_ok = true;
            callback(vm.socket,event);
        }
    }

    //关闭监听
    close(callback) {
        let vm = this;
        this.socket.onclose = function(event) {
            console.log('websocket has closed!', event);
            vm.connect_ok = false;
            callback(vm.socket,event);
        }
    }

    //错误监听
    // error(callback) {
    //     this.socket.onerror = function(event) {
    //         console.log("websocket occur an error!");
    //         callback(vm.socket,event);
    //     }
    // }
}