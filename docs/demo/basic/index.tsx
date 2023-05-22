import React, { useState } from 'react';
import { GraphTimeline, INode, IEdge } from 'graph-timeline';
// import demo1Data from './demo1';
import demo2Data from './demo2';
import { TooltipContent, TooltipProvider, ToolTipsGlobal } from './toolTips';
// 自定义的内容区域组件
const CustomContent: React.FC = () => {
  return <div>Hello, world!</div>;
};
import './index.less';
import './iconfont/iconfont.css';

export default () => {
  const [activeNodeIds, setActiveNodeIds] = useState<string[]>([]);
  const [visible, setVisible] = useState(true);
  const [position, setPosition] = useState({ left: 500, top: 500 });

  const onNodeClick = (node: INode, e: MouseEvent) => {
    if (e.button !== 0) return;

    // 右键点击选中
    const include = activeNodeIds.includes(node.id);
    setActiveNodeIds(
      !include ? [...activeNodeIds, node.id] : activeNodeIds.filter((id) => id !== node.id),
    );
  };

  // x 是x轴坐标，s 是起点y轴坐标，t是终点y轴坐标
  const onEdgeClick = (
    type: 'source' | 'target' | 'line',
    edge: IEdge,
    position: { x?: number; s?: number; t?: number },
    e: MouseEvent,
  ) => {};

  const onEdgeHover = (
    type: 'source' | 'target' | 'line',
    edge: IEdge,
    position: { x?: number; s?: number; t?: number },
    e: MouseEvent,
  ) => {
    setVisible(true);
    setPosition({
      left: e.screenX,
      top: e.screenY,
    });
  };

  const onEdgeOut = (
    type: 'source' | 'target' | 'line',
    edge: IEdge,
    position: { x?: number; s?: number; t?: number },
    e: MouseEvent,
  ) => {
    setVisible(false);
  };

  const graphConfig = {
    nodeGroupBy: 'group',
    nodeGroups: {
      SPerson: {
        color: 'rgba(53,127,31,1)',
        radius: 5,
        strokeColor: 'rgba(53,127,31,0.7)',
        strokeStyle: 'solid',
        iconStyle: {
          type: 'icon',
          color: 'white',
          value: '&#xe629;',
          className: 'iconfont',
        },
      },
      SPerson1: {
        color: 'rgba(53,127,31,1)',
        radius: 5,
        strokeColor: 'rgba(53,127,31,0.7)',
        strokeStyle: 'solid',
        iconStyle: {
          type: 'text',
          color: 'white',
          value: '人',
        },
      },
      Device: {
        color: 'rgb(224,162,30)',
        iconStyle: {
          type: 'img',
          value: 'http://touxiang.fzlol.com/pic/20141216/1275_1418705548_1.jpg',
        },
      },
    },
    nodeConfig: {
      radius: 5,
      color: 'rgba(255,0,0,1)',
      strokeOpacity: 0.3,
      strokeColor: 'rgba(255,0,0,.7)',
      strokeStyle: 'dashed',
      showHeatMap: false,
    },
    edgeConfig: {
      width: 1,
      reverse: true,
    },
    edgeGroupBy: 'group',
    edgeGroups: {
      COMPANY: {
        width: 4,
        arrowRadius: 8,
        color: 'yellow',
      },
    },
  };

  return (
    <div onContextMenu={(e) => e.preventDefault()}>
      <GraphTimeline
        {...demo2Data}
        {...graphConfig}
        yAxis={{ width: 80 }}
        style={{ height: 400, padding: 50 }}
        onNodeClick={onNodeClick}
        activeNodeIds={activeNodeIds}
        onEdgeClick={onEdgeClick}
        onEdgeHover={onEdgeHover}
        onEdgeOut={onEdgeOut}
      />
      {/* <ToolTipsGlobal visible={visible} position={{
        left: `${position.left}px`,
        top: `${position.top}px`,
      }}>
        <CustomContent />
      </ToolTipsGlobal> */}
    </div>
  );
};
