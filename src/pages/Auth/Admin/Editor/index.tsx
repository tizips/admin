import { Form, Input, Modal, notification, Select, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { doCreate, doRoleBySelf, doUpdate } from './service';
import Constants from '@/utils/Constants';
import Pattern from '@/utils/Pattern';
import { useModel } from '@@/plugin-model/useModel';

const Editor: React.FC<APIAuthAdmin.Props> = (props) => {
  const init: APIAuthAdmin.Former = {
    username: '',
    nickname: '',
    password: '',
    signature: '',
    roles: [],
  };

  const { initialState } = useModel('@@initialState');

  const [former] = Form.useForm();
  const [roles, setRoles] = useState<APIAuthAdmin.Role[]>([]);
  const [loading, setLoading] = useState<APIAuthAdmin.Loading>({});

  const toPermissions = () => {
    setLoading({ ...loading, permission: true });
    doRoleBySelf()
      .then((response: APIResponse.Response<APIAuthAdmin.Role[]>) => {
        if (response.code === Constants.Success) {
          setRoles(response.data);
        }
      })
      .finally(() => setLoading({ ...loading, permission: false }));
  };

  const toCreate = (params: any) => {
    setLoading({ ...loading, confirmed: true });
    doCreate(params)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '添加成功' });

          if (props.onCreate) props.onCreate();
          if (props.onSave) props.onSave();
        }
      })
      .finally(() => setLoading({ ...loading, confirmed: false }));
  };

  const toUpdate = (params: any) => {
    setLoading({ ...loading, confirmed: true });
    doUpdate(props.params?.id, params)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '修改成功' });

          if (props.onUpdate) props.onUpdate();
          if (props.onSave) props.onSave();
        }
      })
      .finally(() => setLoading({ ...loading, confirmed: false }));
  };

  const onSubmit = (values: APIAuthAdmin.Former) => {
    const params: APIAuthAdmin.Editor = {
      username: values.username,
      nickname: values.nickname,
      password: values.password,
      signature: values.signature,
      roles: values.roles,
    };

    if (props.params) toUpdate(params);
    else toCreate(params);
  };

  const toInit = () => {
    const data = init;
    if (props.params) {
      data.nickname = props.params.nickname;
      data.signature = props.params.signature;
      props.params.roles?.forEach((item) => data.roles?.push(item.id));
    }
    former.setFieldsValue(data);
  };

  useEffect(() => {
    if (props.visible) {
      toInit();
      if (roles.length <= 0) toPermissions();
    }
  }, [props.visible]);

  return (
    <Modal
      title={props.params ? '编辑' : '创建'}
      visible={props.visible}
      centered
      onOk={former.submit}
      maskClosable={false}
      onCancel={props.onCancel}
      confirmLoading={loading.confirmed}
    >
      <Form form={former} initialValues={init} onFinish={onSubmit} labelCol={{ span: 4 }}>
        {!props.params ? (
          <Form.Item
            label="账号"
            name="username"
            rules={[{ required: true }, { pattern: RegExp(Pattern.ADMIN_USERNAME) }]}
          >
            <Input />
          </Form.Item>
        ) : (
          <></>
        )}
        <Form.Item label="昵称" name="nickname" rules={[{ required: true }, { max: 20 }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: !props.params }, { pattern: RegExp(Pattern.ADMIN_PASSWORD) }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item label="角色" name="roles" rules={[{ required: true }]}>
          <Select mode="multiple" optionLabelProp="label">
            {roles.map((item) => (
              <Select.Option
                key={item.id}
                value={item.id}
                label={<Tag color={initialState?.settings?.primaryColor}>{item.name}</Tag>}
              >
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="签名" name="signature" rules={[{ max: 255 }]}>
          <Input.TextArea rows={2} maxLength={255} showCount />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Editor;
