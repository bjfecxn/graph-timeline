import React, { useContext, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { useUpdateEffect } from 'ahooks';
import useXAxis from './useXAxis';
import useYAxis from './useYAxis';
import useChart from './useChart';
import useScrollbar from './useScrollbar';
import { GraphTimeService } from './service';
import { getTime } from '../../utils';

export default () => {
  const {
    wrapper,
    size,
    setTransform,
    edges = [],
    xScale,
    yScale,
    yAxisStyle,
  } = useContext(GraphTimeService);
  const xAxis = useXAxis();
  // const yAxis = useYAxis();
  // const scrollbar = useScrollbar();
  const chart = useChart();

  useEffect(() => {
    if (!wrapper || !size) return;
    // 更新画布大小
    wrapper
      .selectAll('svg')
      .data([size])
      .attr('width', (d) => d.width - yAxisStyle.width)
      .attr('height', (d) => d.height)
      .style('transform', () => `translateX(${yAxisStyle.width}px)`);
  }, [wrapper, size?.width, size?.height, yAxisStyle.width]);

  /**
   * 缩放系数计算
   */
  const maxScale = useMemo(() => {
    if (!edges?.length) return;
    const timeStamps = new Set(edges.map((edge) => getTime(edge.time)));
    const timeArray = [...timeStamps].sort();
    let minGap = Number.MAX_SAFE_INTEGER;
    for (let i = 1; i < timeArray.length - 1; i++) {
      const diff = Math.abs(timeArray[i] - timeArray[i - 1]);
      minGap = Math.min(minGap, diff);
    }
    const maxGap = timeArray[timeArray.length - 1] - timeArray[0];
    return maxGap / minGap;
  }, [edges]);

  useUpdateEffect(() => {
    if (!wrapper || !size || !maxScale || !xScale) return;
    const zoomed: any = d3
      .zoom()
      .on('zoom', (event) => {
        setTransform?.(event.transform);
      })
      .scaleExtent([0.1, maxScale * 0.6])
      .translateExtent([
        [-size.width, 0],
        [size?.width * 1.5, size.height],
      ]);

    wrapper.select('svg').call(zoomed);
  }, [wrapper, size]);

  return (
    <>
      <svg></svg>
      <div className="axis yAxis" style={{ width: size.width, height: size.height }}></div>
    </>
  );
};
