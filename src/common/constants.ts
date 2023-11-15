import { TimeLocaleDefinition } from 'd3';
import { INodeGroupStyle, IYAxisStyle, IXAxisStyle, IEdgeGroupStyle, IColorScheme } from '../types';

export const INNER_PADDING: [number, number, number, number] = [50, 50, 50, 50];

export const MAX_HEATMAP_HEIGHT = 24.5;

export const SINGLE_ITEM_HEIGHT = 24;

//热力泳道图的方块高度
export const HEATMAP_SQUARE_HEIGHT = 7;

export const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export const PADDING_TOP = 14;
export const PADDING_BOTTOM = 14;

// scrollbar
// 滑块默认高度
export const DEFAULT_HANDLE_HEIGHT = 30;
export const DEFAULT_HANDLE_WIDTH = 6;
export const DEFAULT_TRACK_WIDTH = DEFAULT_HANDLE_WIDTH;

// 定义中文时间格式化字符串
export const TIME_LOCALE_FORMAT: TimeLocaleDefinition = {
  dateTime: '%x %A %X',
  date: '%Y年%-m月%-d日',
  time: '%H:%M:%S',
  periods: ['上午', '下午'],
  days: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  shortDays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  months: [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ],
  shortMonths: [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ],
};

export const DEFAULT_YAXIS_STYLE: IYAxisStyle = {
  // TODO 左侧内容的宽度（最好是能够自适应，目前是配置形式）
  width: 100,
};
export const DEFAULT_XAXIS_STYLE: IXAxisStyle = {};

export const FROM_KEY = {
  group: 'group',
};

export const DEFAULT_NODE_TYPE_STYLE: INodeGroupStyle = {
  // 默认节点颜色
  color: '#8c8c8c',
  // 半径
  radius: 3,
  // 默认不透明
  strokeOpacity: 1,
  // 背景线实线还是虚线
  strokeStyle: 'solid',
};
export const DEFAULT_EDGE_TYPE_STYLE: IEdgeGroupStyle = {
  // 颜色默认起始节点到中止节点渐变，也可特殊定义
  color: 'gradient',
  // 宽度
  width: 2,
  // 渐变是否反向。不反向：起始节点到中止节点渐变；反向： 中止节点到起始节点渐变；
  reverse: false,
  // 箭头半径
  arrowRadius: 10,
};

export const COLOR_SCHEME: IColorScheme = {
  blue: {
    mainColor: '#4178F2',
    mainColorLab: [58, 6, -56],
    labStripes: [
      [98, 6, -56],
      [88, 6, -56],
      [78, 6, -56],
      [68, 6, -56],
      [58, 6, -56],
      [48, 6, -56],
      [38, 6, -56],
      [28, 6, -56],
      [18, 6, -56],
      [8, 6, -56],
    ],
    hexStripes: [
      '#cff9ff',
      '#b1dcff',
      '#94c1ff',
      '#76a6ff',
      '#588bee',
      '#3672d2',
      '#005ab6',
      '#00439a',
      '#002d80',
      '#001a66',
    ],
  },
  green: {
    mainColor: '#17C28F',
    mainColorLab: [70, -51, 14],
    labStripes: [
      [100, -46, 19],
      [90, -51, 14],
      [80, -51, 14],
      [70, -51, 14],
      [60, -51, 14],
      [50, -51, 14],
      [40, -51, 14],
      [30, -51, 14],
      [20, -51, 14],
      [10, -51, 14],
    ],
    hexStripes: [
      '#9fffd7',
      '#68fcc5',
      '#46dfaa',
      '#17c28f',
      '#00a776',
      '#008c5d',
      '#007145',
      '#00572f',
      '#003f19',
      '#002a00',
    ],
  },
  yellow: {
    mainColor: '#FDB844',
    mainColorLab: [80, 18, 66],
    labStripes: [
      [100, 23, 56],
      [90, 18, 66],
      [80, 18, 66],
      [70, 18, 66],
      [60, 18, 66],
      [50, 18, 66],
      [40, 18, 66],
      [30, 18, 66],
      [20, 18, 66],
      [10, 18, 66],
    ],
    hexStripes: [
      '#ffed91',
      '#ffd45f',
      '#fdb844',
      '#de9d27',
      '#c08300',
      '#a36a00',
      '#865200',
      '#6b3a00',
      '#522400',
      '#3e0d00',
    ],
  },
  red: {
    mainColor: '#EE6159',
    mainColorLab: [60, 55, 34],
    labStripes: [
      [100, 55, 34],
      [90, 55, 34],
      [80, 55, 34],
      [70, 55, 34],
      [60, 55, 34],
      [50, 55, 34],
      [40, 55, 34],
      [30, 55, 34],
      [20, 55, 34],
      [10, 55, 34],
    ],
    hexStripes: [
      '#ffd2c0',
      '#ffb5a5',
      '#ff988b',
      '#ff7d71',
      '#ee6159',
      '#cf4541',
      '#b0272b',
      '#920016',
      '#740000',
      '#590000',
    ],
  },
  cyan: {
    mainColor: '#37C7E6',
    mainColorLab: [74, -31, -27],
    labStripes: [
      [94, -21, -17],
      [84, -31, -27],
      [74, -31, -27],
      [64, -31, -27],
      [54, -31, -27],
      [44, -31, -27],
      [34, -31, -27],
      [24, -31, -27],
      [14, -31, -27],
      [4, -31, -27],
    ],
    hexStripes: [
      '#aefbff',
      '#5de3ff',
      '#37c7e6',
      '#00acca',
      '#0091af',
      '#007794',
      '#005e7a',
      '#004561',
      '#002e49',
      '#001d32',
    ],
  },
  pink: {
    mainColor: '#DE5193',
    mainColorLab: [56, 60, -6],
    labStripes: [
      [96, 60, 4],
      [86, 60, -1],
      [76, 60, -6],
      [66, 60, -6],
      [56, 60, -6],
      [46, 60, -6],
      [36, 60, -6],
      [26, 60, -6],
      [16, -51, -14],
      [6, 60, -6],
    ],
    hexStripes: [
      '#ffc2ef',
      '#ffa6dc',
      '#ff8ac9',
      '#fc6dae',
      '#de5193',
      '#c0337a',
      '#a30861',
      '#860049',
      '#00363b',
      '#4d001e',
    ],
  },
};
