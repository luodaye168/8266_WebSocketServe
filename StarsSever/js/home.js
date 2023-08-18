const valueDisplay = document.getElementById('dlfk');

let val = 0;
let adjusting = false;
let dlfk_minval = -150;
let dlfk_maxval = 150;

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
function updata_dlfk(dlfk_val) {

    option.series[0].data[0].name = '电流反馈'
    option.series[0].min = -150
    option.series[0].max = 150
    // 更新图表的配置并实时更新仪表盘的值
    option.series[0].data[0].value = dlfk_val;
    Chart_dlfk.setOption(option);
}



//////////////////////////////////////////////////////////////////////////
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
                // valueAnimation: true, // 值变化时显示动画
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
                        [0, '#0080C0'], // -100 到 0 的区域颜色为红色
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
function updateValue() { }