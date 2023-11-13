import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { useSize } from 'ahooks';
import type { INoPaddingSize } from '../types';
import { INNER_PADDING } from '../common/constants';

export default (target: RefObject<HTMLDivElement>) => {
  const size = useSize(target);
  const [contentSize, setContentSize] = useState<INoPaddingSize>({ width: 0, height: 0 });

  useEffect(() => {
    if (!size || !target.current) return;
    const { width: originWidth, height: originHeight } = size;
    // 上下的 X 轴，左侧的 Y 轴
    const [top, right, bottom, left] = INNER_PADDING;

    const height = Math.max(originHeight - top - bottom, 50);
    const width = Math.max(originWidth - right - left, 50);

    setContentSize({
      width: width,
      height: height,
    });
  }, [size, target]);

  return contentSize;
};
