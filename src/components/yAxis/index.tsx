import React, { useContext } from 'react';
import { Tree } from 'antd';
import { GraphTimeService } from '../graph-timeline/service';
import 'antd/es/tree/style';

// TODO 暂时先只渲染两层分组
export default () => {
  const { size, currZoomAllNodesTree, expandedKeys } = useContext(GraphTimeService);

  return (
    <div className="axis yAxis" style={{ width: size?.width, height: size?.height }}>
      {!size.height ? null : (
        <Tree
          treeData={currZoomAllNodesTree}
          height={size?.height}
          expandedKeys={expandedKeys}
          blockNode
        />
      )}
    </div>
  );
};
