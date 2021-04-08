import { getStorage } from '@/utils/storage';

export function paramsStringify(params = {}) {
  const paramsArray = [];
  let values = '';
  Object.keys(params).forEach((k) => {
    switch (typeof params[k]) {
      case 'string':
        values = params[k].trim();
        break;
      case 'undefined':
        values = '';
        break;
      default:
        values = params[k];
        break;
    }
    paramsArray.push(`${k}=${encodeURIComponent(values)}`);
  });
  return paramsArray.join('&');
}

// 驼峰转换短横线
export function humpToLine(name) {
  return name.replace(/([A-Z])/g, '-$1').toLowerCase();
}

// 登录密码加密
export function pwdsha(ori, txt) {
  if (ori === null || typeof ori === 'undefined' || ori === '') return '';
  const { sha256 } = require('js-sha256');
  const hash = sha256(`${ori}${txt}`);
  return sha256(hash);
}

// 获取url
export function getUrlById(fileId, fileStyle = 2) {
  const t = getStorage('token');
  return `${process.env.VUE_APP_REQUEST_BASE_URL}/biz-gcplm/document/download-file?t=${t}&fileId=${fileId}&fileStyle=${fileStyle}`;
}
// 数字金额大写
export function convertCurrency(price) {
  if (!price) {
    return '';
  }
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['圆', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  let num = Math.abs(price);
  let s = '';
  const num1 = `${num}`;
  const index = num1.indexOf('.');
  if (index > -1) {
    const num2 = num1.substr(index + 1);
    fraction.forEach((item, i) => {
      s += (digit[num2.substr(i, 1) || '0'] + item).replace(/零./, '');
    });
  }
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}
