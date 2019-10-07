const execa = require('execa');
const path = require('path');

const distLocation = path.join('..', 'frontend', 'dist');

async function startServer() {
  let server = execa('http-server', [distLocation], {
    preferLocal: true,
  });

  this.port = await new Promise(resolve => {
    this.server.stdout.on('data', data => {
      let str = data.toString();
      let matches = str.match(/http:\/\/127\.0\.0\.1:(\d+)$/m);
      if (matches) {
        let port = parseInt(matches[1]);

        resolve(port);
      }
    });

    return server;
  });
}

module.exports = {
  startServer,
};
