import React, { useState } from 'react';
import { history } from '@@/core/history';

import { Row, Col, Input, Checkbox, Button, Form, notification, Alert } from 'antd';
import leftImage from '@/static/img/design-team.png';
import { useModel } from '@@/plugin-model/useModel';
import { doLogin } from './serviec';

import style from './index.less';

const Login: React.FC<{}> = () => {

  const [error, setError] = useState<string>('');
  const [login] = useState<ApiLogin.LoginParams>({
    username: '',
    password: '',
    remember: false,
  });
  const { initialState, setInitialState } = useModel('@@initialState');

  const toUserInfo = async () => {
    const response = await initialState?.toUserinfo?.();

    if (response) {
      setInitialState({ ...initialState, Account: response.data as API.Userinfo });
    }
  };

  /**
   * 此方法会跳转到 redirect 参数所在的位置
   */

  const goto = () => {
    if (!history) return;
    setTimeout(() => {
      const { query } = history.location;
      const { redirect } = query as {
        redirect: string;
      };
      history.push(redirect || '/');
    }, 10);
  };

  const onSubmit = async (values: ApiLogin.LoginParams) => {
    try {
      const response = await doLogin(values);

      if (response.code !== 20000) {
        setError(response.message);
        return;
      }

      notification.success({
        message: '登录成功，欢迎回来',
      });

      await toUserInfo();
      goto();

      setError('');
    } catch (e) {
      setError('登录失败，请稍后重试');
    }
  };

  return (
    <div className={style.container}>
      <Row justify="center">
        <Col md={14} sm={16} xs={20} className={style.loginBox}>
          <Row className={style.loginContent}>
            <Col sm={0} md={0} lg={12} className={style.leftLogin}>
              <img src={leftImage} className={style.leftImage} alt="" width="100%" />
            </Col>
            <Col lg={12} md={24} sm={24} className={style.rightLogin}>
              <Row>
                <Col xs={24}>
                  <h2 className={style.title}>登录</h2>
                  {
                    error ? <Alert className={style.error} type='error' message={error} showIcon />
                      : <p className={style.summary}>描述描述</p>
                  }
                </Col>
                < Col xs={24}>
                  <Form
                    name="basic"
                    initialValues={login}
                    onFinish={onSubmit}
                  >
                    <Form.Item
                      name="username"
                      rules={[
                        { required: true, message: '请输入您的用户名！' },
                        { pattern: new RegExp('^[a-zA-Z0-9_\\-]{4,20}$'), message: '用户名输入错误！' },
                      ]}
                    >
                      <Input size='large' placeholder='Username' />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      rules={[
                        { required: true, message: '请输入您的登录密码！' },
                        {
                          pattern: new RegExp('^[a-zA-Z0-9_\\-!#@]{6,20}$'),
                          message: '请输入 6~20 位包含英文数字 _-!@#& 的字符',
                        },
                      ]}
                    >
                      <Input.Password size='large' placeholder='Password' />
                    </Form.Item>
                    <Row>
                      <Col span={12}>
                        <Form.Item
                          name="remember" valuePropName="checked">
                          <Checkbox>记住登录</Checkbox>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Button type='link' className={style.forget}>忘记密码</Button>
                      </Col>
                    </Row>
                    <Button type="primary" size='large' htmlType="submit" block>
                      立即登录
                    </Button>
                  </Form>
                </ Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Login;