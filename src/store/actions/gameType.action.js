import { authConstant, gameTypeConstant } from "./../constants";
import axios from "axios";

export const GetAllGameType = (page) => {
  return async (dispatch) => {
    dispatch({ type: gameTypeConstant.GET_GAME_TYPE_REQUEST });
    try {
      const token = sessionStorage.getItem("userToken");
      let result;
      if (page) {
        result = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/v1/api/gametypes?page=${page}&limit=10`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
      } else {
        result = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/v1/api/gametypes`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
      }
      const { data } = result;
      dispatch({
        type: gameTypeConstant.GET_GAME_TYPE_SUCCESS,
        payload: {
          results: data.results,
          page: data.page,
          totalPages: data.totalPages,
        },
      });
    } catch (error) {
      if (error.response.data.code === 401) {
        sessionStorage.clear();
        dispatch({
          type: authConstant.SESSION_EXPIRE,
          payload: { err: "Session has expired" },
        });
      } else {
        dispatch({
          type: gameTypeConstant.GET_GAME_TYPE_FAILURE,
          payload: { err: error.response.data.errors[0].message },
        });
      }
    }
  };
};

export const LeaveGame = (body) => {
  return async (dispatch) => {
    dispatch({ type: gameTypeConstant.LEAVE_GAME_REQUEST });
    try {
      const token = sessionStorage.getItem("userToken");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/v1/api/games/leave`,
        body,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      dispatch({
        type: gameTypeConstant.LEAVE_GAME_SUCCESS,
        payload: "Game has been left",
      });
    } catch (error) {
      if (error.response.data.code === 401) {
        sessionStorage.clear();
        dispatch({
          type: authConstant.SESSION_EXPIRE,
          payload: { err: "Session has expired" },
        });
      } else {
        dispatch({
          type: gameTypeConstant.LEAVE_GAME_FAILURE,
          payload: { err: error.response.data.errors[0].message },
        });
      }
    }
  };
};
