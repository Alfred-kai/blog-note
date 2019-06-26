export const isIE1011 = () => {
  const userAgent = navigator.userAgent;
  const isEdge = userAgent.indexOf('Edge') > -1;
  const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  const isIE10 = () => {
    let flag = false;
    try {
      if (window.matchMedia('screen and (-ms-high-contrast: active), (-ms-high-contrast: none)').matches) {
        flag = true;
      }
    } catch (e) {
      return false;
    }
    return flag;
  };
  return isEdge || isIE10() || isIE11;
};



var userAgent = navigator.userAgent; // È¡µÃä¯ÀÀÆ÷µÄuserAgent×Ö·û´®
    var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; // <11ä¯ÀÀÆ÷
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
    if (isIE || isIE11) {
      window.location.href = './browser.html';
    }