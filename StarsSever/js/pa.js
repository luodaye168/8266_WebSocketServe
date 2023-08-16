let show_mode = 1;
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
    new Parameter(1, 3, "CA-1", "告警代码", "0000", " ", false),
    new Parameter(2, 7, "CA-5", "速度设定", "0000", "RPM", false),
    new Parameter(3, 4, "CA-2", "系统状态", "0000", " ", false),
    new Parameter(4, 1, "CA-3", "速度反馈", "0000", "RPM", true),
    new Parameter(196, 182, "ADJ-55", "AI1零偏", "0000", " ", true),
]

layui.use('table', function () {
    var table = layui.table;

    // 已知数据渲染
    var inst = table.render({
        elem: '#ID-table-demo-data',
        cols: [[ //标题栏
            { field: 'xu_hao', title: '序号', width: 73, sort: true, hide: true },
            { field: 'id', title: 'ID号', width: 60, hide: true },
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