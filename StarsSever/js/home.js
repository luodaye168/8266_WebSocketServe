//               
var hex_arr = ['94 00', //-100
    //-99       -8       -7       -6       -5       -4       -3       -2       -1      -90
    '95 14', '96 29', '97 3D', '98 52', '99 66', '9A 7B', '9B 8F', '9C A4', '9D B8', '9E CD',  //-90
    '9F E1', 'A0 F6', 'A2 0A', 'A3 1F', 'A4 33', 'A5 48', 'A6 5C', 'A7 71', 'A8 85', 'A9 9A',  //-80
    'AA AE', 'AB C3', 'AC D7', 'AD EC', 'AF 00', 'B0 14', 'B1 29', 'B2 3D', 'B3 52', 'B4 66',  //-70
    'B5 7B', 'B6 8F', 'B7 A4', 'B8 B8', 'B9 CD', 'BA E1', 'BB F6', 'BD DA', 'BE 1F', 'BF 33',  //-60
    'C0 48', 'C1 5C', 'C2 71', 'C3 85', 'C4 9A', 'C5 AE', 'C6 C3', 'C7 D7', 'C8 EC', 'CA 00',  //-50
    'CB 14', 'CC 29', 'CD 3D', 'CE 52', 'CF 66', 'D0 7B', 'D1 8F', 'D2 A4', 'D3 B8', 'D4 CD',  //-40
    'D5 E1', 'D6 F6', 'D8 0A', 'D9 1F', 'DA 33', 'DB 48', 'DC 5C', 'DD 71', 'DE 85', 'DF 9A',  //-30
    'E0 AE', 'E1 C3', 'E2 D7', 'E3 EC', 'E5 00', 'E6 14', 'E7 29', 'E8 3D', 'E9 52', 'EA 66',  //-20
    'EB 7B', 'EC 8F', 'ED A4', 'EE 88', 'EF CD', 'F0 E1', 'F1 F6', 'F3 0A', 'F4 1F', 'F5 33',  //-10
    'F6 48', 'F7 5C', 'F8 71', 'F9 85', 'FA 9A', 'FB AE', 'FC C3', 'FD D7', 'FE EC', '00 00',  //0
    // 1        2        3        4        5        6        7        8        9       10    
    '01 14', '02 29', '03 3D', '04 52', '05 66', '06 7b', '07 8F', '08 A4', '09 B8', '0A CD',  //10
    '0B E1', '0C F6', '0E 0A', '0F 1F', '10 33', '11 48', '12 5C', '13 71', '14 85', '15 9A',  //20
    '16 AE', '17 C3', '18 D7', '19 EC', '1B 00', '1C 14', '1D 29', '1E 3D', '1F 52', '20 66',  //30
    '21 7B', '22 8F', '23 A4', '24 B8', '25 CD', '26 E1', '27 F6', '29 0A', '2A 1F', '2B 33',  //40
    '2C 48', '2D 5C', '2E 71', '2F 85', '30 9A', '31 AE', '32 C3', '33 D7', '34 EC', '36 00',  //50
    '37 14', '38 29', '39 3D', '3A 52', '3B 66', '3C 7B', '3D 8F', '3E A4', '3F B8', '40 CD',  //60
    '41 E1', '42 F6', '44 0A', '45 1F', '46 33', '47 48', '48 5C', '49 71', '4A 85', '4B 9A',  //70
    '4C AE', '4D C3', '4E D7', '4F EC', '51 00', '52 14', '53 29', '54 3D', '55 52', '56 66',  //80
    '57 7B', '58 8F', '59 A4', '5A B8', '5B CD', '5C E1', '5D F6', '5F 0A', '60 1F', '61 33',  //90
    '62 48', '63 5C', '64 71', '65 85', '66 9A', '67 AE', '68 C3', '69 D7', '6A EC', '6C 00',  //100
]

