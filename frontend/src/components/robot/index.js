import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Row, Col, message, Spin, Modal, notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import {
  selectRobot,
  changeRobotStateAsync,
  resetRobotState,
  resetFailedCount,
  getRobotCurrentStateAsync,
} from '../../stores/robotSlice';
import { ROBOT_ACTIONS } from '../../utils/constants';
import { HistoryTable } from '../../components/historyTable';

import './index.css';

const antIcon = (
  <LoadingOutlined style={{ fontSize: 40, position: 'absolute' }} spin />
);

export const Robot = () => {
  const dispatch = useDispatch();
  const robotSliceState = useSelector(selectRobot);
  const [isModalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    if (
      robotSliceState.error.error_message !== null &&
      robotSliceState.error.status_code !== null
    ) {
      message.error(robotSliceState.error.error_message);
    }
    if (robotSliceState.failedCount === 3) {
      setModalVisible(true);
    }
  }, [robotSliceState.error]);

  React.useEffect(() => {
    if (robotSliceState.currentState === 'FAILED') {
      notification.info({
        placement: 'topRight',
        duration: 4,
        message: 'Current State is `FAILED`',
        description:
          'Please note current state is `FAILED`! Please repair the robot by clicking `REPAIR` button',
      });
    }
  }, [robotSliceState.currentState]);

  // action - start | place | repair | done | reset
  const handleStartClick = () => {
    dispatch(changeRobotStateAsync(ROBOT_ACTIONS.START));
  };

  const handlePlaceClick = () => {
    dispatch(changeRobotStateAsync(ROBOT_ACTIONS.PLACE));
  };

  const handleRepairClick = () => {
    dispatch(changeRobotStateAsync(ROBOT_ACTIONS.REPAIR));
  };

  const handleDoneClick = () => {
    dispatch(changeRobotStateAsync(ROBOT_ACTIONS.DONE));
  };

  const handlerResetClick = () => {
    dispatch(resetFailedCount());
    dispatch(changeRobotStateAsync(ROBOT_ACTIONS.RESET));
  };

  const handleGetCurrentState = () => {
    dispatch(getRobotCurrentStateAsync());
  };

  const handleModalOk = () => {
    dispatch(resetFailedCount());
    dispatch(changeRobotStateAsync(ROBOT_ACTIONS.REPAIR));
    setModalVisible(false);
  };

  return (
    <section className="robot__wrapper">
      <Row>
        <span className="robot__button">
          <Button onClick={handleStartClick}>START</Button>
        </span>
        <span className="robot__button">
          <Button onClick={handlePlaceClick}>PLACE</Button>
        </span>
        <span className="robot__button">
          <Button onClick={handleRepairClick}>REPAIR</Button>
        </span>
        <span className="robot__button">
          <Button onClick={handleDoneClick}>DONE</Button>
        </span>
        <span className="robot__button">
          <Button onClick={handlerResetClick}>RESET</Button>
        </span>
      </Row>

      <Row>
        <Button
          className="robot__button current__state"
          type="primary"
          onClick={handleGetCurrentState}
        >
          Get Current State
        </Button>
      </Row>

      <br />

      <Row>
        <Col>
          Robot current state:{' '}
          {robotSliceState.loading ? (
            <Spin indicator={antIcon} />
          ) : (
            <strong>
              {robotSliceState.currentState
                ? robotSliceState.currentState
                : 'Please click START button to start'}
            </strong>
          )}
        </Col>
      </Row>

      <Row>
        <span className="robot__failedCount">
          The number of failures: {robotSliceState.failedCount || 0}
        </span>
      </Row>

      <Row>
        <Col span={24}>
          <div className="robot__history">
            <span>History:</span>
          </div>
          <HistoryTable />
        </Col>
      </Row>

      <Modal
        title="INFO"
        visible={isModalVisible}
        onOk={handleModalOk}
        okText="Repair"
        cancelText
      >
        <p>
          The robot reaches the `FAILED` state for the third time, please put
          the robot in `REPAIR` mode.
        </p>
      </Modal>
    </section>
  );
};
