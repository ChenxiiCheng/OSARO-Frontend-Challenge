import React from 'react';
import { Menu, Switch, Divider } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';

import { GITHUB, LINKEDIN, PORTFOLIO } from '../../utils/constants';

const { SubMenu } = Menu;

export const LeftMenu = () => {
  const [mode, setMode] = React.useState('inline');
  const [theme, setTheme] = React.useState('light');

  const changeMode = (value) => {
    setMode(value ? 'vertical' : 'inline');
  };

  const changeTheme = (value) => {
    setTheme(value ? 'dark' : 'light');
  };

  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  const handleMenuClick = ({ key }) => {
    if (key === '1') {
      openInNewTab(GITHUB);
    } else if (key === '2') {
      openInNewTab(LINKEDIN);
    } else if (key === '3') {
      openInNewTab(PORTFOLIO);
    }
  };

  return (
    <>
      <Switch onChange={changeMode} /> Mode
      <Divider type="vertical" />
      <Divider type="vertical" />
      <Switch onChange={changeTheme} /> Theme
      <br />
      <br />
      <Menu
        style={{ width: 256, minHeight: 300 }}
        defaultSelectedKeys={['0']}
        defaultOpenKeys={['sub1']}
        mode={mode}
        theme={theme}
        onClick={handleMenuClick}
      >
        <SubMenu
          key="sub1"
          icon={<AppstoreOutlined />}
          title="Author - Chenxi Cheng"
        >
          <Menu.Item key="1">GitHub</Menu.Item>
          <Menu.Item key="2">LinkedIn</Menu.Item>
          <Menu.Item key="3">Portfolio</Menu.Item>
        </SubMenu>
      </Menu>
    </>
  );
};
