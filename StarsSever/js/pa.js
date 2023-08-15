let show_mode = 1;
const idValueMap = {};

layui.use('table', function () {
    var table = layui.table;

    // 已知数据渲染
    var inst = table.render({
        elem: '#ID-table-demo-data',
        cols: [[ //标题栏
            { field: 'xu_hao', title: '序号', width: 73, sort: true, hide: true },
            { field: 'id', title: 'ID号', width: 60 , hide: true },
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
        data: [
            { // 赋值已知数据
                "xu_hao": 1,
                "id": 3,
                "can_shu_hao": "CA-1",
                "parameter_name": "告警代码",
                "value": "0000",
                "unit": " ",
                "editable": false
            },
            {
                "xu_hao": 2,
                "id": 7,
                "can_shu_hao": "CA-5",
                "parameter_name": "速度设定",
                "value": "0000",
                "unit": "RPM",
                "editable": false
            },
            {
                "xu_hao": 3,
                "id": 4,
                "can_shu_hao": "CA-2",
                "parameter_name": "系统状态",
                "value": "0000",
                "unit": " ",
                "editable": false
            },
            {
                "xu_hao": 4,
                "id": 1,
                "can_shu_hao": "CA-3",
                "parameter_name": "速度反馈",
                "value": "0000",
                "unit": "RPM",
                "editable": true
            },
            {
                "xu_hao": 196,
                "id": 182,
                "can_shu_hao": "ADJ-55",
                "parameter_name": "AI1零偏",
                "value": "0",
                "unit": "",
                "editable": true
            }
        ],
        //skin: 'nob', // 表格风格可选值：grid|line|row|nob
        even: true,
    });
    //切换显示模式
    $('#show_mode').click(function () {
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

    // function updateValue(pa_id, pa_value) {
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