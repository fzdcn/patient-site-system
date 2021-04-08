function getApi(url, params) {
  if (params) {
    const paramsArray = [];
    // 拼接参数
    Object.keys(params).forEach(key => paramsArray.push(`${key}=${params[key]}`));
    if (url.search(/\?/) === -1) {
      url += `?${paramsArray.join('&')}`;
    } else {
      url += `&${paramsArray.join('&')}`;
    }
  }
  return fetch(url, {
    methoda: 'GET',
  })
    .then(response => response.json())
    .catch(err => console.log('error', err));
}
function postApi(url, params, isJson = true) {
  return fetch(url, {
    method: 'POST',
    body: isJson ? (params && JSON.stringify(params)) : params,
    headers: {
      'Content-type': isJson ? 'application/json; charset=UTF-8' : 'application/x-www-form-urlencoded',
    },
  })
    .then(response => response.json())
    .catch(err => console.log('error', err));
}
