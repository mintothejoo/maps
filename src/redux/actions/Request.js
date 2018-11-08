import request from 'superagent';

const DEFAULT_TIMEOUT = 5000;
const DEFAULT_DEADLINE = 60000;
const BASE_URL = process.env.BASE_URL;

export function fetch(path, params) {
  // params.apikey = TRANSLINK_API;
  let headers = [];
  return new Promise((resolve, reject) => {
    let url = [BASE_URL, path];
    let call = '';
    call = request
      .get(url.join('/'))
      .withCredentials()
      .accept('json')
      .timeout({
        response: DEFAULT_TIMEOUT, // Wait 5 seconds for the server to start sending,
        deadline: DEFAULT_DEADLINE, // but allow 1 minute for the file to finish loading.
      })
      .query(params);
    if (headers) {
      headers.forEach(header => {
        call.set(header[0], header[1]);
      });
    }
    call.end((err, res) => {
      if (err) {
        reject(err, res);
      } else {
        resolve(res);
      }
    });
  });
}
