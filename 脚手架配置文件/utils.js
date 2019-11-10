//判断是否是ie（包括edge）
export const judgeIE = key => {
  const status = "open" in document.createElement("details");
  return !status;
};

/******************************** 正则表达式相关 ******************************/

/**
 *  手机号判断规则
 * @param
 */
export const isPhoneByRex = phone => {
  return /^1[3456789]\d{9}$/.test(phone);
};

/**
 * 验证电子邮箱格式
 */
export const isEmailByRex = (value) => {
  return /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(value);
};

/******************************** 正则表达式相关  结束 ******************************/

export const once = (fn, context) => {
  var result;

  return function () {
    if (fn) {
      result = fn.apply(context || this, arguments);
      fn = null;
    }

    return result;
  };
}


export const runOnce = (fn, context) => { //控制让函数只触发一次
  return function () {
    try {
      fn.apply(context || this, arguments);
    } catch (e) {
      console.error(e); //一般可以注释掉这行
    } finally {
      fn = null;
    }
  }
}

/******************************** 存储相关 ******************************/
/**
 *  获取localStorage中的值
 * @param key 键值
 * @param day 有效时间
 */
export const getStorage = (key = ACCESS_TOKEN, day = EXPIRE_TIME) => {
  const dateStr = localStorage.getItem(key);
  if (!dateStr) {
    return null;
  }
  const obj = JSON.parse(dateStr);
  if (new Date().getTime() - Number(obj.date) > 86400000 * day) {
    return null;
  }
  return obj.value;
};

/**
 *  存储值
 * @param value 值
 * @param key 键名，默认为ACCESS_TOKEN所指示的值
 */
export const setStorage = (value, key = ACCESS_TOKEN) => {
  const params = {
    date: new Date().getTime(),
    value
  };
  localStorage.setItem(key, JSON.stringify(params));
};

/**
 *  移除localStorage中的值
 * @param key
 */
export const removeStorage = (key = ACCESS_TOKEN) => {
  localStorage.removeItem(key);
};

/**
 * 清空localStorage中的值
 */
export const clearStorage = () => {
  localStorage.clear();
};


// 设置cookie, expiredays有效天数
export const setCookie = (value, key = environment.cookieName, expiredays = 1, domain = environment.domainName) => {
  value = encodeURIComponent(value);
  const exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  const exdatestr = exdate.toUTCString();
  document.cookie = `${key}=${value};expires=${exdatestr};path=/;domain=${domain}`;

};

export const getCookie = (key = environment.cookieName) => {
  const reg = new RegExp(`(^| )${key}=([^;]*)(;|$)`);
  const arr = document.cookie.match(reg);
  return arr ? decodeURIComponent(arr[2]) : null;
};

// 清除cookie
export const removeCookie = (key = environment.cookieName, domain = environment.domainName) => {
  setCookie(null, key, -30, domain);
};

/******************************** 存储相关  结束******************************/



/****************************************** 日期相关 **********************************************/
// 判断日期大小
export const compareDate = (date1, date2) => {
  const oDate1 = new Date(date1);
  const oDate2 = new Date(date2);
  if (oDate1.getTime() >= oDate2.getTime()) {
    return true;
  } else {
    return false;
  }
}
// 判断是否是 同一周
export const isSameWeek = (old, now) => {
  const oneDayTime = 1000 * 60 * 60 * 24;
  const old_count = parseInt(+old / oneDayTime);
  const now_other = parseInt(+now / oneDayTime);
  return parseInt((old_count + 4) / 7) == parseInt((now_other + 4) / 7);
}
// 判断是否是 同一天
export const isSameDay = (old, now) => {
  const oDate1 = new Date(old);
  const oDate2 = new Date(now);
  return oDate2.setHours(0, 0, 0, 0) === oDate1.setHours(0, 0, 0, 0)
}

export const elasticDate = (old, now) => {
  if (isSameDay(old, now)) {
    return formateDate(old, "HH:mm");
  }
  if (isSameWeek(old, now)) {
    return weekDate(old);
  }
  return formateDate(old, "yyyy:MM:dd");
}
// 将Date转化为指定格式，参数是ms,yyyy-MM-dd HH:mm:ss
export const formateDate = (ms, fmt) => {
  const date = new Date(ms);
  var o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "H+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    "S": date.getMilliseconds()
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));

  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
// 返回 星期几 
export const weekDate = (ms) => {
  const date = new Date(ms);
  const obj = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']

  return obj[date.getDay()]
}

/****************************************** 日期相关 结束**********************************************/
/****************************************** 金额相关 **********************************************/
export const moneyFormate = (value, num) => {
  num = num > 0 && num <= 20 ? num : 2;
  value = parseFloat((value + "").replace(/[^\d\.-]/g, "")).toFixed(num) + ""; //将金额转成比如 123.45的字符串
  var valueArr = value.split(".")[0].split("") //将字符串的数变成数组
  const valueFloat = value.split(".")[1]; // 取到 小数点后的值
  let valueString = "";
  for (let i = 0; i < valueArr.length; i++) {
    valueString += valueArr[i] + ((i + 1) % 3 == 0 && (i + 1) != valueArr.length ? "," : ""); //循环 取数值并在每三位加个','
  }
  const money = valueString.split("").join("") + "." + valueFloat; //拼接上小数位
  return money
}

/****************************************** 网址相关 **********************************************/
// 获取页面url中？后面参数，并以对象形式返回
export const getUrlParams = () => {
  let curUrl = window.location.href;
  var result = {};
  if (curUrl.indexOf('?') === -1) {
    return result;
  }
  let url = curUrl.substr(curUrl.indexOf('?') + 1).split("&");
  let newArr = [];
  for (var i = 0; i < url.length; i++) {
    newArr[i] = url[i].split("=");
    result[newArr[i][0]] = newArr[i][1];
  }
  return result;
}
/****************************************** 网址相关 结束**********************************************/
/****************************************** 节流/消抖 相关 **********************************************/
// 节流函数
export const throttle = (fn, delay, atleast) => {
  /**函数节流方法
   @param Function fn 延时调用函数
   @param Number dalay 延迟多长时间
   @param Number atleast 至少多长时间触发一次
   @return Function 延迟执行的方法
   */
  let timer = null;
  let previous = null;
  return function () {
    var now = +new Date();
    if (!previous) previous = now;
    if (atleast && now - previous > atleast) {
      fn();
      // 重置上一次开始时间为本次结束时间
      previous = now;
      clearTimeout(timer);
    } else {
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn();
        previous = null;
      }, delay);
    }
  };
};

// 节流
export const throttle = (fn, gapTime = 2500) => {
  let _lastTime = null
  return () => {
    const _nowTime = +new Date()

    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)
      _lastTime = _nowTime
    }
  }
}


// 防抖
export const debounce = (fn, gapTime = 800) => {
  let _lastTime
  return function () {
    clearTimeout(_lastTime)
    _lastTime = setTimeout(() => {
      fn.apply(this, arguments)
    }, gapTime)
  }
}


// 是否是空或undefined
export const judgyNull = val => val === undefined || val === '' || val === null || val < 0

// 判断是否是空数组或者是空对象
export const emptyObj = val => {
  return Object.prototype.toString.call(val) === '[object Array]' && !val.length ||
    Object.prototype.toString.call(val) === '[object Object]' && !Object.keys(val).length
}