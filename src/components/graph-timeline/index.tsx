import React, { CSSProperties, useRef } from 'react';
import { useService, GraphTimeService } from './service';
import Graph from './graph';
import type { IServiceProps } from './service';

import './index.less';
import { INNER_PADDING } from '../../common/constants';

export interface IProps extends Omit<IServiceProps, 'containerRef'> {
  className?: string;
  style?: CSSProperties;
}

const GraphTimeline: React.FC<IProps> = ({
  className = '',
  style = {},
  yAxis: yStyleSettings,
  xAxis: xStyleSettings,
  ...data
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const value = useService({
    containerRef,
    xAxis: xStyleSettings,
    yAxis: yStyleSettings,
    ...data,
  });

  const { size } = value;

  return (
    <GraphTimeService.Provider value={value}>
      <div className={`graph-timeline-outer ${className}`} ref={containerRef} style={{ ...style }}>
        <div
          className="graph-timeline-inner"
          style={{
            paddingRight: INNER_PADDING[1],
            paddingLeft: INNER_PADDING[3],
          }}
        >
          <svg className="xAxis xAxisTop"></svg>
          <div className="graph-timeline" style={{ width: size?.width, height: size?.height }}>
            <Graph />
          </div>
          <svg className="xAxis xAxisBottom"></svg>
        </div>
      </div>
    </GraphTimeService.Provider>
  );
};

export default GraphTimeline;
