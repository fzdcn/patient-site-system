const $baseUrl = '/api-v1/ftrial';
let $callUrl = window.localStorage.getItem('callUrl');
const historyUserId = localStorage.getItem('userId');
function GetRequest() {
  const url = location.search; // 获取url中"?"符后的字串
  const theRequest = new Object();
  if (url.indexOf('?') != -1) {
    const str = url.substr(1);
    const strs = str.split('&');
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = decodeURIComponent(strs[i].split('=')[1]);
    }
  }
  return theRequest;
}

function paramsStringify(params = {}) {
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

const urlParmas = GetRequest();
if (urlParmas.userId && urlParmas.userId !== historyUserId) {
  getCallUrl();
}
function getCallUrl() {
  $.ajax({
    url: `${$baseUrl}/project-subject/${urlParmas.userId}/environment`,
    type: 'get',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success(res) {
      if (res.code === 1 && res.data) {
        $callUrl = res.data.environment === 'common' ? '/api-v2' : '/api-v4';
        window.localStorage.setItem('callUrl', $callUrl);
        window.localStorage.setItem('userId', res.data.userId);
      } else {
        window.localStorage.setItem('callUrl', '');
        window.localStorage.setItem('userId', urlParmas.userId);
      }
    },
  });
}
