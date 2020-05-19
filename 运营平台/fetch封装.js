import fetch from "dva/fetch";
import { notification } from "antd";
import router from "umi/router";
import hash from "hash.js";
import { Base64 } from "js-base64";
import { getUrlParams, formatePageUrl } from "@utils/utils";
import { clientId, clientSecret } from "../defaultSettings";
import { getToken } from "./authority";

const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};

const publicUrl = [
  "/pms/uaa/api/oauth/password",
  "/pms/uaa/api/oauth/password-noCaptcha",
  "/pms/uaa/api/oauth/verification-code",
];

const checkStatus = async (response, timerId) => {
  clearTimeout(timerId);
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  }

  let errortext = codeMessage[response.status] || response.statusText;
  if (response.status === 400) {
    await response
      .clone()
      .json()
      .then(({ errorKey, title }) => {
        errortext = errorKey ? title : "字段验证异常";
      });
  }

  notification.error({
    className: "notificationStyle",
    message: `出错了`,
    description: errortext,
  });

  const error = new Error(errortext);
  error.status = response.status;
  error.response = response;
  throw error;
};

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then((content) => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};

const handleHeader = (url, response) => {
  const total = response.headers.get("X-Total-Count");

  if (total) {
    let result;
    const { size, page } = getUrlParams(url);
    return response
      .clone()
      .text()
      .then((content) => {
        result = {
          list: JSON.parse(content),
          pagination: {
            total: +total,
            pageSize: +size,
            current: 1 * page + 1,
          },
        };
        return result;
      });
  }

  return response;
};

const handleSpecific = (response, newOptions) => {
  // 为了解决 handleHeader方法中，total情况下 返回对象这种情况
  if (!response.headers) {
    return Promise.resolve(response);
  }
  // delete时 Response的body中为空，使用json() 报返回rejected状态Promise
  // 204 是延续之前的代码
  //
  const contentType = response.headers.get("Content-Type");
  const isTextHtmlHeader = contentType && contentType.match(/text\/html/i);
  if (
    newOptions.method === "DELETE" ||
    response.status === 204 ||
    isTextHtmlHeader
  ) {
    return response.text();
  }

  return response.json();
};

const fetchTimeout = (ms = 5000) => {
  const controller = new AbortController();
  const defaultTime = 5000;
  const timerId = setTimeout(() => {
    controller.abort();
  }, ms || defaultTime);
  return {
    controller,
    timerId,
  };
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, option) {
  const handledUrl = formatePageUrl(url);

  const options = {
    ...option,
  };
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint =
    handledUrl + (options.body ? JSON.stringify(options.body) : "");
  const hashcode = hash.sha256().update(fingerprint).digest("hex");

  const defaultOptions = {
    credentials: "include",
  };
  const { controller, timerId } = fetchTimeout(option && option.timeout);
  const newOptions = {
    ...defaultOptions,
    signal: controller.signal,
    ...options,
  };

  if (publicUrl.indexOf(handledUrl) > -1) {
    newOptions.headers = {
      ...newOptions.headers,
      // 客户端认证  将应用发给后台，以便后台知道具体应用
      Authorization: `Basic ${Base64.encode(`${clientId}:${clientSecret}`)}`,
    };
  } else {
    const token = getToken();
    if (token) {
      newOptions.headers = {
        ...newOptions.headers,
        // token鉴权
        Authorization: token,
      };
    }
  }

  if (
    newOptions.method === "POST" ||
    newOptions.method === "PUT" ||
    newOptions.method === "DELETE"
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: "application/json",
        "Content-Type": "application/json;charset=utf-8",
        ...newOptions.headers,
      };
      if (newOptions.body instanceof Object) {
        newOptions.body = JSON.stringify(newOptions.body);
      }
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: "application/json",
        ...newOptions.headers,
      };
    }
  }

  const expirys = options.expirys && 60;
  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }

  return fetch(handledUrl, newOptions)
    .then((response) => checkStatus(response, timerId))
    .then((response) => cachedSave(response, hashcode))
    .then((response) => handleHeader(handledUrl, response))
    .then((response) => handleSpecific(response, newOptions))
    .catch(({ name, status, response }) => {
      if (name === "AbortError") {
        notification.error({
          className: "notificationStyle",
          message: `出错了`,
          description: "请求超时",
        });
      }
      if (status === 401) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: "login/logout",
        });
      }
      // environment should not be used
      if (status === 403) {
        router.push("/exception/403");
      }
      if (status <= 504 && status >= 500) {
        router.push("/exception/500");
      }
      // 请求超时时，response 是undefined
      return Promise.reject(response || "timeout abort error");
    });
}
