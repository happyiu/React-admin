import actionTypes from './actionTypes'
import { loginRequest } from '../requests'

const startLogin = () => {
  return {
    type: actionTypes.START_LOGIN
  }
}

const loginSuccess = (userInfo) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    payload: {
      userInfo
    }
  }
}

const loginFailed = () => {
  window.localStorage.removeItem('authToken')
  window.sessionStorage.removeItem('authToken')
  window.localStorage.removeItem('userInfo')
  window.sessionStorage.removeItem('userInfo')
  return {
    type: actionTypes.LOGIN_FAILED
  }
}

export const changeAvatar = (avatarUrl) => {
  return {
    type: actionTypes.CHANGE_AVATAR,
    payload: {
      avatarUrl
    }
  }
}

export const logout = () => {
  return dispatch => {
    dispatch(loginFailed())
  }
}

export const login = (userInfo) => {
  return dispatch => {
    dispatch(startLogin())
    loginRequest(userInfo)
      .then(resp => {
        const {
          authToken,
          ...user
        } = resp.data.data
        if(resp.data.code === 200){
          if(userInfo.remember === true) {
            window.localStorage.setItem('userInfo',JSON.stringify(user))
            window.localStorage.setItem('authToken',authToken)
          } else{
            window.sessionStorage.setItem('authToken',authToken)
          }
          dispatch(loginSuccess(resp.data.data))
        } else{
          dispatch(loginFailed())
        }
      })
  }
}