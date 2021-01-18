import React from 'react';
import { Row, Col } from 'antd';

import { NavigationBar } from './components/navigationBar';
import { LeftMenu } from './components/leftMenu';
import { Robot } from './components/robot';

import './App.css';

function App() {
  return (
    <>
      <nav className="app__wrapper">
        <NavigationBar />
      </nav>
      <div className="app__main">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={8}>
            <LeftMenu />
          </Col>
          <Col span={14}>
            <Robot />
          </Col>
        </Row>
      </div>
    </>
  );
}

export default App;
