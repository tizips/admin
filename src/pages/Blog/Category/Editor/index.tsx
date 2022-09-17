import {Form, Input, InputNumber, Modal, notification, Select, Spin, Tabs, Upload} from 'antd';
import React, {useEffect, useState} from 'react';
import {doCreate, doUpdate} from './service';
import {doUpload} from '@/services/helper';
import Constants from '@/utils/Constants';
import {InboxOutlined} from '@ant-design/icons';
import BraftEditor from 'braft-editor';
// @ts-ignore
import ColorPicker from 'braft-extensions/dist/color-picker';
// @ts-ignore
import Table from 'braft-extensions/dist/table';

import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/color-picker.css';
import 'braft-extensions/dist/table.css';
import styles from './index.less';
import {doBlogCategoryByInformation, doBlogCategoryByParents} from "@/services/blog";

BraftEditor.use(ColorPicker({theme: 'dark'}));
BraftEditor.use(Table({columnResizable: true}));

const Editor: React.FC<APIBlogCategory.Props> = (props) => {

  const [former] = Form.useForm<APIBlogCategory.Former>();
  const [parents, setParents] = useState<APIData.Enable[]>([]);
  const [loading, setLoading] = useState<APIBlogCategory.Loading>({});
  const [type, setType] = useState('basic');

  const parent = Form.useWatch('parent', former)
  const uri = Form.useWatch('uri', former)
  const page = Form.useWatch('is_page', former)
  const pictures = Form.useWatch('pictures', former)

  const onUpload = (e: any) => {

    if (Array.isArray(e)) return e;

    if (e.file.status == 'uploading' && e.file.percent == 0) {

      setLoading({...loading, upload: true})

    } else if (e.file.status == 'done') {

      setLoading({...loading, upload: false})

      const {uid, response}: { uid: string; response: APIResponse.Response<API.Upload> } = e.file;

      if (response.code !== Constants.Success) {
        notification.error({message: response.message});
      } else {
        e.fileList?.forEach((item: any) => {
          if (item.uid == uid) item.thumbUrl = response.data.url;
        });
      }
    }

    return e && e.fileList;
  };

  const onUploadByEditor = (param: any) => {
    doUpload(param.file, '/category/content')
      .then((response: APIResponse.Response<API.Upload>) => {
        param.progress(100);
        if (response.code !== Constants.Success) {
          param.error({msg: response.message});
        } else {
          param.success({url: response.data.url, meta: {alt: response.data.name}});
        }
      });
  };

  const toParents = () => {
    setLoading({...loading, parents: true});
    doBlogCategoryByParents()
      .then((response: APIResponse.Response<APIData.Enable[]>) => {
        if (response.code === Constants.Success) {
          setParents(response.data);
        }
      })
      .finally(() => setLoading({...loading, parents: false}));
  };

  const toCreate = (params: any) => {
    setLoading({...loading, confirmed: true});
    doCreate(params)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({message: response.message});
        } else {
          notification.success({message: '添加成功'});

          if (!params.parent) setParents([]);
          if (props.onCreate) props.onCreate();
          if (props.onSave) props.onSave();
        }
      })
      .finally(() => setLoading({...loading, confirmed: false}));
  };

  const toUpdate = (params: any) => {
    setLoading({...loading, confirmed: true});
    doUpdate(props.params?.id, params)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({message: response.message});
        } else {
          notification.success({message: '修改成功'});
          if (!params.parent) setParents([]);
          if (props.onUpdate) props.onUpdate();
          if (props.onSave) props.onSave();
        }
      })
      .finally(() => setLoading({...loading, confirmed: false}));
  };

  const toChangeUri = (e: any) => {
    const {value} = e.target;
    if (!value) {
      former.setFieldsValue({is_page: 2, is_comment: 2});
    }
  };

  const toChangeIsPage = (value: number) => {
    if (value == 2) {
      former.setFieldsValue({is_comment: 2});
    }
  };

  const onSubmit = (values: APIBlogCategory.Former) => {

    const params: APIBlogCategory.Editor = {
      parent: values.parent,
      name: values.name,
      title: values.title,
      keyword: values.keyword,
      description: values.description,
      uri: values.uri,
      order: values.order,
      is_page: values.is_page,
      is_comment: values.is_comment,
      is_enable: values.is_enable,
    };

    if (values.pictures && values.pictures.length > 0) {
      params.picture = values.pictures[0].thumbUrl
    }
    if (values.is_page === 1) params.page = values.page.toHTML();

    if (props.params) toUpdate(params);
    else toCreate(params);
  };

  const onFailed = (change: any) => {

    const {values}: { values: APIBlogCategory.Former } = change

    if (!values.name || values.parent && !values.uri) {
      setType('basic')
    } else if ((values.parent || values.uri) && !values.pictures) {
      setType('other');
    }
  }

  const toInitByUpdate = () => {

    setLoading({...loading, information: true});

    doBlogCategoryByInformation(props.params?.id)
      .then((response: APIResponse.Response<APIBlog.Category>) => {
        if (response.code !== Constants.Success) {
          notification.error({message: response.message});
          if (props.onCancel) props.onCancel();
        } else {

          const data: APIBlogCategory.Former = {
            parent: response.data.parent || undefined,
            name: response.data.name,
            title: response.data.title,
            keyword: response.data.keyword,
            description: response.data.description,
            uri: response.data.uri,
            order: response.data.order,
            pictures: undefined,
            is_page: response.data.is_page,
            is_comment: response.data.is_comment,
            is_enable: response.data.is_enable,
            page: BraftEditor.createEditorState(response.data.page),
          };

          if (response.data.picture) {
            data.pictures = [{key: 1, thumbUrl: response.data.picture}]
          }

          former.setFieldsValue(data);
        }
      })
      .finally(() => setLoading({...loading, information: false}));
  };

  const toInit = () => {

    setType('basic');

    if (props.params) {
      toInitByUpdate();
    } else {
      former.setFieldsValue({
        parent: undefined,
        name: undefined,
        title: undefined,
        keyword: undefined,
        description: undefined,
        uri: undefined,
        pictures: undefined,
        order: 50,
        is_page: 2,
        is_comment: 2,
        is_enable: 1,
        page: BraftEditor.createEditorState(null),
      });
    }
  };

  useEffect(() => {
    if (props.visible) {
      toInit();
      if (parents.length <= 0) toParents();
    }
  }, [props.visible]);

  return (
    <Modal
      width={660}
      open={props.visible}
      closable={false}
      centered
      maskClosable={false}
      onOk={former.submit}
      onCancel={props.onCancel}
      confirmLoading={loading.confirmed}
    >
      <Spin spinning={!!loading.information} tip="数据加载中...">
        <Form form={former} onFinishFailed={onFailed} onFinish={onSubmit} labelCol={{span: 2}}>
          <Tabs activeKey={type} onChange={(activeKey) => setType(activeKey)}>
            <Tabs.TabPane key="basic" tab="基本" forceRender>
              <Form.Item label="栏目" name="parent">
                <Select allowClear disabled={!!props.params?.children} loading={loading.parents}>
                  {
                    parents?.map((item) => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))
                  }
                </Select>
              </Form.Item>
              <Form.Item label="名称" name="name" rules={[{required: true}, {max: 32}]}>
                <Input/>
              </Form.Item>
              <Form.Item label="链接" name="uri" rules={[{required: !!parent}, {max: 32}]}>
                <Input onChange={toChangeUri} allowClear/>
              </Form.Item>
              <Form.Item label="排序" name="order" rules={[{required: true}, {type: 'number'}]}>
                <InputNumber min={1} max={99} controls={false} style={{width: '100%'}}/>
              </Form.Item>
              <Form.Item label="启用" name="is_enable" rules={[{required: true}]}>
                <Select>
                  <Select.Option value={1}>是</Select.Option>
                  <Select.Option value={2}>否</Select.Option>
                </Select>
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane key="seo" tab="SEO" forceRender>
              <Form.Item name="title" label="标题" rules={[{max: 255}]}>
                <Input/>
              </Form.Item>
              <Form.Item name="keyword" label="词组" rules={[{max: 255}]}>
                <Input.TextArea rows={3} showCount maxLength={255}/>
              </Form.Item>
              <Form.Item name="description" label="描述" rules={[{max: 255}]}>
                <Input.TextArea rows={3} showCount maxLength={255}/>
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane key="other" tab="其他" forceRender>
              <Form.Item label='图片' name='pictures' valuePropName='fileList' getValueFromEvent={onUpload}
                         rules={[{required: !!parent || !!uri}]}>
                <Upload
                  name="file"
                  listType="picture-card"
                  className={styles.upload}
                  showUploadList={false}
                  maxCount={1}
                  action={Constants.Upload}
                  headers={{Authorization: localStorage.getItem(Constants.Authorization) as string}}
                  data={{dir: '/category/banner'}}
                >
                  <Spin spinning={!!loading.upload} tip="Loading...">
                    {
                      pictures && pictures.length > 0 ? (
                        <img src={pictures[0].thumbUrl} alt="avatar" style={{width: '100%'}}/>
                      ) : (
                        <div className="upload-area">
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined className="upload-icon"/>
                          </p>
                          <p className="ant-upload-text">点击进行上传</p>
                          <p className="ant-upload-hint">Support for a single upload.</p>
                        </div>
                      )}
                  </Spin>
                </Upload>
              </Form.Item>
              <Form.Item label="单页" name="is_page" rules={[{required: true}]}>
                <Select onChange={toChangeIsPage} disabled={!uri}>
                  <Select.Option value={1}>单页面</Select.Option>
                  <Select.Option value={2}>列表页</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="留言" name="is_comment" rules={[{required: true}]}>
                <Select disabled={!uri || page === 0}>
                  <Select.Option value={1}>开启</Select.Option>
                  <Select.Option value={2}>关闭</Select.Option>
                </Select>
              </Form.Item>
            </Tabs.TabPane>
            {
              page === 1 &&
              <Tabs.TabPane key="page" tab="内容" forceRender>
                <Form.Item
                  name="page"
                  rules={[
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
                  ]}
                >
                  <BraftEditor
                    media={{uploadFn: onUploadByEditor}}
                    controls={Constants.Controls()}
                    className={styles.braft}
                  />
                </Form.Item>
              </Tabs.TabPane>
            }
          </Tabs>
        </Form>
      </Spin>
    </Modal>
  );
};

export default Editor;
