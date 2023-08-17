let show_mode = 0;
const idValueMap = {};

// 定义结构体对象模板
function Parameter(xu_hao, id, can_shu_hao, parameter_name, value, unit, editable, minvalue, maxvalue, explain) {
    this.xu_hao = xu_hao;
    this.id = id;
    this.can_shu_hao = can_shu_hao;
    this.parameter_name = parameter_name;
    this.value = value;
    this.unit = unit;
    this.editable = editable;
    this.minvalue = minvalue;
    this.maxvalue = maxvalue;
    this.explain = explain;
}

var data1 = [
    new Parameter(1, 1, "CA-1", "角度设定", "0", " ", false, 0, 72648, "角度设定角度设定角度设定角度设定"),
    new Parameter(2, 2, "CA-5", "电池电压", "0", "V", false),
    new Parameter(3, 3, "CA-2", "角度反馈", "0", " ", false),
    new Parameter(4, 4, "CA-3", "按键键码", "0", " ", false),
    new Parameter(5, 5, "CA-9", "误差", "0", " ", false),
    new Parameter(6, 6, "CA-4", "当前模式", "0", " ", false),
    new Parameter(7, 7, "CA-10", "输出开度", "0", " ", false),
    new Parameter(11, 11, "CA-12", "角度环比例系数", "0", " ", true),
    new Parameter(13, 13, "CA-13", "角度环积分常数", "0", " ", true),
    new Parameter(15, 15, "CA-18", "角度环微分常数", "0", " ", true),
    new Parameter(17, 17, "CA-19", "最大开度限制", "0", " ", true),
    new Parameter(19, 19, "CA-20", "最大速度限制", "0", " ", true),
    new Parameter(21, 21, "CA-21", "最低速度限制", "0", " ", true),
    new Parameter(23, 23, "CA-22", "独立转向速度", "0", " ", true),
    new Parameter(25, 25, "PB-02", "扫线反转速度", "0", " ", true),
    new Parameter(27, 27, "PB-03", "减速梯度", "0", "ms", true),
    new Parameter(29, 29, "PB-04", "加速时间", "0", "ms", true),
    new Parameter(24, 24, "ADJ-55", "AI1零偏", "0", " ", true),
    new Parameter(26, 26, "ADJ-56", "AI1增益", "0", " ", true),
    new Parameter(28, 28, "ADJ-57", "AI2零偏", "0", " ", true),
    new Parameter(30, 30, "ADJ-58", "AI2增益", "0", " ", true),
]

