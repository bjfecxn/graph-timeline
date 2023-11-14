import React, { useContext } from 'react';
import { Tree, TreeProps, ConfigProvider } from 'antd';
import { GraphTimeService } from '../graph-timeline/service';
import 'antd/es/tree/style';

// TODO 暂时先只渲染两层分组
export default () => {
  const { size, currZoomAllNodesTree, expandedKeys, setExpandedKeys } =
    useContext(GraphTimeService);

  const onExpand: TreeProps['onExpand'] = (expandedKeys, { expanded, node }) => {
    setExpandedKeys(expandedKeys);
  };

  return (
    <div className="axis yAxis" style={{ width: size?.width, height: size?.height }}>
      {!size.height ? null : (
        <Tree
          treeData={currZoomAllNodesTree}
          height={size?.height}
          expandedKeys={expandedKeys}
          blockNode
          onExpand={onExpand}
          rootStyle={{
            lineHeight: '24px',
          }}
        />
      )}
    </div>
  );
};
