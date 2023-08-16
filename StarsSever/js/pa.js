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
    new Parameter(1, 1, "CA-1", "角度设定", "0", " ", false),
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
        elem: '#ID-table-demo-data',
        cols: [[ //标题栏
            // { field: 'xu_hao', title: '序号', width: 73, sort: true, hide: true },
            { field: 'xu_hao', title: '序号', width: 73, sort: true},
            // { field: 'id', title: 'ID号', width: 60, hide: true },
            { field: 'id', title: 'ID号', width: 60},
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
            { field: 'unit', title: '单位', width: 80 }
        ]],
        css: [// 对开启了编辑的单元格追加样式
            '.layui-table-view td[data-edit]{background: skyblue;}'
        ].join(''),
        // 创建实例化对象填充数据
        data: data1,
        //skin: 'nob', // 表格风格可选值：grid|line|row|nob
        even: true,
    });
    //切换显示模式
    $('#show_mode').click(function () {
        // 调用导出函数
        // exportDataToFile("parameter_data.json");
        show_mode++;
        // 同时设置多列的显示或隐藏
        table.hideCol('ID-table-demo-data', [{
            field: 'xu_hao',
            hide: show_mode % 2 ? true : false
        }, {
            field: 'id',
            hide: show_mode % 2 ? true : false
        }
        ]);
        updateValue(1, show_mode);
    })

    // function updateValue(pa_id, pa_value) {  //放在里面父页面访问不到
    //     // 获取表格实例
    //     var tableInstance = layui.table;
    //     // 获取表格的数据
    //     var tableData = tableInstance.cache['ID-table-demo-data'];
    //     // 找到要更新的数据在表格数据中的索引
    //     var dataIndex = tableData.findIndex(function (row) {
    //         return row.id === pa_id;
    //     });

    //     if (dataIndex !== -1) {
    //         // 更新表格数据的 value
    //         tableData[dataIndex].value = pa_value;
    //         // 使用 table.reload 进行数据重载
    //         tableInstance.reload('ID-table-demo-data', {
    //             data: tableData // 更新后的数据
    //         });
    //     }
    // }
});

////////////////////// 导出数据为 JSON 文件/////////////////////////////////////
function exportDataToFile(filename) {
    var json = JSON.stringify(data1);
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
}
/////////////////////////////////////////////////////////////////////////////

///////////////////////// 导入数据从 JSON 文件////////////////////////////////
function importDataFromFile(file) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var json = event.target.result;
        var importedData = JSON.parse(json);
        console.log(importedData);
        data1 = importedData; // 更新全局变量的值
    };
    reader.readAsText(file);
}

// 模拟用户选择文件并调用导入函数
var inputFile = document.createElement("input");
inputFile.type = "file";
inputFile.accept = ".json";
inputFile.addEventListener("change", function (event) {
    var file = event.target.files[0];
    importDataFromFile(file);
});
document.body.appendChild(inputFile);
///////////////////////////////////////////////////////////////////////////////


function updateValue(pa_id, pa_value) {
    var tableInstance = layui.table;
    var tableDataCache = tableInstance.cache['ID-table-demo-data'];

    if (tableDataCache) {
        var dataIndex = tableDataCache.findIndex(function (row) {
            // console.log(row.id);  //打印所有的id
            return row.id === pa_id;
        });

        if (dataIndex !== -1) {
            tableDataCache[dataIndex].value = pa_value;
            tableInstance.reload('ID-table-demo-data', {
                data: tableDataCache
            });
        }
    }
}