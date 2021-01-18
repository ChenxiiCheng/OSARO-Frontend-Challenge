import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { DATA_ACTIONS, ENDPOINT } from '../utils/constants';

export const robotSlice = createSlice({
  name: 'robot',
  initialState: {
    loading: false,
    currentState: '',
    failedCount: 0,
    commands: [],
    error: {
      status_code: null,
      error_message: null,
    },
  },
  reducers: {
    setCurrentState: (state, { payload: { current_state } }) => {
      state.loading = false;
      state.currentState = current_state;
    },
    setCurrentStateFailed: (state, { payload }) => {
      const { error_message, status_code } = JSON.parse(payload);
      state.loading = false;
      state.failedCount += 1;
      state.currentState = state.currentState;
      state.error = { error_message, status_code };
    },
    setStateInitilization: (state, { payload }) => {
      state.loading = true;
      state.failedCount = state.failedCount;
      if (payload) {
        state.commands = [
          ...state.commands,
          { timestamp: JSON.stringify(dayjs(new Date())), command: payload },
        ];
      }
      state.currentState = state.currentState;
      state.error.status_code = null;
      state.error.error_message = null;
    },
    resetRobotState: (state, { payload }) => {
      state.loading = false;
      state.currentState = '';
      state.error.status_code = null;
      state.error.error_message = null;
    },
    resetFailedCount: (state, { payload }) => {
      state.failedCount = 0;
    },
  },
});

export const {
  setCurrentState,
  setCurrentStateFailed,
  setStateInitilization,
  resetRobotState,
  resetFailedCount,
} = robotSlice.actions;

/**
 * @desc: Get robot current state
 * @method: GET
 */
export const getRobotCurrentStateAsync = () => async (dispatch) => {
  dispatch(setStateInitilization('get current state'));
  const res = await fetch(`${ENDPOINT}/state`);
  const data = await res.json();
  dispatch(setCurrentState(data));
};

/**
 * @desc: Change robot state action
 * @method: POST
 * @param: {string} action - start | place | repair | done | reset
 */
export const changeRobotStateAsync = (action) => async (dispatch) => {
  try {
    dispatch(setStateInitilization(action));
    const res = await fetch(`${ENDPOINT}/action`, {
      method: 'POST',
      body: JSON.stringify({ action: action }),
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });
    const data = await res.json();

    if (data?.status_code) {
      if (data?.status_code === '200') {
        dispatch(setCurrentState(data));
      } else if (data?.status_code === '500') {
        dispatch(setCurrentStateFailed(JSON.stringify(data)));
      } else if (data?.status_code === '503') {
        dispatch(changeRobotStateAsync(action));
      }
    }
  } catch (error) {
    dispatch(setCurrentStateFailed(JSON.stringify(error)));
  }
};

export const selectRobot = (state) => state.robot;

export default robotSlice.reducer;
