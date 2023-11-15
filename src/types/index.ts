export type ValueOf<T> = T[keyof T];

export type TBaseTime = string | number;
export type TTime = TBaseTime | { start: TBaseTime; end: TBaseTime };

export interface IEdge extends Record<string, any> {
  source: string;
  target: string;
  time: TTime;
}

export interface INode
  extends Partial<{
      data: Record<string, string>;
      label: string;
    }>,
    Record<string, any> {
  id: string;
}

export interface INodeGroupIconStyle {
  // 类型
  type: 'img' | 'icon' | 'text';
  // 图标内容，img对应图片地址，icon对应图标的unicode值，text对应文本字符（仅展示一个字符）
  value: string;
  // 图标颜色,仅当iconType为icon和text有效
  color?: string;
  // 设置图标的类名，可用于iconfont fontawesome的外部类名指定
  className?: string;
}

// 分组状态
export enum EGroupStatus {
  // 不显示
  HIDDEN = 0,
  // 展开
  DOWN = 1,
  // 收起
  UP = 2,
}

export interface INodeGroupStyle {
  // 节点颜色
  color?: string;
  // 半径
  radius?: number;
  // 背景线颜色
  strokeColor?: string;
  strokeOpacity?: number;
  // 背景线实线还是虚线；默认 solid 实线
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  // y轴坐标图标样式
  iconStyle?: INodeGroupIconStyle;
  // 状态
  status?: EGroupStatus;
  //热力图条带颜色
  colorStripes?: string[];
}

export interface INodeGlobalStyle extends INodeGroupStyle {
  // 是否显示热力图
  showHeatMap?: boolean;
}

export interface IEdgeGroupStyle {
  // 颜色默认起始节点到中止节点渐变，也可特殊定义
  color?: string;
  // 渐变是否反向。不反向：起始节点到中止节点渐变；反向： 中止节点到起始节点渐变；
  reverse?: boolean;
  // 线的宽度
  width?: number;
  // 箭头半径
  arrowRadius?: number;
}

export interface IYAxisStyle {
  width: number;
}

export interface IXAxisStyle {}

export interface INoPaddingSize {
  width: number;
  height: number;
}

export interface IHeapMapItem {
  nodeId: string;
  count: number;
  index: number;
  // group: string;
}

//配色
enum IColorType {
  Blue = 'blue',
  Green = 'green',
  Yellow = 'yellow',
  Red = 'red',
  Cyan = 'cyan',
  Pink = 'pink',
}
export type IColorScheme = {
  [key in IColorType]: IColorStripes;
};
export type IColorStripes = {
  mainColor: string;
  mainColorLab: [number, number, number];
  labStripes: [number, number, number][];
  hexStripes: Array<string>;
};
