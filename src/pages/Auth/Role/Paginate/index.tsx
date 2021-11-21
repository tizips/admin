import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Dropdown, Menu, notification, Popconfirm, Row, Table, Tooltip } from 'antd';
import Constants from '@/utils/Constants';
import moment from 'moment';
import { FormOutlined, MoreOutlined, RedoOutlined } from '@ant-design/icons';
import { useModel } from '@@/plugin-model/useModel';
import Editor from '@/pages/Auth/Role/Editor';
import { doDelete, doPaginate } from './service';
import Loop from '@/utils/Loop';

const Paginate: React.FC = () => {

  const { initialState } = useModel('@@initialState');

  const [editor, setEditor] = useState<APIAuthRoles.Data | undefined>();
  const [loadingPaginate, setLoadingPaginate] = useState(false);
  const [visible, setVisible] = useState<APIAuthRoles.Visible>({});
  const [data, setData] = useState<APIAuthRoles.Data[]>();
  const [paginate, setPaginate] = useState<APIData.Paginate>({});

  const toPaginate = () => {
    setLoadingPaginate(true);
    doPaginate()
      .then((response: APIResponse.Paginate<APIAuthRoles.Data[]>) => {
        if (response.code === Constants.Success) {
          setPaginate({ size: response.data.size, page: response.data.page, total: response.data.total });
          if (response.data.data) response.data.data.forEach(item => item.created_at = moment(item.created_at));
          setData(response.data.data);
        }
      })
      .finally(() => setLoadingPaginate(false));
  };

  const onDelete = (record: APIAuthRoles.Data) => {
    // @ts-ignore
    let temp: APIAuthRoles.Data[] = [...data];
    Loop.byId(temp, record.id, (item: APIAuthRoles.Data) => item.loading_deleted = true);
    setData(temp);

    doDelete(record.id)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '角色删除成功！' });
          toPaginate();
        }
      })
      .finally(() => {
        temp = [...data];
        Loop.byId(temp, record.id, (item: APIAuthRoles.Data) => item.loading_deleted = false);
        setData(temp);
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({ ...visible, editor: true });
  };

  const onUpdate = (record: APIAuthRoles.Data) => {
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

      <Card title='角色列表' extra={<Row gutter={10}>
        <Col>
          <Tooltip title='刷新'>
            <Button type='primary' icon={<RedoOutlined />} onClick={toPaginate} loading={loadingPaginate} />
          </Tooltip>
        </Col>
        {
          initialState?.permissions && initialState?.permissions?.indexOf('auth.role.create') >= 0 ?
            <Col>
              <Tooltip title='创建'>
                <Button type='primary' icon={<FormOutlined />} onClick={onCreate} />
              </Tooltip>
            </Col> : <></>
        }
      </Row>}>
        <Table dataSource={data} rowKey='id'
               loading={loadingPaginate}
               pagination={{
                 current: paginate.page,
                 pageSize: paginate.size,
                 total: paginate.total,
               }}>
          <Table.Column title='名称' dataIndex='name' />
          <Table.Column title='简介' dataIndex='summary' />
          <Table.Column title='创建时间' render={(record: APIAuthRoles.Data) => (
            moment.isMoment(record.created_at) && record.created_at.format('YYYY/MM/DD HH:mm')
          )} />
          {
            initialState?.permissions && initialState?.permissions?.indexOf('auth.role.update') >= 0 &&
            initialState?.permissions && initialState?.permissions?.indexOf('auth.role.delete') >= 0 ?
              <Table.Column title='操作' align='center' width={100} render={(record: APIAuthAdmins.Data) => (
                <Dropdown overlay={<Menu>
                  {
                    initialState?.permissions && initialState?.permissions?.indexOf('auth.role.update') >= 0 ?
                      <Menu.Item key='update'>
                        <Button type='link' onClick={() => onUpdate(record)}>编辑</Button>
                      </Menu.Item> : <></>
                  }
                  {
                    initialState?.permissions && initialState?.permissions?.indexOf('auth.role.delete') >= 0 ?
                      <Menu.Item key='create'>
                        <Popconfirm
                          title='确定要删除该数据?'
                          placement='leftTop'
                          onConfirm={() => onDelete(record)}
                        >
                          <Button type='link' danger loading={record.loading_deleted}>删除</Button>
                        </Popconfirm>
                      </Menu.Item> : <></>
                  }
                </Menu>}>
                  <Button type='link' icon={<MoreOutlined />} />
                </Dropdown>
              )} /> : <></>
          }
        </Table>
      </Card>
      {
        initialState?.permissions && initialState?.permissions?.indexOf('auth.role.create') >= 0 ||
        initialState?.permissions && initialState?.permissions?.indexOf('auth.role.update') >= 0 ?
          <Editor visible={visible.editor} params={editor} onSave={onSuccess}
                  onCancel={onCancel} /> : <></>
      }
    </>
  );
};

export default Paginate;