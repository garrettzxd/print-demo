<template>
    <div class="hello">
        <box><h3>打印组件测试</h3></box>

        <box>
            <el-form size="small" label-width="120px" label-position="right">
                <el-form-item label="选择打印组件">
                    <el-select v-model="print_assembly" @change="assemblyChange">
                        <el-option label="菜鸟组件" value="cainiao"></el-option>
                        <el-option label="拼多多组件" value="pdd"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="选择打印机">
                    <el-radio-group v-model="current_printer">
                        <el-radio
                            v-for="item in printer_list"
                            :label="item.name"
                            :key="item.name"
                            size="mini">
                            {{item.name}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="可选操作">
                    <el-button @click="connectAssembly" type="primary">链接打印组件</el-button>
                    <el-button @click="getPrinterConfig" type="primary">获取打印机配置</el-button>
                    <el-button @click="setPrinter" type="primary">设置打印机</el-button>
                    <el-button @click="printTest" type="primary">打印测试</el-button>
                </el-form-item>
            </el-form>
        </box>

        <box>
            <h4>结果反馈</h4>
            <el-input v-model="result" type="textarea" :rows="10"></el-input>
        </box>
    </div>
</template>

<script>
    import cainiaoPrint from '../common/cainiaoPrint'
    import box from './box'
    import {CAINIAO_HTTP_URL, CAINIAO_HTTPS_URL, PDD_HTTP_URL} from '../common/constants'
    import {cainiao_data, pdd_data} from '../common/printData'
    export default {
        name: 'HelloWorld',

        components: {box},

        created() {

        },

        computed: {
            printer_list() {
                this.current_printer = this.print_item.default_printer;
                return this.print_item.printer_list;
            }
        },

        mounted() {
            //
        },

        data() {
            return {
                print_assembly: 'cainiao',
                current_printer: '',
                print_item: {},
                result: ''
            }
        },

        methods: {
            //链接打印组件
            connectAssembly() {
                let vm = this,
                    url = vm.print_assembly === 'cainiao' ? CAINIAO_HTTP_URL : PDD_HTTP_URL,
                    name = vm.print_assembly === 'cainiao' ? '菜鸟打印组件' : '拼多多打印组件';
                vm.print_item = new cainiaoPrint(url);
                try {
                    vm.print_item.getPrinters((data) => {
                        vm.result = JSON.stringify(data);

                        if (data.cmd === 'error') {
                            throw new Error('Connect ASSEMBLY fail!')
                        }else {
                            vm.$message.success(`${name}指令发送成功`);
                        };
                    });
                    vm.print_item.close((socket, event) => {
                        console.log('socket has been closed!');
                    });
                }catch (e) {
                    console.log(e);
                }
            },

            //获取打印机配置
            getPrinterConfig() {
                this.print_item.getPrinterConfig(this.current_printer);
            },

            //设置打印机
            setPrinter() {
                this.print_item.setPrinter(this.current_printer, 'NORMAL');
            },

            //打印测试
            printTest() {
                let data = this.print_assembly === 'cainiao' ? cainiao_data : pdd_data;
                this.print_item.printCommit(this.current_printer, data);
            },

            // 打印组件更改
            assemblyChange() {
                this.print_item.printer_list = [];
                this.current_printer = {};
                this.result = '';
            }
        }
    }
</script>
