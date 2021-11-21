import { Form, Input, Modal, notification, Select, Slider, Spin, Tabs, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { doCreate, doInformation, doParents, doUpdate } from './service';
import { doUpload } from '@/services/helper';
import Constants from '@/utils/Constants';
import { InboxOutlined } from '@ant-design/icons';
import BraftEditor from 'braft-editor';
// @ts-ignore
import ColorPicker from 'braft-extensions/dist/color-picker';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/color-picker.css';
import styles from './index.less';

BraftEditor.use(ColorPicker({ theme: 'dark' }));

const Editor: React.FC<APISiteCategory.Props> = (props) => {

  const init: APISiteCategory.Former = {
    parent: undefined,
    name: '',
    title: '',
    keyword: '',
    description: '',
    uri: '',
    no: 50,
    is_page: 0,
    is_comment: 0,
    is_enable: 1,
    page: BraftEditor.createEditorState(null),
  };

  const [former] = Form.useForm();
  const [parents, setParents] = useState<APISiteCategory.Category[]>([]);
  const [loading, setLoading] = useState<APISiteCategory.Loading>({});
  const [type, setType] = useState('basic');
  const [isPage, setIsPage] = useState(init.is_page);
  const [picture, setPicture] = useState<string | undefined>();
  const [parent, setParent] = useState<number | undefined>();
  const [uri, setUri] = useState<string | undefined>();
  const [validator, setValidator] = useState<APISiteCategory.Validators>({});

  const toParents = () => {
    setLoading({ ...loading, parents: true });
    doParents()
      .then((response: APIResponse.Response<APISiteCategory.Category[]>) => {
        if (response.code === Constants.Success) {
          setParents(response.data);
        }
      })
      .finally(() => setLoading({ ...loading, parents: false }));
  };

  const toCreate = (params: any) => {
    setLoading({ ...loading, confirmed: true });
    doCreate(params)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
        } else {
          notification.success({ message: '添加成功' });

          if (!params.parent) setParents([]);
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
          if (!params.parent) setParents([]);
          if (props.onUpdate) props.onUpdate();
          if (props.onSave) props.onSave();
        }
      })
      .finally(() => setLoading({ ...loading, confirmed: false }));
  };

  const onValidator = () => {
    setValidator({});
    const values: APISiteCategory.Former = former.getFieldsValue();
    if (!values.name) {
      setType('basic');
    } else if (values.is_page === 1 && values.page?.isEmpty()) {
      setType('page');
    }
    former.submit();
  };

  const onSubmit = (values: APISiteCategory.Former) => {
    if (parent && !picture || uri && !picture) {
      setType('other');
      setValidator({ ...validator, picture: { status: 'error', message: '图片不能为空' } });
    } else {
      const params: APISiteCategory.Editor = {
        parent: values.parent,
        name: values.name,
        picture,
        title: values.title,
        keyword: values.keyword,
        description: values.description,
        uri: values.uri,
        no: values.no,
        is_page: values.is_page,
        is_comment: values.is_comment,
        is_enable: values.is_enable,
      };

      if (values.is_page === 1) params.page = values.page.toHTML();

      if (props.params) toUpdate(params);
      else toCreate(params);
    }
  };

  const toUpload = (e: any) => {

    if (Array.isArray(e)) return e;

    const { status, response }: { status: string; response: APIResponse.Response<API.Upload> } = e.file;
    if (status === 'uploading' && !loading.upload) setLoading({ ...loading, upload: true });
    else if (status == 'done') {
      setLoading({ ...loading, upload: false });
      if (response.code !== Constants.Success) {
        notification.error({ message: response.message });
      } else {
        setValidator({ ...validator, picture: undefined });
        setPicture(response.data.url);
      }
    }
    return e && e.fileList;
  };

  const toUploadByEditor = (param: any) => {
    doUpload(param.file, '/category/content')
      .then((response: APIResponse.Response<API.Upload>) => {
        param.progress(100);
        if (response.code !== Constants.Success) {
          param.error({ msg: response.message });
        } else {
          param.success({ url: response.data.url, meta: { alt: response.data.name } });
        }
      });
  };

  const toChangeUri = (e: any) => {
    const { value } = e.target;
    setUri(value);
    const values: APISiteCategory.Former = former.getFieldsValue();
    if (values.is_comment !== init.is_comment || values.is_page) {
      setIsPage(init.is_page);
      former.setFieldsValue({ is_page: init.is_page, is_comment: init.is_comment });
    }
  };

  const toChangeIsPage = (value: number) => {
    setIsPage(value);
    const values: APISiteCategory.Former = former.getFieldsValue();
    if (values.is_comment !== init.is_comment) former.setFieldsValue({ is_comment: init.is_comment });
  };

  const toInitByUpdate = () => {
    setLoading({ ...loading, information: true });
    doInformation(props.params?.id)
      .then((response: APIResponse.Response<APISiteCategory.Information>) => {
        if (response.code !== Constants.Success) {
          notification.error({ message: response.message });
          if (props.onCancel) props.onCancel();
        } else {

          setType('basic');

          const data: APISiteCategory.Former = {
            parent: response.data.parent || undefined,
            name: response.data.name,
            title: response.data.title,
            keyword: response.data.keyword,
            description: response.data.description,
            uri: response.data.uri,
            no: response.data.no,
            is_page: response.data.is_page,
            is_comment: response.data.is_comment,
            is_enable: response.data.is_enable,
            page: BraftEditor.createEditorState(response.data.page),
          };

          setIsPage(response.data.is_page);
          setParent(response.data.parent || undefined);
          setPicture(response.data.picture);
          setUri(response.data.uri);

          former.setFieldsValue(data);
        }
      })
      .finally(() => setLoading({ ...loading, information: false }));
  };

  const toInit = () => {
    setPicture(undefined);
    setParent(undefined);
    setUri(undefined);
    setIsPage(init.is_page);

    if (!props.params) former.setFieldsValue(init);
    else toInitByUpdate();
  };

  useEffect(() => {
    if (props.visible) {
      toInit();
      if (parents.length <= 0) toParents();
    }
  }, [props.visible]);

  return (
    <Modal width={660} visible={props.visible} closable={false} centered onOk={onValidator}
           maskClosable={false} onCancel={props.onCancel} className={styles.modal}
           confirmLoading={loading.confirmed}>
      <Spin spinning={!!loading.information} tip='数据加载中...'>
        <Form form={former} initialValues={init} onFinish={onSubmit}
              labelCol={{ span: 3 }}>
          <Tabs activeKey={type} onChange={activeKey => setType(activeKey)}>
            <Tabs.TabPane key='basic' tab='基本' forceRender>
              <Form.Item label='栏目' name='parent'>
                <Select allowClear onChange={(value: number) => setParent(value)}
                        disabled={!!props.params?.children}
                        loading={loading.parents}>
                  {
                    parents.map(item => (
                      <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
              <Form.Item label='名称' name='name' rules={[{ required: true }, { max: 20 }]}>
                <Input />
              </Form.Item>
              <Form.Item label='链接' name='uri' rules={[{ required: !!parent }, { max: 60 }]}>
                <Input onChange={toChangeUri} />
              </Form.Item>
              <Form.Item label='排序' name='no' rules={[{ required: true }, { type: 'number' }]}>
                <Slider min={1} max={100} />
              </Form.Item>
              <Form.Item label='启用' name='is_enable' rules={[{ required: true }]}>
                <Select>
                  <Select.Option value={1}>是</Select.Option>
                  <Select.Option value={0}>否</Select.Option>
                </Select>
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane key='seo' tab='SEO' forceRender>
              <Form.Item name='title' label='标题' rules={[{ max: 60 }]}>
                <Input />
              </Form.Item>
              <Form.Item name='keyword' label='词组' rules={[{ max: 60 }]}>
                <Input />
              </Form.Item>
              <Form.Item name='description' label='描述' rules={[{ max: 255 }]}>
                <Input.TextArea rows={2} showCount maxLength={255} />
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane key='other' tab='其他' forceRender>
              <Form.Item label='图片' validateStatus={validator.picture?.status} help={validator.picture?.message}
                         required={!!parent || !!uri}>
                <Form.Item noStyle>
                  <Upload
                    name='file'
                    listType='picture-card'
                    className={styles.upload}
                    showUploadList={false}
                    action={Constants.Upload}
                    headers={{ Authorization: localStorage.getItem(Constants.Authorization) as string }}
                    data={{ dir: '/category' }}
                    onChange={toUpload}
                  >
                    <Spin spinning={!!loading.upload} tip='Loading...'>
                      {
                        picture ?
                          <img src={picture} alt='avatar' style={{ width: '100%' }} /> : <div className='upload-area'>
                            <p className='ant-upload-drag-icon'>
                              <InboxOutlined className='upload-icon' />
                            </p>
                            <p className='ant-upload-text'>点击进行上传</p>
                            <p className='ant-upload-hint'>Support for a single upload.</p>
                          </div>
                      }
                    </Spin>
                  </Upload>
                </Form.Item>
              </Form.Item>
              <Form.Item label='单页' name='is_page' rules={[{ required: true }]}>
                <Select onChange={toChangeIsPage} disabled={!uri}>
                  <Select.Option value={1}>单页面</Select.Option>
                  <Select.Option value={0}>列表页</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label='留言' name='is_comment' rules={[{ required: true }]}>
                <Select disabled={!uri || isPage === 0}>
                  <Select.Option value={1}>开启</Select.Option>
                  <Select.Option value={0}>关闭</Select.Option>
                </Select>
              </Form.Item>
            </Tabs.TabPane>
            {
              isPage === 1 ?
                <Tabs.TabPane key='page' tab='内容' forceRender>
                  <Form.Item name='page' rules={[
                    {
                      required: true,
                      validator: (rule, value) => {
                        if (value.isEmpty()) {
                          return Promise.reject('请输入内容');
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}>
                    <BraftEditor media={{ uploadFn: toUploadByEditor }} controls={Constants.Controls()}
                                 className={styles.braft} />
                  </Form.Item>
                </Tabs.TabPane> : <></>
            }
          </Tabs>
        </Form>
      </Spin>
    </Modal>
  );
};

export default Editor;