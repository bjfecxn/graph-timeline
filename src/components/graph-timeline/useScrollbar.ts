import { useEffect, useContext, useCallback } from 'react';
import * as d3 from 'd3';
import { useSafeState } from 'ahooks';
import { axisLeft } from '../../utils';
import { GraphTimeService } from './service';
import type { INode, INodeGroupIconStyle } from '../../types';
import {
  DEFAULT_HANDLE_HEIGHT,
  DEFAULT_HANDLE_WIDTH,
  DEFAULT_TRACK_WIDTH,
  MAX_HEATMAP_HEIGHT,
  PADDING_BOTTOM,
  PADDING_TOP,
} from '../../common/constants';

export default () => {
  const {
    wrapper,
    yAxisStyle: { width: yWidth },
    currZoomAllNodes,
    size,
    setScrollbarPos,
  } = useContext(GraphTimeService);

  const [scrollbar, setScrollbar] = useSafeState<d3.Selection<SVGGElement, any, any, any>>();

  // 生成滚动条容器
  useEffect(() => {
    if (!wrapper) return;

    let scrollbar = wrapper.select('svg').selectAll('.__scrollbar').data([null]);
    const scrollbarEnter = scrollbar.enter().append('g').attr('class', '__scrollbar') as any;

    scrollbar = scrollbar.merge(scrollbarEnter).attr('transform', () => `translate(-20, 0)`);

    setScrollbar(scrollbar as any);
  }, [wrapper]);

  // 在滚动条容器内生成 scrollbar
  useEffect(() => {
    if (!scrollbar || !size || !currZoomAllNodes) return;

    const contentHeight = currZoomAllNodes.length * MAX_HEATMAP_HEIGHT;
    const viewHeight = size.height - PADDING_TOP - PADDING_BOTTOM;
    setScrollbarPos(0);
    if (contentHeight <= viewHeight) {
      scrollbar.selectAll('rect').remove();
      return;
    }

    let track = scrollbar.selectAll('.__track').data([viewHeight]);
    const trackEnter = track.enter().append('rect').attr('class', '__track') as any;
    track = track
      .merge(trackEnter)
      .attr('x', 0)
      .attr('y', PADDING_TOP)
      .attr('width', DEFAULT_TRACK_WIDTH)
      .attr('height', (viewHeight) => viewHeight)
      .attr('fill', '#ddd')
      .attr('ry', DEFAULT_TRACK_WIDTH / 2);

    // const handleHeight = viewHeight - (contentHeight - viewHeight);
    const handleHeight = (viewHeight / contentHeight) * viewHeight;
    // 绘制滑块
    let handle = scrollbar.selectAll('.__handle').data([handleHeight]);
    const handleEnter = handle.enter().append('rect').attr('class', '__handle') as any;
    handle = handle
      .merge(handleEnter)
      .attr('x', 0)
      .attr('y', PADDING_TOP)
      .attr('width', DEFAULT_HANDLE_WIDTH)
      .attr('height', (handleHeight) => handleHeight)
      .attr('fill', '#999')
      .attr('ry', DEFAULT_HANDLE_WIDTH / 2);

    // 添加交互行为
    const drag: any = d3.drag().on('drag', function (event) {
      // 更新滑块位置
      const newY = Math.max(PADDING_TOP, Math.min(size.height - handleHeight, event.y));
      d3.select(this).attr('y', newY);

      // 根据滑块位置计算滚动位置
      const scrollPosition =
        ((newY - PADDING_TOP) / (viewHeight - handleHeight)) * (contentHeight - viewHeight);

      // 更新内容的滚动位置
      setScrollbarPos(scrollPosition);
    });
    handle.call(drag);
  }, [scrollbar, size, currZoomAllNodes]);

  return scrollbar;
};
