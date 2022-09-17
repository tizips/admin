import React, {useEffect, useState} from 'react';
import {
  Button,
  Card,
  Col,
  notification,
  Popconfirm,
  Row,
  Switch,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import Constants from '@/utils/Constants';
import {FormOutlined, RedoOutlined} from '@ant-design/icons';
import {useModel} from 'umi';
import Editor from '@/pages/Blog/Category/Editor';
import {doDelete, doEnable, doTree} from './service';
import Loop from '@/utils/Loop';
import Authorize from "@/components/Authorize";
import Enable from "@/components/Enable";

const pages = {
  1: {
    color: '#f50',
    label: '单页',
  },
  2: {
    color: '#2db7f5',
    label: '列表',
  },
};

const Tree: React.FC = () => {

  const {initialState} = useModel('@@initialState');

  const [editor, setEditor] = useState<APISiteCategories.Data | undefined>();
  const [loadingPaginate, setLoadingPaginate] = useState(false);
  const [visible, setVisible] = useState<APISiteCategories.Visible>({});
  const [data, setData] = useState<APISiteCategories.Data[]>();
  const [expandable, setExpandable] = useState<number[]>([]);

  const doLoop = (
    items: APISiteCategories.Data[],
    callback: (item: APISiteCategories.Data) => void,
  ) => {
    for (const temp of items) {
      callback(temp);
      if (temp.children) doLoop(temp.children, callback);
    }
  };

  const toPaginate = () => {
    setLoadingPaginate(true);
    doTree()
      .then((response: APIResponse.Response<APISiteCategories.Data[]>) => {
        if (response.code === Constants.Success) {
          const temp: APISiteCategories.Data[] = response.data;
          const ids: number[] = [];
          doLoop(temp, (item) => {
            if (item.id) ids.push(item.id);
          });
          setExpandable(ids);
          setData(temp);
        }
      })
      .finally(() => setLoadingPaginate(false));
  };

  const onDelete = (record: APISiteCategories.Data) => {

    if (data) {
      const temp: APISiteCategories.Data[] = [...data];
      doLoop(temp, (item) => {
        if (item.id === record.id) item.loading_deleted = true;
      });
      setData(temp);
    }

    doDelete(record.id)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({message: response.message});
        } else {
          notification.success({message: '栏目删除成功！'});
          toPaginate();
        }
      })
      .finally(() => {
        if (data) {
          const temp: APISiteCategories.Data[] = [...data];
          Loop.ById(temp, record.id, (item: APISiteCategories.Data) => (item.loading_deleted = false));
          setData(temp);
        }
      });
  };

  const onEnable = (record: APISiteCategories.Data) => {
    if (data) {
      const temp: APISiteCategories.Data[] = [...data];
      doLoop(temp, (item) => {
        if (item.id === record.id) item.loading_enable = true;
      });
      setData(temp);
    }

    const enable: APIRequest.Enable = {id: record.id, enable: record.is_enable === 1 ? 0 : 1};

    doEnable(enable)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({message: response.message});
        } else {
          notification.success({message: `栏目${enable.enable === 1 ? '启用' : '禁用'}成功！`});
          if (data) {
            const temp = [...data];
            doLoop(temp, (item) => {
              if (item.id === record.id) item.is_enable = enable.enable;
            });
            setData(temp);
          }
        }
      })
      .finally(() => {
        if (data) {
          const temp = [...data];
          doLoop(temp, (item) => {
            if (item.id === record.id) item.loading_enable = false;
          });
          setData(temp);
        }
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({...visible, editor: true});
  };

  const onUpdate = (record: APISiteCategories.Data) => {
    setEditor(record);
    setVisible({...visible, editor: true});
  };

  const onSuccess = () => {
    setVisible({...visible, editor: false});
    toPaginate();
  };

  const onCancel = () => {
    setVisible({...visible, editor: false});
  };

  useEffect(() => {
    toPaginate();
  }, []);

  return (
    <>
      <Card
        title="栏目列表"
        extra={
          <Row gutter={10}>
            <Col>
              <Tooltip title="刷新">
                <Button
                  type="primary"
                  icon={<RedoOutlined/>}
                  onClick={toPaginate}
                  loading={loadingPaginate}
                />
              </Tooltip>
            </Col>
            <Authorize permission='blog.category.create'>
              <Col>
                <Tooltip title="创建">
                  <Button type="primary" icon={<FormOutlined/>} onClick={onCreate}/>
                </Tooltip>
              </Col>
            </Authorize>
          </Row>
        }
      >
        <Table
          dataSource={data}
          rowKey="id"
          size="small"
          indentSize={50}
          expandable={{
            expandedRowKeys: expandable,
            expandIcon: () => <></>,
          }}
          loading={loadingPaginate}
          pagination={false}
        >
          <Table.Column title="名称" dataIndex="name"/>
          <Table.Column title="序号" align="center" render={(record: APISiteCategories.Data) => (
            <Tag color={initialState?.settings?.primaryColor}>{record.order}</Tag>
          )}
          />
          <Table.Column title="类型" align="center" render={(record: APISiteCategories.Data) =>
            record.uri && record.is_page !== 1 ? (
              <Tag color="#87d068">终列</Tag>
            ) : record.is_page != undefined && pages[record.is_page] ? (
              <Tag color={pages[record.is_page].color}>{pages[record.is_page].label}</Tag>
            ) : (
              record.is_page
            )
          }
          />
          <Table.Column title="启用" align="center" render={(record: APISiteCategories.Data) => (
            <Authorize permission='blog.category.enable' fallback={<Enable is_enable={record.is_enable}/>}>
              <Switch size="small" checked={record.is_enable === 1} onClick={() => onEnable(record)}
                      loading={record.loading_enable}/>
            </Authorize>
          )}
          />
          <Table.Column title="操作" align="center" width={100} render={(record: APISiteCategories.Data) => (
            <>
              <Authorize permission='blog.category.update'>
                <Button type="link" onClick={() => onUpdate(record)}>编辑</Button>
              </Authorize>
              <Authorize permission='blog.category.delete'>
                <Popconfirm title="确定要删除该数据?" placement="leftTop" onConfirm={() => onDelete(record)}>
                  <Button type="link" danger loading={record.loading_deleted}>删除</Button>
                </Popconfirm>
              </Authorize>
            </>
          )}
          />
        </Table>
      </Card>
      {
        visible.editor !== undefined &&
        <Editor visible={visible.editor} params={editor} onSave={onSuccess} onCancel={onCancel}/>
      }
    </>
  );
};

export default Tree;
