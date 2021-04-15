import React, {
  FC,
  useState,
  useEffect,
  MouseEvent,
} from 'react';
import { Tree, Space, Typography, Input } from 'antd';
import { DataNode } from 'antd/lib/tree';
import { FormOutlined } from '@ant-design/icons';
import { treeDatas } from './datasource'
import 'antd/dist/antd.css';
import styles from './index.less'
const { Text } = Typography;
interface IIndexProps {

}

const Index: FC<IIndexProps> = ({

}: IIndexProps) => {
  const [treeData, setTreeData] = useState<DataNode[]>(treeDatas);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const onExpand = (expandedKeys: React.Key[]) => {
    setExpandedKeys(expandedKeys);
  };

  const updateData = (key: string | number, arr: DataNode[], value?:string) => {
    arr.map((item: DataNode) => {
      if (item.key === key) {
        item.isEditable = true
        if(value){
          item.textTitle = value
        }
      } else {
        item.isEditable = false
      }
      if (item.children && item.children?.length > 0) {
        updateData(key, item.children, value)
      }
    })
    setTreeData([...arr])
    return arr;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: string | number) => {
    updateData(key,treeData,e.target.value)
  }

  const onEdit = (e: MouseEvent, key: string | number) => {
    e.stopPropagation();
    updateData(key,treeData)
  };

  const onPressEnter = () => {
    const data = JSON.parse(JSON.stringify(treeData).replace(/isEditable/g, 'false'))
    setTreeData(data)
  }

  const renderTreeNode = (item: DataNode) => {
    return (
      <>
        {item.isEditable ? (
          <Space>
            <Input defaultValue={item.textTitle} onChange={(e) => handleChange(e, item.key)} onPressEnter={onPressEnter}/>
            <FormOutlined
              style={{ color: '#1890ff' }}
              onClick={(e) => onEdit(e, item.key)}
            />
          </Space>
        ) : (
            <Space>
              <Text>{item.textTitle}</Text>
              <FormOutlined
                style={{ color: '#1890ff' }}
                onClick={(e) => onEdit(e, item.key)}
              />
            </Space>
          )}
      </>
    );
  };

  const initTree = (data: DataNode[]) => {
    return data.map((item: DataNode) => {
      item.title = renderTreeNode(item)
      if (item.children) {
        initTree(item.children)
      }
    })
  }

  useEffect(() => {
    initTree(treeData)
  }, [treeData])

  return (
    <div className={styles.indexWrap}>
      <Text>树形控件组件</Text>
      <Tree
        showLine={{ showLeafIcon: false }}
        treeData={treeData}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
      />
    </div>
  );
};

export default Index;
