import { Button, Space } from 'antd';
import React, { useEffect } from 'react';
import { useModel } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import { DesktopOutlined } from '@ant-design/icons';
import { doPermission } from '@/services/account';
import Constants from '@/utils/Constants';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (initialState.account) {
      doPermission().then((response: APIResponse.Response<string[]>) => {
        if (response.code === Constants.Success)
          setInitialState({ ...initialState, permissions: response.data });
      });
    }
  }, [initialState.account]);

  return (
    <Space className={className}>
      <Button type="link" icon={<DesktopOutlined />} href="https://uper.io" target="_blank" />
      <Avatar />
    </Space>
  );
};

export default GlobalHeaderRight;
