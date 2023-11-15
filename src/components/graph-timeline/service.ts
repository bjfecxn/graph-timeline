import React, { RefObject, useCallback, useEffect, useMemo, useState } from 'react';
import { assign, flatMap, groupBy, keys, map } from 'lodash';
import * as d3 from 'd3';
import useContentSize from '../../hooks/useContentSize';
import {
  DEFAULT_YAXIS_STYLE,
  DEFAULT_XAXIS_STYLE,
  DEFAULT_NODE_TYPE_STYLE,
  DEFAULT_EDGE_TYPE_STYLE,
  TIME_FORMAT,
  TIME_LOCALE_FORMAT,
  SINGLE_ITEM_HEIGHT,
} from '../../common/constants';
import {
  IEdge,
  IEdgeGroupStyle,
  INode,
  INodeGlobalStyle,
  INodeGroupStyle,
  IXAxisStyle,
  IYAxisStyle,
} from '../../types';
import { useDebounce, useSafeState } from 'ahooks';
import { getServiceToken, getTime } from '../../utils';
import dayjs from 'dayjs';

type TEdgeEvent = (
  type: 'source' | 'target' | 'line',
  edge: IEdge,
  position: { x?: number; s?: number; t?: number },
  e: MouseEvent,
) => void;
export interface IServiceProps {
  containerRef: RefObject<HTMLDivElement>;
  yAxis?: Partial<IYAxisStyle>;
  xAxis?: Partial<IXAxisStyle>;

  edges?: IEdge[];
  nodes?: INode[];
  nodeGroupBy?: string;
  // 分类型
  nodeGroups?: Record<string, INodeGroupStyle & { nodeGroupBy?: string }>;
  // 没有类型，统一设置所有节点样式
  nodeConfig?: INodeGlobalStyle;
  activeNodeIds?: string[];
  edgeGroupBy?: string;
  edgeGroups?: Record<string, IEdgeGroupStyle>;
  edgeConfig?: IEdgeGroupStyle;

