//////////////////////////////////////鼠标键盘修改val////////////////////////
const valueDisplay = document.getElementById('dlfk');

let dlfk_minval = -150;
let dlfk_maxval = 150;
let val = 0;
let adjusting = false;
valueDisplay.addEventListener('mouseup', () => {
    adjusting = true;
    // valueDisplay.style.backgroundColor = 'lightblue';
});

window.addEventListener('mousedown', () => {
    adjusting = false;
    // valueDisplay.style.backgroundColor = 'skyblue';
});

// 监听滚轮事件，实时更新仪表盘的值和颜色
document.body.addEventListener('wheel', (event) => {
    if (adjusting) {
        val += event.deltaY > 0 ? -1 : 1;
        val = val >= dlfk_maxval ? dlfk_maxval : val <= dlfk_minval ? dlfk_minval : val;  //   0 <= val <= 100

        updata_dlfk(val);

    }
});
// 监听键盘按键事件
document.addEventListener('keydown', (event) => {
    if (adjusting) { // 如果处于调整状态
        if (event.key === 'ArrowUp') { // 按下了上箭头键
            val = Math.min(val + 1, dlfk_maxval); // 增加 val 值，但不超过 100
        } else if (event.key === 'ArrowDown') { // 按下了下箭头键
            val = Math.max(val - 1, dlfk_minval); // 减少 val 值，但不小于 -100
        }
        updata_dlfk(val);
    }
});
//////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////各仪表盘更新指针函数//////////////////////////////////////////////
//更新大仪表盘中的电流
function updata_dlfk(dlfk_val) {
    option.series[0].data[0].name = '电流反馈'
    option.series[0].min = -150
    option.series[0].max = 150
    // 更新图表的配置并实时更新仪表盘的值
    option.series[0].data[0].value = dlfk_val;
    Chart_dlfk.setOption(option);
    updata_main_dl(dlfk_val);
}

//更新大仪表盘中的转速
function updata_zs(zs_val) {
    option.series[0].data[0].name = '转速'
    option.series[0].min = -3000
    option.series[0].max = 3000
    // 更新图表的配置并实时更新仪表盘的值
    option.series[0].data[0].value = zs_val * 30;
    Chart_zs.setOption(option);
}

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

