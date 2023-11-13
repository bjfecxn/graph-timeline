import { useEffect, useContext } from 'react';
import * as d3 from 'd3';
import { useSafeState } from 'ahooks';
import { GraphTimeService } from './service';
import { axisTop, axisBottom } from '../../utils/xAxis';

export default () => {
  const { wrapper, size, xScale } = useContext(GraphTimeService);

  const [xAxisTop, setXAxisTop] = useSafeState<d3.Selection<SVGGElement, any, any, any>>();
  const [xAxisTopSmall, setXAxisTopSmall] =
    useSafeState<d3.Selection<SVGGElement, any, any, any>>();
  const [xAxisBottom, setXAxisBottom] = useSafeState<d3.Selection<SVGGElement, any, any, any>>();
  const [xAxisBottomSmall, setXAxisBottomSmall] =
    useSafeState<d3.Selection<SVGGElement, any, any, any>>();

  useEffect(() => {
    if (!wrapper || !size?.height) return;
    // top
    let xAxisTop: any = wrapper.select('svg.xAxisTop').selectAll('g.xAxisTop').data([null]);
    const xAxisTopEnter: any = xAxisTop.enter().append('g').attr('class', 'axis xAxisTop');

    xAxisTop = xAxisTop.merge(xAxisTopEnter);

    setXAxisTop(xAxisTop);

    //为了实现不同高度线的X轴，需要再增加一个X轴，采用不同的样式
    let xAxisTopSmall: any = wrapper
      .select('svg.xAxisTop')
      .selectAll('g.xAxisTopSmall')
      .data([null]);
    const xAxisTopEnterSmall: any = xAxisTopSmall
      .enter()
      .append('g')
      .attr('class', 'axis xAxisTopSmall');

    xAxisTopSmall = xAxisTopSmall.merge(xAxisTopEnterSmall);

    setXAxisTopSmall(xAxisTopSmall);

    let xAxisBottomSmall: any = wrapper
      .select('svg.xAxisBottom')
      .selectAll('g.xAxisBottomSmall')
      .data([null]);
    const xAxisBottomEnterSmall: any = xAxisBottomSmall
      .enter()
      .append('g')
      .attr('class', 'axis xAxisBottomSmall');

    xAxisBottomSmall = xAxisBottomSmall.merge(xAxisBottomEnterSmall);

    setXAxisBottomSmall(xAxisBottomSmall);

    // bottom
    let xAxisBottom: any = wrapper
      .select('svg.xAxisBottom')
      .selectAll('g.xAxisBottom')
      .data([null]);
    const xAxisBottomEnter: any = xAxisBottom.enter().append('g').attr('class', 'axis xAxisBottom');

    xAxisBottom = xAxisBottom.merge(xAxisBottomEnter);

    setXAxisBottom(xAxisBottom);
  }, [wrapper, size]);

  // 头部 x 轴
  useEffect(() => {
    if (!xAxisTop || !xScale || !xAxisTopSmall) return;
    const currentTicks = xScale.ticks();
    const tickTimeGap = currentTicks[1].getTime() - currentTicks[0].getTime();
    // 根据时间跨度选择日期格式
    let timeFormat;
    if (tickTimeGap >= 365 * 24 * 60 * 60 * 1000) {
      timeFormat = (time: any) => {
        const year = d3.timeFormat('%Y')(time);
        return `${year}年`;
      };
    } else if (tickTimeGap >= 30 * 24 * 60 * 60 * 1000) {
      timeFormat = (time: any) => {
        const year = d3.timeFormat('%Y')(time);
        const month = d3.timeFormat('%m')(time);
        return `${year}-${month}`;
      };
    } else if (tickTimeGap >= 24 * 60 * 60 * 1000) {
      timeFormat = d3.timeFormat('%m-%d'); // 月-日
    } else if (tickTimeGap >= 60 * 60 * 1000) {
      timeFormat = (time: any) => {
        const month = d3.timeFormat('%m')(time);
        const day = d3.timeFormat('%d')(time);
        const hour = d3.timeFormat('%H')(time);
        const minute = d3.timeFormat('%M')(time);
        return hour == '00' ? `${month}-${day}` : `${hour}:${minute}`;
      };
    } else if (tickTimeGap >= 60 * 1000) {
      timeFormat = d3.timeFormat('%H:%M'); // 时:分
    } else {
      timeFormat = d3.timeFormat('%M:%S'); // 分:秒
    }
    xAxisTop.call(axisTop(xScale).ticks(10).tickSize(12).tickFormat(timeFormat));
    xAxisTopSmall.call(axisTop(xScale).ticks(100).tickSize(6));
    xAxisTopSmall.selectAll('text').remove();
    xAxisTop
      .selectAll('.tick text')
      .attr('fill', 'black')
      .attr('font-size', 12)
      .attr('dy', '-4px')
      .style('text-anchor', 'start');
  }, [xAxisTop, xScale, xAxisTopSmall]);

  // 底部 x 轴
  useEffect(() => {
    if (!xAxisBottom || !xScale || !xAxisBottomSmall) return;
    xAxisBottom.call(axisBottom(xScale));
    const currentTicks = xScale.ticks();
    const tickTimeGap = currentTicks[1].getTime() - currentTicks[0].getTime();
    // 根据时间跨度选择日期格式
    let timeFormat;
    if (tickTimeGap >= 365 * 24 * 60 * 60 * 1000) {
      timeFormat = (time: any) => {
        const year = d3.timeFormat('%Y')(time);
        return `${year}年`;
      };
    } else if (tickTimeGap >= 30 * 24 * 60 * 60 * 1000) {
      timeFormat = (time: any) => {
        const year = d3.timeFormat('%Y')(time);
        const month = d3.timeFormat('%m')(time);
        return `${year}-${month}`;
      };
    } else if (tickTimeGap >= 24 * 60 * 60 * 1000) {
      timeFormat = d3.timeFormat('%m-%d'); // 月-日
    } else if (tickTimeGap >= 60 * 60 * 1000) {
      timeFormat = (time: any) => {
        const month = d3.timeFormat('%m')(time);
        const day = d3.timeFormat('%d')(time);
        const hour = d3.timeFormat('%H')(time);
        const minute = d3.timeFormat('%M')(time);
        return hour == '00' ? `${month}-${day}` : `${hour}:${minute}`;
      };
    } else if (tickTimeGap >= 60 * 1000) {
      timeFormat = d3.timeFormat('%H:%M'); // 时:分
    } else {
      timeFormat = d3.timeFormat('%M:%S'); // 分:秒
    }
    xAxisBottom.call(axisBottom(xScale).ticks(10).tickSize(12).tickFormat(timeFormat));
    xAxisBottomSmall.call(axisBottom(xScale).ticks(100).tickSize(6));
    xAxisBottomSmall.selectAll('text').remove();
    xAxisBottom
      .selectAll('.tick text')
      .attr('fill', 'black')
      .attr('font-size', 12)
      .attr('dy', '12px')
      .style('text-anchor', 'start');
  }, [xAxisBottom, xScale, xAxisBottomSmall]);

  return {
    xAxisTop,
    // xAxisBottom,
  };
};