  onNodeClick?: (node: INode, e: MouseEvent) => void;
  onEdgeClick?: TEdgeEvent;
  onEdgeHover?: TEdgeEvent;
  onEdgeOut?: TEdgeEvent;
}
// 数据处理 & 格式转换
export const useService = ({
  containerRef,
  yAxis,
  xAxis,
  nodes = [],
  edges = [],
  nodeGroupBy,
  nodeGroups,
  nodeConfig,
  edgeGroupBy,
  edgeGroups,
  edgeConfig,
  activeNodeIds,
  onNodeClick,
  onEdgeClick,
  onEdgeHover,
  onEdgeOut,
}: IServiceProps) => {
  const size = useContentSize(containerRef);
  const chartWidth = useMemo(() => {
    if (!size?.width) return;
    return size.width - (yAxis?.width || 0);
  }, [size?.width, yAxis?.width]);
  const [selection, setSelection] =
    useState<d3.Selection<HTMLDivElement, unknown, null, undefined>>();
  const [transform, setTransform] = useSafeState<d3.ZoomTransform>();
  const debounceTransform = useDebounce(transform, { wait: 500 });
  const [isHeatMap, setIsHeatmap] = useSafeState<boolean>(nodeConfig?.showHeatMap || true);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [translateY, setTranslateY] = useState(0);

  const yAxisStyle = useMemo(() => assign(DEFAULT_YAXIS_STYLE, yAxis), [yAxis]);
  const xAxisStyle = useMemo(() => assign(DEFAULT_XAXIS_STYLE, xAxis), [xAxis]);

  useEffect(() => {
    if (!nodes?.length || !nodeGroupBy) {
      setExpandedKeys([]);
      return;
    }
    setExpandedKeys(keys(groupBy(nodes, nodeGroupBy)));
  }, [nodes, nodeGroupBy]);

  const nodesMap = useMemo(() => {
    const m: Record<string, INode> = {};
    nodes.forEach((node) => {
      m[node.id] = node;
    });
    return m;
  }, [nodes]);

  // 最小最大时间
  const minAndMax = useMemo(() => {
    if (!edges?.length) return;
    return d3.extent(edges, ({ time }) => getTime(time));
  }, [edges]);

  // 最小最大时间差
  const timeGapTotal = useMemo(() => {
    if (!minAndMax) return;
    return Number(minAndMax[1]) - Number(minAndMax[0]);
  }, [minAndMax]);

  const xScale = useMemo(() => {
    if (!selection || !chartWidth || !minAndMax) return;

    d3.timeFormatDefaultLocale(TIME_LOCALE_FORMAT);

    const scale = d3
      .scaleTime()
      .domain(map(minAndMax, (time) => dayjs(time, TIME_FORMAT)))
      // TODO test
      .range([-yAxisStyle.width, chartWidth])
      // .range([0, chartWidth])
      .nice();
    return transform?.rescaleX(scale) || scale;
  }, [selection, minAndMax, chartWidth, transform]);

  // 缩放的时候可视时间范围内的 edge
  const insightEdges = useMemo(() => {
    if (!chartWidth || !xScale) return;
    return edges.filter(
      (edge) =>
        xScale(getTime(edge.time)) >= 0 &&
        xScale(getTime(edge.time)) <= chartWidth &&
        edge.source &&
        nodesMap[edge.source] &&
        edge.target &&
        nodesMap[edge.target],
    );
  }, [xScale, chartWidth, edges, nodesMap]);

  // 缩放的时候可视时间范围内的 node
  const currZoomAllNodes = useMemo(() => {
    if (!insightEdges?.length) return;

    const nodeIdMap = new Map();
    insightEdges.forEach(({ source, target }) => {
      if (source) nodeIdMap.set(source, 1);
      if (target) nodeIdMap.set(target, 1);
    });

    const currZoomAllNodes = nodes.filter((node) => nodeIdMap.has(node.id));
    return currZoomAllNodes;
  }, [insightEdges, nodes]);

  // TODO 两层 Tree 结构的数据获取(数据结构处理优化，避免循环嵌套)
  const currZoomAllNodesTree: any = useMemo(() => {
    if (!currZoomAllNodes?.length) return [];
    if (!nodeGroupBy) return currZoomAllNodes;
    const groups = groupBy(currZoomAllNodes, nodeGroupBy);
    return keys(groups).map((key) => {
      const children = groups[key];
      const subNodeGroupBy = nodeGroups?.[key]?.['nodeGroupBy'];
      if (!subNodeGroupBy)
        return {
          id: key,
          label: key,
          children: groups[key],
        };
      const subGroups = groupBy(children, subNodeGroupBy);
      return {
        id: key,
        label: key,
        children: keys(subGroups).map((subKey) => ({
          id: subKey,
          label: subKey,
          children: subGroups[subKey],
        })),
      };
    });
  }, [currZoomAllNodes, nodeGroupBy, nodeGroups]);

  // TODO 两层 Tree 结构的数据获取(数据结构处理优化，避免循环嵌套)
  const currZoomAllFlatNodes = useMemo(() => {
    return flatMap(currZoomAllNodesTree, (group) => {
      return [
        { id: group.id, label: group.label },
        ...(expandedKeys?.includes(group.id)
          ? flatMap(group.children, (subGroup) => {
              return [
                { id: subGroup.id, label: subGroup.label },
                ...(expandedKeys?.includes(subGroup.label) ? subGroup.children : []),
              ];
            })
          : []),
      ];
    });
  }, [currZoomAllNodesTree, expandedKeys]);

  const yScale = useMemo(() => {
    if (!selection || !currZoomAllFlatNodes?.length) return;

    return d3
      .scalePoint()
      .domain(currZoomAllFlatNodes.map((d) => d.id))
      .range([0, currZoomAllFlatNodes.length * SINGLE_ITEM_HEIGHT])
      .padding(0.5);
  }, [selection, currZoomAllFlatNodes]);

  const getCurrNodeConfig = useCallback(
    (key: keyof INodeGroupStyle, node?: INode) => {
      const groupKey = node?.[nodeGroupBy as keyof INode];
      // 有分类
      if (groupKey && nodeGroups?.[groupKey as string]) {
        const subGroupKey = nodeGroups[groupKey].nodeGroupBy;
        // 有二层分类样式
        if (subGroupKey && nodeGroups[subGroupKey]?.[key])
          return nodeGroups[subGroupKey][key] as any;
        // 没有二层分类，只有一层分类
        if (nodeGroups[groupKey][key]) return nodeGroups[groupKey][key] as any;
      }

      // 无分类样式，有统一样式
      if (nodeConfig?.[key] !== undefined) return nodeConfig[key];
      // 内部默认样式
      return DEFAULT_NODE_TYPE_STYLE[key] || null;
    },
    [nodeGroupBy, nodeGroups, nodeConfig],
  );

  const getCurrEdgeConfig = useCallback(
    (key: keyof IEdgeGroupStyle, edge?: IEdge, useDefault?: boolean) => {
      const groupKey = edge?.[edgeGroupBy as keyof IEdge];
      // 有分类样式
      if (groupKey && edgeGroups?.[groupKey as string]?.[key])
        return edgeGroups[groupKey as string][key];
      // 无分类样式，有统一样式
      if (edgeConfig?.[key]) return edgeConfig[key];
      // 内部默认样式
      return useDefault ? DEFAULT_EDGE_TYPE_STYLE[key] || null : null;
    },
    [edgeGroups, edgeConfig, edgeGroupBy],
  );

  const getNodeGroupConfig = useCallback(
    (key: keyof INodeGroupStyle, group: string) => {
      const nodeGroup = nodeGroups?.[group];
      if (nodeGroup) {
        return nodeGroup?.[key];
      } else {
        return null;
      }
    },
    [nodeGroups],
  );

  const getYPos = (nodeId: string) => {
    if (!yScale) return;
    // 没有分组
    if (!nodeGroupBy) {
      return yScale(nodeId);
    }

    const node = nodesMap[nodeId];
    const level1ScaleKey = node[nodeGroupBy];

    // 一层收起
    if (!expandedKeys?.includes(level1ScaleKey)) return yScale(level1ScaleKey);
    // 一层展开
    // 二层收起
    const level2GroupBy = nodeGroups?.[node?.[nodeGroupBy]]?.['nodeGroupBy'];
    if (level2GroupBy && !expandedKeys?.includes(node[level2GroupBy]))
      return yScale(node[level2GroupBy]);

    // 全部展开
    return yScale(nodeId);
  };

  useEffect(() => {
    if (!containerRef.current || !size) return;

    setSelection(d3.select(containerRef.current));
  }, [containerRef.current, size]);

  useEffect(() => {
    if (!nodeConfig?.showHeatMap) {
      setIsHeatmap(false);
      return;
    }
    if (!xScale || !timeGapTotal || !chartWidth) return;
    const left = xScale.invert(-yAxisStyle.width).getTime();
    const right = xScale.invert(chartWidth).getTime();
    const timeGap = right - left;
    const ratio = timeGap / timeGapTotal;
    //时间跨度
    const xAxisDays = (right - left) / 3600 / 24000;
    if (xAxisDays > 1) {
      return setIsHeatmap(true);
    }
    //比例
    // if (ratio && ratio > 0.5) {
    //   return setIsHeatmap(true);
    // }
    setIsHeatmap(false);
  }, [xScale, chartWidth, yAxisStyle.width, timeGapTotal, nodeConfig?.showHeatMap]);

  return {
    wrapper: selection,
    size: { ...size, chartWidth },
    nodes,
    nodesMap,
    currZoomAllNodes,
    currZoomAllNodesTree,
    activeNodeIds,
    minAndMax,
    edges,
    insightEdges,
    timeGapTotal,
    yAxisStyle,
    xAxisStyle,
    transform: debounceTransform,
    xScale,
    yScale,
    expandedKeys,
    setExpandedKeys,
    isHeatMap,
    setTransform,
    getCurrNodeConfig,
    getCurrEdgeConfig,
    onNodeClick,
    onEdgeClick,
    onEdgeHover,
    onEdgeOut,
    getNodeGroupConfig,
    getYPos,
    translateY,
    setTranslateY,
  };
};

export const GraphTimeService = getServiceToken(useService);
