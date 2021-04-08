import fetch from 'isomorphic-fetch';
import {
  Message
} from 'view-design';
import {
  paramsStringify
} from './util';
import store from '@/store';
import {
  getStorage
} from './storage';

const REQUEST_TIMEOUT = 120; // 请求超时时间：秒
let errNumber = 0 // 报错计算器
let overTimeNumber = 0 // 登录权限超时计数器
// 向服务器发送请求返回的状态
function checkStatus(response) {
  // 请求成功
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  }

  // 重新登录
  if (response.status === 401 || response.status === 403) {
    store.dispatch('user/logout');
    return false;
  }

  const error = new Error(response.statusText);
  Object.assign(error, {
    response,
  });
  throw error;
}

// 对response 数据进行处理
function httpResponse(res) {
  if (res) {
    switch (res.code) {
      case 1:
        return res;
        // 登录超时
      case 10001:
        store.commit('user/clearSession');
        store.commit('permission/clearPermissions', {}, {
          root: true
        });
        // 多个登录权限超时请求只展示一个提示弹框
        if (overTimeNumber < 1) {
          Message.error({
            content: res.message,
            onClose: () => {
              overTimeNumber = 0
            }
          });
        }
        overTimeNumber++
        return false;
      default:
        // 多个报错请求只展示一个提示弹框
        if (errNumber < 1) {
          Message.error({
            content: res.message,
            duration: 5,
            onClose: () => {
              errNumber = 0
            }
          });
        }
        errNumber++
        break;
    }
    return false;
  }

  Message.error({
    content: '网络错误，请刷新重试！',
    duration: 3,
  });
  return false;
}

/**
 * Requests a URL, return a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options = {}) {
  const {
    method = 'get', headers = {}, params = {}, body = {},
  } = options;
  // url
  const requestUrl = Object.keys(params).length ?
    `${process.env.VUE_APP_REQUEST_BASE_URL}${url}?${paramsStringify(params)}` :
    `${process.env.VUE_APP_REQUEST_BASE_URL}${url}`;

  // token
  const t = getStorage('token') || '';

  // options
  let requestOptions = {};

  // get请求（body中不允许有数据）
  if (method.toUpperCase() === 'GET') {
    requestOptions = {
      method,
      headers: new Headers({
        t,
        ...headers,
      }),
    };
  } else {
    let requestBody = {};
    // 通过判断传入的参数是否是formData, 判断是否是表单/上传文件
    if (Object.prototype.toString.call(body) === '[object FormData]') {
      requestBody = body;
      requestOptions = {
        method,
        headers: new Headers({
          t,
          ...headers,
        }),
        body: requestBody,
      };
    } else {
      // 正常json请求
      requestBody = JSON.stringify(body);
      requestOptions = {
        method,
        headers: new Headers({
          'content-type': 'application/json',
          t,
          ...headers,
        }),
        body: requestBody,
      };
    }
  }

  return Promise.race([
      fetch(requestUrl, {
        ...requestOptions,
        credentials: 'include'
      }),
      new Promise((resolve, reject) => {
        setTimeout(() => reject(new Error('request timeout')), REQUEST_TIMEOUT * 1000);
      })
    ])
    .then(checkStatus)
    .then(data => httpResponse(data))
    .catch(() => {
      Message.error({
        content: '网络错误，请刷新重试！',
        duration: 4,
      });
    });
}
