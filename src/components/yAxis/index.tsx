import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { Tree } from 'antd';
import { GraphTimeService } from '../graph-timeline/service';
import 'antd/es/tree/style';

// TODO 暂时先只渲染两层分组
export default () => {
  const { size, currZoomAllNodesTree, expandedKeys, setExpandedKeys, setTranslateY } =
    useContext(GraphTimeService);
  const treeRef = useRef<any>();
  const yAxisId = useMemo(() => `gt-y-${Date.now()}`, []);

  useEffect(() => {
    const treeInner = document.querySelector(
      `#${yAxisId} .ant-tree-list-holder-inner`,
    ) as HTMLDivElement;
    const checkTranslateY = () => {
      if (!treeInner) {
        setTranslateY(0);
        return;
      }
      const translateYValue = treeInner.style.transform;

      const translateYMatch = translateYValue.match(/translateY\((-?\d+(\.\d+)?)px\)/);
      const newTranslateY = translateYMatch ? parseFloat(translateYMatch[1]) : 0;
      setTranslateY(-newTranslateY);
    };
    const observer = new MutationObserver(checkTranslateY);

    observer.observe(treeInner, { attributeFilter: ['style'] });

    return () => observer.disconnect();
  }, [treeRef.current]);

  return (
    <div className="axis yAxis" id={yAxisId} style={{ width: size?.width, height: size?.height }}>
      <Tree
        ref={treeRef}
        treeData={currZoomAllNodesTree}
        height={size?.height}
        expandedKeys={expandedKeys}
        blockNode
        onExpand={(expandedKeys) => setExpandedKeys(expandedKeys)}
        fieldNames={{
          title: 'label',
          key: 'id',
        }}
        rootStyle={{
          lineHeight: '24px',
        }}
      />
    </div>
  );
};
