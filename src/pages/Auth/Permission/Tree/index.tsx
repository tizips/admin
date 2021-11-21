import React, { useEffect, useState } from 'react';
import { Button, Card, Col, notification, Popconfirm, Row, Table, Tag, Tooltip } from 'antd';
import Constants from '@/utils/Constants';
import moment from 'moment';
import { DeleteOutlined, FormOutlined, HighlightOutlined, RedoOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import Editor from '@/pages/Auth/Permission/Editor';
import { doDelete, doPaginate } from './service';
import styles from './index.less';
import Loop from '@/utils/Loop';

const methods = {
  GET: '#87d068',
  POST: '#2db7f5',
  PUT: '#6F2CF2',
  DELETE: '#f50',
};

const Tree: React.FC = () => {

  const { initialState } = useModel('@@initialState');

  const [editor, setEditor] = useState<APIAuthPermissions.Data | undefined>();
  const [loadingPaginate, setLoadingPaginate] = useState(false);
  const [visible, setVisible] = useState<APIAuthPermissions.Visible>({});
  const [data, setData] = useState<APIAuthPermissions.Data[]>();

  const doLoop = (items: APIAuthPermissions.Data[], callback: (item: APIAuthPermissions.Data) => void) => {
    for (const temp of items) {
      callback(temp);
      if (temp.children) doLoop(temp.children, callback);
    }
  };

  const toPaginate = () => {
    setLoadingPaginate(true);
    doPaginate()
      .then((response: APIResponse.Response<APIAuthPermissions.Data[]>) => {
        if (response.code === Constants.Success) {
          const temp: APIAuthPermissions.Data[] = response.data;
          doLoop(temp, item => item.created_at = moment(item.created_at));
          setData(temp);
        }
      })
      .finally(() => setLoadingPaginate(false));
  };

  const onDelete = (record: APIAuthPermissions.Data) => {
    // @ts-ignore
    let temp: APIAuthPermissions.Data[] = [...data];
    Loop.byId(temp, record.id, (item: APIAuthPermissions.Data) => item.loading_deleted = true);
    setData(temp);

    doDelete(record.id)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '权限删除成功！' });
          toPaginate();
        }
      })
      .finally(() => {
        temp = [...data];
        Loop.byId(temp, record.id, (item: APIAuthPermissions.Data) => item.loading_deleted = false);
        setData(temp);
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({ ...visible, editor: true });
  };

  const onUpdate = (record: APIAuthPermissions.Data) => {
    setEditor(record);
    setVisible({ ...visible, editor: true });
  };

  const onSuccess = () => {
    setVisible({ ...visible, editor: false });
    toPaginate();
  };

  const onCancel = () => {
    setVisible({ ...visible, editor: false });
  };

  useEffect(() => {
    toPaginate();
  }, []);

  return (
    <>
      <Card title='权限列表' extra={<Row gutter={10}>
        <Col>
          <Tooltip title='刷新'>
            <Button type='primary' icon={<RedoOutlined />} onClick={toPaginate} loading={loadingPaginate} />
          </Tooltip>
        </Col>
        {
          initialState?.permissions && initialState?.permissions?.indexOf('auth.permission.create') >= 0 ?
            <Col>
              <Tooltip title='创建'>
                <Button type='primary' icon={<FormOutlined />} onClick={onCreate} />
              </Tooltip>
            </Col> : <></>
        }
      </Row>}>
        <Table dataSource={data} rowKey='id' size='small'
               loading={loadingPaginate} pagination={false}>
          <Table.Column title='名称' dataIndex='name' />
          <Table.Column title='标识' render={(record: APIAuthPermissions.Data) => (
            <span className={styles.slug} style={{ color: initialState?.settings?.primaryColor }}>{record.slug}</span>
          )} />
          <Table.Column title='接口' render={(record: APIAuthPermissions.Data) => (
            <>
              <Tag color={record.method && methods ? methods[record.method] : '#2db7f5'}>
                {record.method?.toUpperCase()}
              </Tag>
              <Tag className={styles.path} style={{ color: initialState?.settings?.primaryColor }}>{record.path}</Tag>
            </>
          )} />
          {
            initialState?.permissions && initialState?.permissions?.indexOf('auth.permission.update') >= 0 &&
            initialState?.permissions && initialState?.permissions?.indexOf('auth.permission.delete') >= 0 ?
              <Table.Column title='操作' align='right' width={100} render={(record: APIAuthPermissions.Data) => (
                <>
                  {
                    initialState?.permissions && initialState?.permissions?.indexOf('auth.permission.delete') >= 0
                    && !record.children ?
                      <Popconfirm
                        title='确定要删除该数据?'
                        placement='leftTop'
                        onConfirm={() => onDelete(record)}
                      >
                        <Tooltip title='删除'>
                          <Button type='link' danger icon={<DeleteOutlined />} loading={record.loading_deleted} />
                        </Tooltip>
                      </Popconfirm> : <></>
                  }
                  {
                    initialState?.permissions && initialState?.permissions?.indexOf('auth.permission.update') >= 0 ||
                    initialState?.permissions && initialState?.permissions?.indexOf('auth.permission.create') >= 0 ?
                      <Tooltip title='编辑'>
                        <Button type='link' icon={<HighlightOutlined />} onClick={() => onUpdate(record)} />
                      </Tooltip> : <></>
                  }
                </>
              )} /> : <></>
          }

        </Table>
      </Card>
      {
        initialState?.permissions && initialState?.permissions?.indexOf('auth.permission.create') >= 0 ?
          <Editor visible={visible.editor} params={editor} methods={methods} onSave={onSuccess}
                  onCancel={onCancel} /> : <></>
      }
    </>
  );
};

export default Tree;