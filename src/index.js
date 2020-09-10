import http from 'http';
import "fontsource-roboto/latin-ext-300.css";
import "fontsource-roboto/latin-ext-400.css";
import "fontsource-roboto/latin-ext-500.css";
import "fontsource-roboto/latin-ext-700.css";

let app = require('./server').default;

const server = http.createServer(app);

let currentApp = app;

server
  .listen(process.env.PORT || 3000, () => {
    console.log('🚀 started');
  })
  .on('error', error => {
    console.log(error);
  });

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');

    try {
      app = require('./server').default;
      server.removeListener('request', currentApp);
      server.on('request', app);
      currentApp = app;
    } catch (error) {
      console.error(error);
    }
  });
}