/////////////////////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////echart//////////////////////////////////////
// 创建一个 ECharts 实例
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
            color: '#2f363c',
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
                color: '#a0a0a0' // 设置指针颜色
            },
        },
    },
    {
        value: 40,
        name: '转速',
        title: {
            offsetCenter: ['0%', '60%'] //name偏移 x y
        },
        detail: {
            // width: 50,
            // height: 14,
            fontSize: 14,
            fontWeight: 'normal', // 标题字体粗细，可以设置为 'normal', 'bold', 'bolder', 'lighter' 或数字值
            color: 'red',
            // backgroundColor: 'inherit',
            // borderRadius: 3,
            formatter: '{value}', // 数据详情的格式化字符串
            offsetCenter: ['0%', '65%'], //val偏移x y
        },
        itemStyle: {
            color: 'red' // 设置指针颜色
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
                    width: 1 // 轴线的宽度
                }
            },
            axisLabel: {
                show: true, // 显示刻度标签
                distance: 5,  // 刻度标签与刻度线的距离
                color: 'black' // 刻度标签的颜色自动适应
            },
            data: gaugeData, // 预定义的仪表盘数据
            title: {
                show: false,//指针标题
                fontSize: 14 // 指针标题字体大小
            },
            splitLine: {
                distance: 0, //分割线与轴线距离

            },
            axisTick: {
                distance: 0//刻度线与轴线距离
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


// 监听主图表的点击事件
// mainChart.on('click', function (params) {
//     if (params.seriesType === 'gauge') { // 确保是仪表盘图表的点击事件
//         const clickedValue = params.data.value; // 获取点击的数据值
//         console.log('Clicked value:', clickedValue);
//     }
// });


// main_option.series[0].detail.color = '#fff';
// mainChart.setOption(main_option);

// 您还可以使用以下代码来定时刷新仪表盘数据
// setInterval(function () {
//     gaugeData[0].value = +(Math.random() * 100).toFixed(2);
//     gaugeData[1].value = +(Math.random() * 100).toFixed(2);
//     myChart.setOption({
//         series: [
//             {
//                 data: gaugeData
//             }
//         ]
//     });
// }, 2000);
//////////////////////////////////////////////////////////////


//////////////////////////////////反馈电流小仪表盘////////////////////////
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
            //     roundCap: true //圆形边端
            // },
            radius: 40,
            detail: {
                // valueAnimation: false, // 值变化时显示动画
                formatter: '{value} A', // 仪表盘详情的显示格式
                offsetCenter: ['0%', '70%'], //val偏移x y
                textStyle: {
                    fontSize: 10, // 标题字体大小
                    // color: 'red', // 标题字体颜色
                    fontWeight: 'normal' // 标题字体粗细，可以设置为 'normal', 'bold', 'bolder', 'lighter' 或数字值
                }
            },
            animation: false, //动画
            pointer: { //指针
                length: '100%',
                width: 3,      // 指针宽度
                itemStyle: {
                    color: '#FF0000',

                }
            },
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
                color: 'black', // 刻度标签的颜色自动适应

            },
            axisLine: {
                lineStyle: {
                    width: 2, // 设置轴线的宽度
                    // color: [ // 设置不同区域的颜色
                    //     // [0, '#0080C0'], // -100 到 0 的区域颜色为红色
                    //     [0.25, '#0080C0'], // -100 到 0 的区域颜色为红色
                    //     [0.5, '#8080FF'], // 0 到 100 的区域颜色为蓝绿色
                    //     [0.75, '#FF80C0'], // 0 到 100 的区域颜色为蓝绿色
                    //     [1, '#FF0000'] // 100 到 200 的区域颜色为绿色
                    // ]
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

//////////////////////////////////////////////////////////////////////////////////

function updateValue() { } //参数配置页面的函数，不定义不行



///////////////////////////////////////////////////滑动条////////////////////////////
layui.use(['slider', 'jquery'], function () {
    var slider = layui.slider;
    var $ = layui.jquery;

    var currentValue = 0; // 当前滑块的值
    var startValue = 0; // 触摸开始时的滑块值

    var inst = slider.render({
        elem: '#ID-slider-demo-maxmin',
        min: -100, // 最小值
        max: 100, // 最大值
        tips: false, // 关闭默认提示层
        input: true,
        value: 0, // 初始值
        change: function (value) {
            currentValue = value;
            updata_main_set_zs(value * 30);

        },
        // done: function(value){  //拖拽结束时触发
        //     console.log(value) // 滑块当前值
        //     // do something
        //   }
    });

    // 绑定点击事件
    $('.max-label').on('dblclick', function () {
        inst.setValue(100);
    });
    $('.min-label').on('dblclick', function () {
        inst.setValue(-100);
    });
    $('.layui-slider-wrap').on('dblclick', function () {
        inst.setValue(0);
    });

    var isTouching = false; // 是否正在触摸
    var startX = 0; // 触摸开始时的X坐标

    $('#ID-slider-demo-maxmin').on('touchstart', function (e) {
        isTouching = true;
        startX = e.touches[0].clientX;
        startValue = currentValue; // 记录触摸开始时的滑块值
    });

    $('#ID-slider-demo-maxmin').on('touchmove', function (e) {
        if (isTouching) {
            var moveX = e.touches[0].clientX - startX;
            // 根据触摸开始时的滑块值来计算新的滑块值
            var newValue = Math.min(Math.max(startValue + moveX, -100), 100);
            inst.setValue(newValue);
        }
    });

    $('#ID-slider-demo-maxmin').on('touchend', function () {
        isTouching = false;
    });
});
//////////////////////////////////////////////////////////////////////////////////////


////////////////////////////// 函数防抖实现///////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////控制模式按钮////////////////////
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
/////////////////////////////////////////////////////////////////////////////

///////////////////////////////开关使能按钮//////////////////

function enableDevice() {
    var icon = $('#main_start').find('i');
    var buttonText = $('#main_start').find('span');
    $("#main_start").css("background", "#00FF00");
    console.log("开使能");
    parent.sendWithRetries('01 C0 03 AA 55 B8 40'); // 开
    buttonText.text("关使能");
    icon.css('color', '#fff');
}

function disableDevice() {
    var icon = $('#main_start').find('i');
    var buttonText = $('#main_start').find('span');
    $("#main_start").css("background", "#fff");

    console.log("关使能");
    parent.sendWithRetries('01 C0 04 55 AA 20 DF'); // 关
    buttonText.text("开使能");
    icon.css('color', '#2f363c');
}

$('#main_start').click(function () {
    if ($(this).find('span').text() === "开使能") {
        enableDevice();
    } else {
        disableDevice();
    }
});

/////////////////////////////////////////



