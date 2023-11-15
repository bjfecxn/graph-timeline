import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { Tree } from 'antd';
import { GraphTimeService } from '../graph-timeline/service';
import 'antd/es/tree/style';

export default () => {
  const { size, currZoomAllNodesTree, expandedKeys, setExpandedKeys, setTranslateY } =
    useContext(GraphTimeService);
  const treeRef = useRef<any>();
  const yAxisId = useMemo(() => `gt-y-${Date.now()}`, []);

  useEffect(() => {
    const treeInner = document.querySelector(`#${yAxisId} .ant-tree-list-holder`) as HTMLDivElement;

    const onScroll = () => {
      setTranslateY(-(treeInner.scrollTop || 0));
    };

    treeInner.addEventListener('scroll', onScroll);
    return () => {
      treeInner.removeEventListener('scroll', onScroll);
    };
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
        titleRender={(nodeData: any) => {
          return (
            <>
              <span className="gt-y-title">
                <span className="gt-y-label">{nodeData.label || '--'}</span>
                {!nodeData.children || !expandedKeys?.includes(nodeData.id) ? (
                  <>
                    <span className="gt-y-icon"></span>
                  </>
                ) : null}
              </span>
              <span className="gt-y-line"></span>
            </>
          );
        }}
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
