import websocket from './websocket'
import getUUID from './getUUID'

export default class cainiao extends websocket {
    //构造函数
    constructor(route) {
        super(route);
        this.printer_list = null;
        this.default_printer = null;
    }

    //获取打印机列表及默认打印机
    //先连接websocket,若连接失败返回错误信息
    //连接成功发送报文并获取返回的打印机列表
    //回调对象有cmd标识表明打印机当前状态
    getPrinters(callback) {
        let vm = this;
        const request = {
            requestID: getUUID(8,16),
            version: '1.0',
            cmd: 'getPrinters'
        };
        this.connect((socket,data) => {
            console.log('get:',data);
            // type == error时表示连接失败,此时数据没有cmd标识
            // 因此手动创建一个cmd标识表明当前状态(其他行为会有统一cmd状态标识)
            if (data.type === 'error') {
                data.cmd = 'error';
                callback(data);
            }else{
                vm.socket.send(JSON.stringify(request));
                vm.getMessage((socket,data) => {
                    console.log('getMessage',JSON.parse(data.data));
                    if (JSON.parse(data.data).cmd === 'getPrinters') {
                        vm.printer_list = JSON.parse(data.data).printers;
                        vm.default_printer = JSON.parse(data.data).defaultPrinter
                    }
                    callback(JSON.parse(data.data));
                });
            }
        });
    }

    getPrinterConfig(targetPrinter) {
        let request = {
            cmd: "getPrinterConfig",
            printer: targetPrinter,
            version: "1.0",
            requestID: getUUID(8,10)
        };
        this.socket.send(JSON.stringify(request));
    }

    /**
     * [setPrinter 设置打印机]
     * @param [targetPrinter] [目标打印机]
     * @param [templateType] [打印机设置项]
     * */
    setPrinter(targetPrinter,templateType) {
        const NORMAL_SIZE = {width: 215,height: 127};
        const COMMON_SIZE = {width: 100,height: 180};

        // let facility_template = JSON.parse(localStorage.getItem('facility_template'));
        // let horizontal = templateType === 'NORMAL' ? parseFloat(facility_template.normal_hor_offset) : parseFloat(facility_template.hor_offset);
        // let vertical = templateType === 'NORMAL' ? parseFloat(facility_template.normal_ver_offset) : parseFloat(facility_template.ver_offset);
        let size = templateType === 'NORMAL' ? NORMAL_SIZE : COMMON_SIZE;
        let request = {
            requestID: getUUID(8,10),
            version: '1.0',
            cmd: 'setPrinterConfig',
            printer: {
                name: targetPrinter, 
                horizontalOffset: 0,
                verticalOffset: 0,
                forceNoPageMargins: true,// v0.2.8.3 新增字段
                paperSize: size
            }
        };

        this.socket.send(JSON.stringify(request));
    }

    /**
     * [printCommit 提交数据到打印机]
     * @param [targetPrinter] [目标打印机]
     * @param [documents] [打印文档]
     * */
    printCommit(targetPrinter,documents) {
        const request = {
            requestID: getUUID(8,16),
            version: '1.0',
            cmd: 'print',
            task: {
                taskID: 'DUO_'+getUUID(8,10),
                preview: false,
                notifyMode: 'allInOne',
                printer: targetPrinter,
                documents: documents
            }
        };
        this.socket.send(JSON.stringify(request));
    }
    
    /**
     * [getAgentInfo 获取客户端版本信息]
     */
    getAgentInfo(callback){
        const request = {
            requestID: getUUID(8,16),
            version: '1.0',
            cmd: 'getAgentInfo',
        };
        this.socket.send(JSON.stringify(request));
        this.getMessage((socket,data) => {
            callback(JSON.parse(data.data));
        });
    }
}
