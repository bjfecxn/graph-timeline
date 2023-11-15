import React, { useEffect, useState } from 'react';
import { GraphTimeline, INode, IEdge } from 'graph-timeline';
// import demoData from './demo1';
// import demoData from './demo2';
import demoData from './demo3';
import './index.less';
import './iconfont/iconfont.css';
import { COLOR_SCHEME } from '../../../src/common/constants';

export default () => {
  const [activeNodeIds, setActiveNodeIds] = useState<string[]>([]);

  const onNodeClick = (node: INode, e: MouseEvent) => {
    console.log('onNodeClick-e', e, node);
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
  ) => {
    console.log('onEdgeClick', type, edge, position, e);
  };

  // demo 2 的展示配置
  // const graphConfig = {
  //   nodeGroupBy: 'group',
  //   nodeGroups: {
  //     SPerson: {
  //       color: '#588BEE',
  //       iconStyle: {
  //         type: 'icon',
  //         color: 'white',
  //         value: '&#xe629;',
  //         className: 'iconfont',
  //       },
  //     },
  //     Device: {
  //       color: '#FDB844',
  //       iconStyle: {
  //         type: 'img',
  //         value: 'http://touxiang.fzlol.com/pic/20141216/1275_1418705548_1.jpg',
  //       },
  //     },
  //   },
  //   nodeConfig: {
  //     radius: 3.5,
  //     color: 'rgba(255,0,0,1)',
  //     strokeColor: '#DBDEE2',
  //     strokeStyle: 'dashed',
  //     showHeatMap: true,
  //   },
  //   edgeConfig: {
  //     width: 2,
  //     reverse: true,
  //     arrowRadius: 7,
  //   },
  //   // edgeGroupBy: 'group',
  //   // edgeGroups: {
  //   //   COMPANY: {
  //   //     width: 4,
  //   //     arrowRadius: 8,
  //   //     color: '#17C28F',
  //   //   },
  //   // },
  // };
  // demo3 的展示配置

  const graphConfig = {
    nodeGroupBy: 'group',
    nodeGroups: {
      人员: {
        color: COLOR_SCHEME.blue.mainColor,
        colorStripes: COLOR_SCHEME.blue.hexStripes,
        nodeGroupBy: 'gender',
      },
      摄像机: {
        color: COLOR_SCHEME.yellow.mainColor,
        colorStripes: COLOR_SCHEME.yellow.hexStripes,
      },
      未知: {
        color: '#e5e5e5',
      },
    },
    nodeConfig: {
      radius: 3.5,
      color: 'rgba(255,0,0,1)',
      strokeColor: '#DBDEE2',
      strokeStyle: 'dashed',
      showHeatMap: true,
    },
    edgeConfig: {
      width: 2,
      reverse: false,
      arrowRadius: 7,
    },
    // edgeGroupBy: 'group',
    // edgeGroups: {
    //   COMPANY: {
    //     width: 4,
    //     arrowRadius: 8,
    //     color: '#17C28F',
    //   },
    // },
  };

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      style={{ height: 800, margin: 16, boxShadow: '6px 6px 6px 6px rgba(0, 0, 0, 0.2)' }}
    >
      <GraphTimeline
        {...demoData}
        {...graphConfig}
        yAxis={{ width: 200 }}
        onNodeClick={onNodeClick}
        activeNodeIds={activeNodeIds}
        onEdgeClick={onEdgeClick}
      />
    </div>
  );
};
