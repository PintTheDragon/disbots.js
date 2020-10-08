const Express = require('express');
const Axios = require('axios');


export class Client {
  constructor(secret, webhook_port, webhook_path) {
    if (typeof(secret) != 'string') {
      throw {error: 'TypeError', message: 'argument "secret" should be of the type "string"'};
    }

    if (typeof(webhook_port) != 'number') {
      throw {error: 'TypeError', message: 'argument "webhook_port" should be of the type "number"'};
    }

    if (typeof(webhook_path) != 'string') {
      throw {error: 'TypeError', message: 'argument "webhook_path" should be of the type "string"'};
    }

    this.base_url = 'https://disbots.gg'

    this.secret = secret;
    this.webhook_port = webhook_port;
    this.webhook_path = webhook_path;
  }

  postServerCount(serverCount) {
    Axios.put(`${this.base_url}/api/stats`, {headers: {Authorization: this.secret}, data: {servers: serverCount}})
    .then(resp => {
      return {success: true, message: 'Posted server count to the API sucessfully'};
    })
    .catch(e => {
      if (e.response) {
        if (e.response.status == 401) throw {error: 'APIError', message: '401 Unauthorized (Your secret is invalid)'};
      }

      throw {error: 'APIError', message: 'Unknown error occurred, check debug attribute of thrown error', debug: e};
    });
  }
}