layui.use('table', function () {
    var table = layui.table;

    // 已知数据渲染
    var inst = table.render({
        elem: '#user_info1',
        // page: true,
        cols: [function () {
            var arr = [ //标题栏
                { field: 'xu_hao', title: '序号', width: 73, sort: true, hide: true },
                // { field: 'xu_hao', title: '序号', width: 73, sort: true },
                { field: 'id', title: 'ID号', width: 80, hide: true, sort: true },
                // { field: 'id', title: 'ID号', width: 60 },
                { field: 'can_shu_hao', title: '参数号', width: 78 },
                { field: 'parameter_name', title: '参数名称', minWidth: 100, maxWidth: 300 },
                {
                    field: 'value', title: '数值', width: 100, edit: function (d) {
                        // d 即为当前行数据，此时可根据行相关字段来开启该行是否编辑的权限
                        if (d.editable) { // editable 为任意字段名
                            return 'text'; // 编辑模式
                        }
                    },
                },
                { field: 'unit', title: '单位', width: 50 },
                { field: 'minvalue', title: '最小值', width: 75, hide: true  },
                { field: 'maxvalue', title: '最大值', width: 75, hide: true  },
                { field: 'explain', title: '参数说明', minWidth: 100}
            ]
            // 初始化筛选状态
            var local = layui.data('table-filter-test'); // 获取对应的本地记录
            layui.each(arr, function (index, item) {
                if (item.field in local) {
                    item.hide = local[item.field];
                }
            });
            return arr;
        }()],
        done: function () {
            // 记录筛选状态
            var that = this;
            that.elem.next().on('mousedown', 'input[lay-filter="LAY_TABLE_TOOL_COLS"]+', function () {
                var input = $(this).prev()[0];
                // 此处表名可任意定义
                layui.data('table-filter-test', {
                    key: input.name
                    , value: input.checked
                })
            });
        },



        css: [// 对开启了编辑的单元格追加样式
            '.layui-table-view td[data-edit]{background: skyblue;}'
        ].join(''),
        toolbar: true,//表头工具栏
        toolbar: '<div>用户参数1</div>',//表头工具栏
        // 创建实例化对象填充数据
        data: data1,
        //skin: 'nob', // 表格风格可选值：grid|line|row|nob
        even: true,//隔行深色
    });

    // 行单击事件( 双击事件为: rowDouble )
    table.on('rowDouble(user_info1)', function (obj) {
        var data = obj.data; // 获取当前行数据
        // layer.msg("查询 arr[" + data.id + "]");
        parent.read_with_id(data.id)
        obj.setRowChecked({
            type: 'radio' // radio 单选模式；checkbox 复选模式
        });
    });


    // 单元格编辑事件
    table.on('edit(user_info1)', function (obj) {
        var field = obj.field; // 得到修改的字段
        var value = obj.value // 得到修改后的值
        var oldValue = obj.oldValue // 得到修改前的值 -- v2.8.0 新增
        var data = obj.data // 得到所在行所有键值
        var col = obj.getCol(); // 得到当前列的表头配置属性 -- v2.8.0 新增
        // console.log(obj.data.id); // 查看对象所有成员

        // 值的校验
        if (value.replace(/\s/g, '') === '') {
            layer.tips('值不能为空', this, { tips: 1 });
            return obj.reedit(); // 重新编辑 -- v2.8.0 新增
        }
        // 编辑后续操作，如提交更新请求，以完成真实的数据更新
        // …
        // layer.msg("修改arr[" + obj.data.id + "] = " + obj.value);
        parent.write_with_id_val(obj.data.id, obj.value)
        // 更新当前缓存数据
        var update = {};
        update[field] = value;
        obj.update(update, true); // 参数 true 为 v2.7 新增功能，即同步更新其他包含自定义模板并可能存在关联的列视图
    });
});

// ////////////////////// 导出数据为 JSON 文件/////////////////////////////////////
// function exportDataToFile(filename) {
//     var json = JSON.stringify(data1);
//     var blob = new Blob([json], { type: "application/json" });
//     var url = URL.createObjectURL(blob);

//     var a = document.createElement("a");
//     a.href = url;
//     a.download = filename;
//     a.click();

//     URL.revokeObjectURL(url);
// }
// /////////////////////////////////////////////////////////////////////////////

// ///////////////////////// 导入数据从 JSON 文件////////////////////////////////
// function importDataFromFile(file) {
//     var reader = new FileReader();
//     reader.onload = function (event) {
//         var json = event.target.result;
//         var importedData = JSON.parse(json);
//         console.log(importedData);
//         data1 = importedData; // 更新全局变量的值
//     };
//     reader.readAsText(file);
// }

// // 模拟用户选择文件并调用导入函数
// var inputFile = document.createElement("input");
// inputFile.type = "file";
// inputFile.accept = ".json";
// inputFile.addEventListener("change", function (event) {
//     var file = event.target.files[0];
//     importDataFromFile(file);
// });
// document.body.appendChild(inputFile);
// ///////////////////////////////////////////////////////////////////////////////


function updateValue(pa_id, pa_value) {
    var tableInstance = layui.table;
    var tableDataCache = tableInstance.cache['user_info1'];

    if (tableDataCache) {
        var dataIndex = tableDataCache.findIndex(function (row) {
            // console.log(row.id);  //打印所有的id
            return row.id === pa_id;
        });

        if (dataIndex !== -1) {
            tableDataCache[dataIndex].value = pa_value;
            tableInstance.reloadData('user_info1', {
                data: tableDataCache,
                scrollPos: 'fixed',  // 保持滚动条位置不变 
            });
        }
    }
    // // 获取当前页接口数据
    // var data = tableInstance.getData('user_info1');
    // console.log(data);
}

