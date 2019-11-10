import {
  TOKEN_YG
} from './config'

export const promisify = (fn, options = {}) => new Promise((success, fail) => {
  return typeof fn === 'function' ? fn({
    ...options,
    success,
    fail,
  }) : success(fn)
})

// 设置缓存 (单位为秒)
export const setStorage = (value, key = TOKEN_YG) => {
  try {
    const params = {
      date: new Date().getTime(),
      value,
    }
    wx.setStorageSync(key, JSON.stringify(params))
  } catch (error) {}
}

export const getStorage = (key = TOKEN_YG, day = 1) => {
  try {
    let obj = wx.getStorageSync(key)
    if (!obj) return null
    obj = JSON.parse(obj)
    const date = new Date().getTime()
    if (date - obj.date > 86400000 * day) {
      removeStorage(key)
      return null
    }
    return obj.value
  } catch (error) {
    return null
  }
}

export const updateStorage = (key = TOKEN_YG, obj) => {
  try {
    let originData = getStorage(key) || {};

    Object.assign(originData, obj);
    setStorage(originData, key);
  } catch (error) {
    return null
  }
}

export const removeStorage = (key = TOKEN_YG) => {
  try {
    wx.removeStorageSync(key)
  } catch (error) {}
}

export const WxToast = (title, icon = 'none') => {
  wx.showToast({
    title,
    icon,
  })
}

export const WxLoading = (title = '加载中...') => wx.showLoading({
  title,
  mask: true,
})

export const WxModel = (title = '', content, props) => promisify(wx.showModal, {
  title,
  content,
  ...props
})

export const HanderError = ({
  code,
  message,
  status_code,
  errors
}) => {
  WxModel('提示', message, {
    showCancel: false
  })
}

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

// 数组降维
export const reduceDimension = arr => Array.prototype.concat.apply([], arr)

const compareV = (v1, v2) => {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) v1.push('0')
  while (v2.length < len) v2.push('0')

  for (let i = 0; i < len; i++) {
    if (+v1[i] > +v2[i]) return 1
    else if (+v1[i] < +v2[i]) return -1
  }

  return 0
}

// 检查版本
export const compareVersion = () => {
  const version = wx.getSystemInfoSync().SDKVersion
  const p = compareV(version, '2.2.2') < 0
  if (p) {
    WxModel('提示', '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。').then(_ => {
      wx.navigateBack({
        delta: getCurrentPages().length + 1,
      })
    })
  }
  return p
}

// 检查版本更新
export const checkUpdateVersion = () => {
  const updateManager = wx.getUpdateManager()

  updateManager.onCheckForUpdate(({
    hasUpdate
  }) => {
    if (!hasUpdate) return
    updateManager.onUpdateReady(() => {
      WxModel('更新提示', '新版本已经准备好，是否重启应用？').then(res => {
        if (res.confirm) updateManager.applyUpdate()
        else WxModel('提示', '升级到最新版本体验更好哦')
      })
    })

    updateManager.onUpdateFailed(() => {
      WxModel('新版本提示', '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开小程序')
    })
  })
}

// 是否是空或undefined
export const judgyNull = val => val === undefined || val === '' || val === null || val < 0

// 判断是否是空数组或者是空对象
export const emptyObj = val => {
  return Object.prototype.toString.call(val) === '[object Array]' && !val.length ||
    Object.prototype.toString.call(val) === '[object Object]' && !Object.keys(val).length
}