/***********************************************************************************************************
*
*                          从localStorage读取变量并还原滑块和设定转速的值
*
***********************************************************************************************************/
document.addEventListener("DOMContentLoaded", () => {
    // 从localStorage中读取enableDevice变量
    var enableDevice = localStorage.getItem("enableDevice");
    if (enableDevice === null) {
        localStorage.setItem('enableDevice', false);
    }
    if (enableDevice === "true") {
        enableDevice_style();
    } else {
        disableDevice_style();
    }

    // 从localStorage中读取huakuai_value变量
    var huakuai_value = localStorage.getItem("huakuai_value");
    if (huakuai_value === null) {
        localStorage.setItem('huakuai_value', 0);
    }
    else {
        updata_main_set_zs(parseInt(huakuai_value) * 30);
    }
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////

/***********************************************************************************************************
*
*                                               各仪表盘更新指针函数
*
***********************************************************************************************************/
// //更新大仪表盘中的电流
// function updata_dlfk(dlfk_val) {
//     option.series[0].data[0].name = '电流反馈'
//     option.series[0].min = -150
//     option.series[0].max = 150
//     // 更新图表的配置并实时更新仪表盘的值
//     option.series[0].data[0].value = dlfk_val;
//     Chart_dlfk.setOption(option);
//     updata_main_dl(dlfk_val);
// }

// //更新大仪表盘中的转速
// function updata_zs(zs_val) {
//     option.series[0].data[0].name = '转速'
//     option.series[0].min = -3000
//     option.series[0].max = 3000
//     // 更新图表的配置并实时更新仪表盘的值
//     option.series[0].data[0].value = zs_val * 30;
//     Chart_zs.setOption(option);
// }

//更新小仪表盘中的设定转速
function updata_main_set_zs(main_set_zs_val) {
    // 修改第一个仪表盘的设定转速值
    main_option.series[0].data[0].value = main_set_zs_val;
    // 更新图表配置并重新渲染图表
    mainChart.setOption(main_option);
}

//更新小仪表盘中的转速
function updata_main_zs(main_zs_val) {
    main_option.series[0].data[1].value = main_zs_val;
    mainChart.setOption(main_option);
}

//更新小仪表盘中的电流
function updata_main_dl(main_dl_val) {
    main_dl_option.series[0].data[0].value = main_dl_val;
    Chart_main_dl.setOption(main_dl_option);
}

//更新小仪表盘中的电压
function update_main_dy(value) {
    var spanElement = document.getElementById('span_dy_val');
    if (spanElement) {
        spanElement.textContent = value + 'v';
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////


/***********************************************************************************************************
*
*                                            配置大仪表盘
*
***********************************************************************************************************/
/*// 创建一个 ECharts 实例
var chartDom_dlfk = document.getElementById('dlfk'); // 获取图表容器元素
var Chart_dlfk = echarts.init(chartDom_dlfk); // 初始化 ECharts 实例
var chartDom_njsd = document.getElementById('njsd'); // 获取图表容器元素
var Chart_njsd = echarts.init(chartDom_njsd); // 初始化 ECharts 实例
var chartDom_zs = document.getElementById('zs'); // 获取图表容器元素
var Chart_zs = echarts.init(chartDom_zs); // 初始化 ECharts 实例
var chartDom_mxdy = document.getElementById('mxdy'); // 获取图表容器元素
var Chart_mxdy = echarts.init(chartDom_mxdy); // 初始化 ECharts 实例
var option; // 定义图表的配置选项

// 配置选项
option = {
    tooltip: {
        formatter: '{b} : {c} A' // 鼠标悬停提示框的显示格式
    },
    series: [
        {
            name: 'Pressure', // 数据系列的名称
            type: 'gauge', // 图表类型为仪表盘
            // progress: {
            //     // show: true, // 显示进度条
            //     roundCap: true //圆形边端
            // },
            radius: 80,
            detail: {
                valueAnimation: false, // 值变化时显示动画
                formatter: '{value} ', // 仪表盘详情的显示格式
                textStyle: {
                    fontSize: 20, // value值 大小
                    // color: 'blue' // 调整文本颜色
                }
            },
            animation: false, //动画
            pointer: { //指针
                length: '100%',
                itemStyle: {
                    color: '#FF0000',

                }
            },
            anchor: {
                show: true,
                showAbove: true,
                size: 18,
                itemStyle: {
                    color: '#0000FF'
                }
            },
            axisLabel: {
                show: true, // 显示刻度标签
                distance: 15, // 刻度标签与刻度线的距离
                color: 'black', // 刻度标签的颜色自动适应

            },
            axisLine: {
                lineStyle: {
                    width: 10, // 设置轴线的宽度
                    color: [ // 设置不同区域的颜色
                        // [0, '#0080C0'], // -100 到 0 的区域颜色为红色
                        [0.25, '#0080C0'], // -100 到 0 的区域颜色为红色
                        [0.5, '#8080FF'], // 0 到 100 的区域颜色为蓝绿色
                        [0.75, '#FF80C0'], // 0 到 100 的区域颜色为蓝绿色
                        [1, '#FF0000'] // 100 到 200 的区域颜色为绿色
                    ]
                },
                roundCap: false
            },
            splitLine: {
                distance: -10, //分割线与轴线距离

            },
            axisTick: {
                distance: -6
            },
            data: [
                {
                    value: 0, // 初始值
                    name: '电流反馈',// 数据项的名称

                    title: {
                        show: true,
                        offsetCenter: [0, '-50%'], // 标题的位置偏移
                    }
                },
            ],

            min: -150, // 仪表盘的最小值
            max: 150, // 仪表盘的最大值
            splitNumber: 4 //仪表盘刻度的分割段数
        }
    ]
};

// 将配置选项应用到图表并渲染
option && Chart_dlfk.setOption(option);

option.series[0].data[0].name = '扭矩设定'
option.series[0].min = -150
option.series[0].max = 150
option && Chart_njsd.setOption(option);

option.series[0].data[0].name = '转速'
option.series[0].min = -3000
option.series[0].max = 3000
option && Chart_zs.setOption(option);


option.series[0].data[0].name = '母线电压'
option.series[0].min = 0
option.series[0].max = 1000
option && Chart_mxdy.setOption(option);
///////////////////////////////////////////////////////////////////////////////////////////////////////////*/

/***********************************************************************************************************
*
*                                           配置小仪表盘main
*
***********************************************************************************************************/
// 获取 main 图表的 DOM 元素
var chartDom = document.getElementById('main');
// 初始化 main 图表
var mainChart = echarts.init(chartDom);
// 初始化主图表的配置选项
var main_option;

// 预定义仪表盘的数据
const gaugeData = [
    {
        value: 0, // 初始值
        name: '设定转速', // 数据项的名称
        // 标题位置偏移量（用于调整标题位置）
        title: {
            offsetCenter: ['0%', '80%'] //name偏移 x y
        },
        // 数据详情位置偏移量（用于调整数据详情位置）
        detail: {
            // width: 50,
            // height: 14,
            color: 'auto',
            // backgroundColor: 'inherit',
            // borderRadius: 3,
            valueAnimation: false, // 值变化时显示动画
            fontSize: 14,
            fontWeight: 'normal', // 标题字体粗细，可以设置为 'normal', 'bold', 'bolder', 'lighter' 或数字值
            formatter: '设定 {value} RPM', // 数据详情的格式化字符串
            offsetCenter: ['0%', '80%'], //val偏移x y
        },
        pointer: {
            itemStyle: {
                color: 'auto' // 设置指针颜色
            },
        },
    },
    {
        value: 0,
        name: '转速',
        title: {
            offsetCenter: ['0%', '60%'] //name偏移 x y
        },
        detail: {
            // width: 50,
            // height: 14,
            fontSize: 14,
            fontWeight: 'normal', // 标题字体粗细，可以设置为 'normal', 'bold', 'bolder', 'lighter' 或数字值
            color: '#fff',
            // backgroundColor: 'inherit',
            // borderRadius: 3,
            formatter: '{value} RPM', // 数据详情的格式化字符串
            offsetCenter: ['0%', '65%'], //val偏移x y
        },
        itemStyle: {
            color: '#fff' // 设置指针颜色
        },
    },
];

// 设置主图表的配置选项
main_option = {
    series: [
        {
            type: 'gauge', // 图表类型为仪表盘
            anchor: {
                show: true,
                showAbove: true,
                size: 18,
                itemStyle: {
                    color: '#FAC858' // 设置锚点(指针中心点)的颜色
                }
            },
            pointer: {
                // 使用 path 自定义图标作为指针样式
                // icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                width: 5,
                length: '105%',
                offsetCenter: [0, '8%'], // 设置指针的样式、宽度、长度和偏移量
            },
            animation: false, //动画

            progress: {
                // show: true, // 显示进度条
                overlap: true, // 允许进度条与指针重叠
                roundCap: true // 进度条末端使用圆角
            },
            axisLine: {
                roundCap: true, // 轴线末端使用圆角
                lineStyle: {
                    width: 3, // 轴线的宽度
                    color: [ // 设置不同区域的颜色
                        [1, '#a0a0a0'] // 100 到 200 的区域颜色为绿色  4040ff 主题颜色
                    ]
                }
            },
            axisLabel: {
                show: true, // 显示刻度标签
                distance: 5,  // 刻度标签与刻度线的距离
                color: 'auto' // 刻度标签的颜色自动适应
            },
            data: gaugeData, // 预定义的仪表盘数据
            title: {
                show: false,//指针标题
                fontSize: 14 // 指针标题字体大小
            },
            splitLine: {
                distance: 0, //分割线与轴线距离
                lineStyle: {
                    width: 1, // 轴线的宽度
                    color: [ // 设置不同区域的颜色
                        [1, '#a0a0a0'] // 100 到 200 的区域颜色为绿色  4040ff 主题颜色
                    ]
                }
            },
            axisTick: {
                distance: 0,//刻度线与轴线距离
                lineStyle:
                {
                    color: 'auto'
                }
            },

            radius: '95%', // 设置仪表盘半径为整个容器的 75%
            min: -3000, // 仪表盘的最小值
            max: 3000, // 仪表盘的最大值
            splitNumber: 8 //仪表盘刻度的分割段数
        },

    ]
};

// 使用主图表的配置选项进行初始化
main_option && mainChart.setOption(main_option);
///////////////////////////////////////////////////////////////////////////////////////////////////////////


/***********************************************************************************************************
*
*                                               配置小电流仪表盘
*
***********************************************************************************************************/
var chartDom = document.getElementById('main_dl');
var Chart_main_dl = echarts.init(chartDom);
var main_dl_option;

main_dl_option = {
    tooltip: {
        formatter: '{a} <br/>{b}  {c}A'
    },
    series: [
        {
            name: '反馈电流', // 数据系列的名称
            type: 'gauge', // 图表类型为仪表盘
            // progress: {
            //     show: true, // 显示进度条
            //     width:3
            //     // roundCap: true //圆形边端
            // },
            radius: 40,
            pointer: { //指针
                show: false,
                length: '100%',
                width: 3,      // 指针宽度
                itemStyle: {
                    color: 'auto',

                }
            },
            detail: {
                valueAnimation: false, // 值变化时显示动画
                formatter: '{value} A', // 仪表盘详情的显示格式
                offsetCenter: ['0%', '0%'], //val偏移x y
                fontWeight: 'lighter', // 标题字体粗细，可以设置为 'normal', 'bold', 'bolder', 'lighter' 或数字值
                color: '#ffffff', // 标题字体颜色

                textStyle: {
                    fontSize: 15, // 标题字体大小
                    // color: '#fff', // 标题字体颜色
                    // fontWeight: 'normal' // 标题字体粗细，可以设置为 'normal', 'bold', 'bolder', 'lighter' 或数字值
                }
            },
            animation: false, //动画

            // anchor: {//轴心
            //     show: true,
            //     showAbove: true,
            //     size: 8,
            //     itemStyle: {
            //         color: '#0000FF'
            //     }
            // },
            axisLabel: {
                show: false, // 显示刻度标签
                distance: 5, // 刻度标签与刻度线的距离
                // fontSize: 10, // 刻度标签字体大小
                color: 'auto', // 刻度标签的颜色自动适应

            },
            axisLine: {
                lineStyle: {
                    width: 3, // 设置轴线的宽度
                    color: [ // 设置不同区域的颜色
                        [1, '#fff'], // -100 到 0 的区域颜色为红色
                        // [0.25, '#0080C0'], // -100 到 0 的区域颜色为红色
                        // [0.5, '#8080FF'], // 0 到 100 的区域颜色为蓝绿色
                        // [0.75, '#FF80C0'], // 0 到 100 的区域颜色为蓝绿色
                        // [1, '#FF0000'] // 100 到 200 的区域颜色为绿色
                    ]
                },
                roundCap: false
            },
            splitLine: {
                distance: 0, //分割线与轴线距离
                length: '10%', // 分割线长度为整个半径的 10%
                lineStyle: {
                    width: 2, // 分割线宽度
                }
            },
            axisTick: {
                distance: 0,
                length: 4, // 刻度线长度为 8 像素
                lineStyle:
                {
                    color: 'auto'
                }
            },
            data: [
                {
                    value: 0, // 初始值
                    title: {
                        show: true,
                        offsetCenter: [0, '-50%'], // 标题的位置偏移
                    }
                }
            ],

            min: -150, // 仪表盘的最小值
            max: 150, // 仪表盘的最大值
            splitNumber: 4 //仪表盘刻度的分割段数
        }
    ]
};

main_dl_option && Chart_main_dl.setOption(main_dl_option);

///////////////////////////////////////////////////////////////////////////////////////////////////////////

function updateValue() { } //参数配置页面的函数，不定义不行


/***********************************************************************************************************
*
*                                               滑动条
*
***********************************************************************************************************/
var ui_huakuai;
layui.use(['slider', 'jquery'], function () {
    var slider = layui.slider;
    var $ = layui.jquery;

    var huakuai_value = 0; // 当前滑块的值
    var startValue = 0; // 触摸开始时的滑块值
    var isSending = false; // 用于标记是否正在发送
    var timeoutId; // 用于存储 setTimeout 的返回值

    ui_huakuai = slider.render({
        elem: '#ID-slider-demo-maxmin',
        min: -100, // 最小值
        max: 100, // 最大值
        tips: false, // 关闭默认提示层
        input: true,
        value: localStorage.getItem("huakuai_value") || 0, // 初始值
        change: function (value) {
            huakuai_value = value;
            localStorage.setItem('huakuai_value', value);
            updata_main_set_zs(value * 30);
            console.log("设定百分比" + value) // 滑块当前值

            if (timeoutId) {
                clearTimeout(timeoutId); // 清除之前的定时器
            }

            timeoutId = setTimeout(function () {
                if (!isSending) {
                    isSending = true;
                    parent.sendWithRetries('01 C0 01' + hex_arr[value + 100]);
                    setTimeout(function () {
                        isSending = false;
                    }, 200);
                }
            }, 200);
        },
        // done: function(value){  //拖拽结束时触发
        //     console.log("设定百分比"+value) // 滑块当前值
        //     // do something
        //   }
    });

    // 绑定点击事件
    $('.max-label').on('dblclick', function () {
        ui_huakuai.setValue(100);
    });
    $('.min-label').on('dblclick', function () {
        ui_huakuai.setValue(-100);
    });
    $('#main').on('dblclick', function () {
        ui_huakuai.setValue(0);
    });




    //触摸修改val----------------------------------
    var isTouching = false; // 是否正在触摸
    var startX = 0; // 触摸开始时的X坐标

    const huakuai_dom = $('.layui-slider-wrap');

    huakuai_dom.on('touchstart', function (e) {
        e.stopPropagation() //停止冒泡
        e.preventDefault(); // 阻止默认的点击跳转行为
        isTouching = true;
        startX = e.touches[0].clientX;
        startValue = huakuai_value; // 记录触摸开始时的滑块值
    });

    huakuai_dom.on('touchmove', function (e) {
        if (isTouching) {
            var moveX = e.touches[0].clientX - startX;
            // 根据触摸开始时的滑块值来计算新的滑块值
            var newValue = Math.min(Math.max(startValue + moveX, -100), 100);
            ui_huakuai.setValue(newValue);
        }
    });

    huakuai_dom.on('touchend', function () {
        isTouching = false;
    });



    //鼠标键盘修改val-------------------------------------
    let main_set_zs_minval = -100;
    let main_set_zs_maxval = 100;
    let adjusting = false;
    let allowScroll = true; // 标志是否允许滚动
    const main_dom = document.getElementsByClassName('layui-slider-wrap')[0];
    main_dom.addEventListener('mouseup', () => {
        gaugeData[0].pointer.itemStyle.color = '#ffb800';
        mainChart.setOption(main_option);
        adjusting = true;
        allowScroll = false; // 在调整状态下禁止滚动
    });

    window.addEventListener('mousedown', () => {
        gaugeData[0].pointer.itemStyle.color = 'auto';
        mainChart.setOption(main_option);
        adjusting = false;
        allowScroll = true; // 在非调整状态下允许滚动
    });

    // 监听滚轮事件，实时更新仪表盘的值和颜色
    document.body.addEventListener('wheel', (event) => {
        event.stopPropagation()
        if (!allowScroll) {
            event.preventDefault(); // 阻止默认的滚动行为
        }
        if (adjusting) {
            huakuai_value += event.deltaY > 0 ? -1 : 1;
            huakuai_value = huakuai_value >= main_set_zs_maxval ? main_set_zs_maxval : huakuai_value <= main_set_zs_minval ? main_set_zs_minval : huakuai_value;  //   0 <= huakuai_value <= 100
            updata_main_set_zs(huakuai_value);
            ui_huakuai.setValue(huakuai_value);
        }
    }, { passive: false });
    // 监听键盘按键事件
    document.addEventListener('keydown', (event) => {
        event.stopPropagation()
        if (!allowScroll) {
            event.preventDefault(); // 阻止默认的滚动行为
        }
        if (adjusting) { // 如果处于调整状态
            if (event.key === 'ArrowUp') { // 按下了上箭头键
                huakuai_value = Math.min(huakuai_value + 1, main_set_zs_maxval); // 增加 huakuai_value 值，但不超过 100
            } else if (event.key === 'ArrowDown') { // 按下了下箭头键
                huakuai_value = Math.max(huakuai_value - 1, main_set_zs_minval); // 减少 huakuai_value 值，但不小于 -100
            }
            updata_main_set_zs(huakuai_value);
            ui_huakuai.setValue(huakuai_value);
        }
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////

/***********************************************************************************************************
*
*                                               函数防抖实现
*
***********************************************************************************************************/
function debounce(func, delay) {
    let timer;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(func, delay);
    };
}

// 在防抖函数中执行页面重新加载
const reloadPage = debounce(function () {
    location.reload();
}, 500); // 500毫秒的延迟

// 监听窗口大小变化事件，并在防抖函数中重新加载页面
window.addEventListener('resize', reloadPage);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/***********************************************************************************************************
*
*                                               控制模式按钮
*
***********************************************************************************************************/
layui.use(function () {
    var dropdown = layui.dropdown;
    dropdown.render({
        elem: '.demo-dropdown-base', // 绑定元素选择器，此处指向 class 可同时绑定多个元素
        data: [{
            title: '位置环',
            id: 100,
            cmd: "01 80 21 00 01"
        }, {
            title: '速度环',
            id: 101,
            cmd: "01 80 21 00 02"
        }, {
            title: '力矩环',
            id: 102,
            cmd: "01 80 21 00 03"
        }],
        click: function (obj) {
            this.elem.find('span').text(obj.title);
            parent.sendWithRetries(obj.cmd);
        }
    });

});
////////////////////////////////////////////////////////////////////////////////////////////////////////////

/***********************************************************************************************************
*
*                                               开关使能处理
*
***********************************************************************************************************/

function enableDevice_style() {
    //获取dom
    var icon = $('#main_start').find('i');
    var buttonText = $('#main_start').find('span');

    //修改使能按钮的颜色和文字
    $("#main_start").css("background", "#16b777");
    buttonText.text("关使能");
    buttonText.css("color", "#fff");

    //修改电压图标颜色
    icon.css('color', '#fff');
    $("#div_dy").css("color", "#4040ff");
    $("#span_dy_val").css("color", "#fff");
    $("#div_dy").css("border", "1px solid #4040ff");

    //修改mainChart颜色
    main_option.series[0].axisLine.lineStyle.color = [
        [0.25, '#0080C0'],
        [0.5, '#8080FF'],
        [0.75, '#FF80C0'],
        [1, '#FF0000']
    ];
    mainChart.setOption(main_option);

    //修改小电流仪表盘颜色
    main_dl_option.series[0].axisLine.lineStyle.color = [ // 设置不同区域的颜色
        [0.75, '#4040ff'],
        [1, '#FF0000']
    ]
    Chart_main_dl.setOption(main_dl_option);
}

function disableDevice_style() {
    //获取dom
    var icon = $('#main_start').find('i');
    var buttonText = $('#main_start').find('span');

    //修改使能按钮的颜色和文字
    $("#main_start").css("background", "#fff");
    buttonText.text("开使能");
    buttonText.css("color", "#a0a0a0");

    //修改电压图标颜色
    icon.css('color', '#2f363c');
    $("#div_dy").css("color", "#fff");
    $("#div_dy").css("border", "1px solid #fff");

    //修改mainChart颜色
    main_option.series[0].axisLine.lineStyle.color = [
        [1, '#a0a0a0']
    ];
    mainChart.setOption(main_option);

    //修改小电流仪表盘颜色
    main_dl_option.series[0].axisLine.lineStyle.color = [
        [1, '#fff']
    ];
    Chart_main_dl.setOption(main_dl_option);
}
//开使能函数
function enableDevice() {
    // 下发开使能
    parent.sendWithRetries('01 C0 03 AA 55 B8 40');

    localStorage.setItem('enableDevice', true);
    enableDevice_style()
}

//关使能函数
function disableDevice() {
    // 下发关使能
    parent.sendWithRetries('01 C0 04 55 AA 20 DF');
    localStorage.setItem('enableDevice', false);
    disableDevice_style();

}

//开关使能按钮点击事件处理函数
$('#main_start').click(function () {
    if ($(this).find('span').text() === "开使能") {
        enableDevice();
    } else {
        disableDevice();
    }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/***********************************************************************************************************
*
*                                               折线图
*
***********************************************************************************************************/
var chartDom = document.getElementById('zxt_zs');
var Chart_zxt_zs = echarts.init(chartDom);
var option_zxt_zs;
option_zxt_zs = {
    // 标题配置
    title: {
        text: '速度环', // 标题内容
        show: false,
        // textStyle: {
        //     fontSize: 16, // 标题字体大小
        //     fontWeight: 'normal' // 标题字体粗细
        //     // 还可以设置其他样式，比如颜色等
        // }
    },
    // 工具提示配置
    tooltip: {
        trigger: 'axis', // 提示类型为坐标轴触发
        // position: 'bottom' // 将提示框放置在下方
        position: [0, 100] // 尝试其他位置，如 'top', 'right', 'left'
    },
    // 图例配置
    legend: {
        data: ['设定转速', '实际转速'], // 图例的数据项
        bottom: 0, // 将图例显示在底部
        textStyle: {
            fontSize: 10 // 设置图例字体大小
        }
    },
    // 网格配置
    grid: {
        left: '5%', // 网格左边距
        right: '5%', // 网格右边距
        bottom: '20%', // 网格底边距
        containLabel: false, // 网格是否包含轴标签
        height: '70%' // 设置高度，可以使用百分比或像素值

    },
    // 工具箱配置
    toolbox: {
        feature: {
            saveAsImage: {} // 工具箱功能，保存为图片
        },
        // bottom: "15%", // 将图例显示在底部
        right: '5%',

    },
    // 数据区域缩放配置
    dataZoom: [
        {
            type: 'inside', // 内置的数据区域缩放组件
            start: 0, // 默认缩放起始位置为 0（代表 0%）
            end: 80 // 默认缩放结束位置为 100（代表 100%）
        }
    ],
    // x 轴配置
    xAxis: {
        type: 'category',
        show: true, // 显示 x 轴
        axisLabel: {
            show: false
        },
        axisTick: {
            show: false // x 轴的刻度线
        },
        axisLine: {
            show: true // x 轴的轴线
        }
    },

    // y 轴配置
    yAxis: {
        type: 'value',
        show: true, // 显示 y 轴
        axisLabel: {
            show: false // y 轴的数字标签
        },
        axisLine: {
            show: true //  y 轴的轴线
        },
        splitLine: {
            show: false //  y 轴的网格线
        }
    },
    // 数据系列配置
    series: [
        {
            name: '设定转速', // 数据系列的名称
            type: 'line', // 数据系列的类型为折线图
            // stack: 'Total', // 数据系列的堆叠方式
            symbol: 'none', // 设置折点圆点为 "none"，即不显示
            data: [], // 数据项
        },
        {
            name: '实际转速', // 数据系列的名称
            type: 'line', // 数据系列的类型为折线图
            // stack: 'Total', // 数据系列的堆叠方式
            symbol: 'none', // 设置折点圆点为 "none"，即不显示
            data: [] // 数据项
        }
    ]
};

option_zxt_zs && Chart_zxt_zs.setOption(option_zxt_zs);


var chartDom = document.getElementById('zxt_dl');
var Chart_zxt_dl = echarts.init(chartDom);
option_zxt_zs.series[0].name = "设定电流"
option_zxt_zs.series[1].name = "实际电流"
// 修改图例的数据项为 "设定电流"
option_zxt_zs.legend.data = ['设定电流', '实际电流'];
option_zxt_zs && Chart_zxt_dl.setOption(option_zxt_zs);

/////////////////////data塞数据/////////////////////////
function addData(chart, num1, num2) {
    if (chart && chart.setOption && Array.isArray(chart.getOption().series)) {
        const option = chart.getOption();
        const series1Data = option.series[0].data;
        const series2Data = option.series[1].data;

        // 添加新数据到各个数据数组
        series1Data.push(num1);
        series2Data.push(num2);

        // 如果数据长度超过 100，删除旧的数据项
        if (series1Data.length > 100) {
            series1Data.splice(0, series1Data.length - 100);
        }
        if (series2Data.length > 100) {
            series2Data.splice(0, series2Data.length - 100);
        }

        // 更新图表配置
        chart.setOption(option);
    }
}



const mainChart1 = echarts.init(document.getElementById('zxt_zs'));
const mainChart2 = echarts.init(document.getElementById('zxt_dl'));
// 定义定时器间隔（毫秒）
const interval = 50; // 每隔 1 秒执行一次

// 启动定时器
const timer = setInterval(() => {
    if (localStorage.getItem('enableDevice') === "true") {
        // addData(mainChart1, (localStorage.getItem('huakuai_value') || 0) * 30, (Math.random() * (3000 - -3000) + -3000).toFixed(1));
        addData(mainChart2, 1000, Math.floor(Math.random() * (30000 - 0 + 1)) / 10 + 0);
    }

}, interval);

// 停止定时器（例如在不需要定时执行时）
// setTimeout(function(){
//     clearInterval(timer);
// },10000)

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
