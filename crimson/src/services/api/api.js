import axios from 'axios'


export const apiPost = (url, data, additionalParams = {}) =>
axios({
    method: 'post',
    url,
    data,
    ...additionalParams,
  })
export const apiPut = (url, data, additionalParams = {}) =>
  axios({
    method: 'put',
    url,
    data,
    ...additionalParams,
  });

export const apiGet = (url, additionalParams) =>
  axios({
    method: 'get',
    url,
    ...additionalParams,
  });

  export const apiPatch = (url, data, additionalParams = {}) =>
  axios({
      method: 'PATCH',
      url,
      data,
      ...additionalParams,
    })