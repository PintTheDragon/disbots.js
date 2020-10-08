const Express = require('express');
const Axios = require('axios');


export class Client {
  constructor(client, secret, autopostStats, webhookPort, webhookPath) {
    this.base_url = 'https://disbots.gg';

    // require and validate client
    if (typeof(client) != 'object' || !client.guilds) {
      throw {error: 'TypeError', message: 'argument "client" should be of the type "Discord.Client"'};
    }
    this.client = client;

    // require and validate secret
    if (typeof(secret) != 'string') {
      throw {error: 'TypeError', message: 'argument "secret" should be of the type "string"'};
    }
    this.secret = secret;

    // optionalize and validate/uniform autopostStats
    this.autopostStats = Boolean(autopostStats);
    // if autopostStats make it post the count to api every 30 min
    if (this.autopostStats) setInterval(this.postServerCount, 30*60*1000, this.client.guilds.length);

    // optionalize and validate webhookPort
    if (webhookPort && typeof(webhookPort) != 'number') {
      throw {error: 'TypeError', message: 'argument "webhookPort" should be of the type "number"'};
    }

    // validate range
    if (webhookPort < 1 || webhookPort > 65535) {
      throw {error: 'ValueError', message: 'argument "webhookPort" should be a number between 1 and 65535'};
    }
    this.webhookPort = webhookPort;

    // optionalize and set webhookPath if webhooks are gonna be a thing and webhookPath isn't already set
    if (!webhookPath && webhookPort) {
      webhookPath = '/disbots_hook';
    }

    // validate webhookPath
    if (typeof(webhookPath) != 'string') {
      throw {error: 'TypeError', message: 'argument "webhookPath" should be of the type "string"'};
    }
    this.webhookPath = webhookPath;
  }

  postServerCount(serverCount) {
    if (!serverCount) {
      throw {error: 'TypeError', message: 'argument "serverCount" should be of the type "number" or be a number inside a string'};
    }

    Axios.put(`${this.base_url}/api/stats`, {headers: {Authorization: this.secret}, data: {servers: `${serverCount}`}})
    .then(res => {
      return {success: true, message: 'Posted server count to the API sucessfully', response: res};
    })
    .catch(e => {
      if (e.response) {
        if (e.response.status == 401) throw {error: 'APIError', message: '401 Unauthorized (Your secret is invalid)'};
      }

      throw {error: 'APIError', message: 'Unknown error occurred, check debug attribute of thrown error', debug: e};
    });
  }
}
