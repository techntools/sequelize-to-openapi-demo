import http from 'http';

/* To ensure extras are added onto the global */
import './lib';

import web from './web';
import store from './store';
import envConfig from './config';


(async function() {
    async function shutdown(err?: unknown) {
        await store.close()
        process.exit(err ? 1 : 0)
    }

    process.on('SIGTERM', shutdown)
    process.on('SIGINT', shutdown)

    async function onException(errOrReason: unknown) {
        if(errOrReason) { console.error(errOrReason) }
        shutdown(errOrReason)
    }

    process.on('uncaughtException', onException)
    process.on('unhandledRejection', onException)

    await envConfig.init()

    /*
     * Start the server even if connection with outside resources is not
     * confirmed. Its speeds up the server startup needed in development. By
     * the time you switch to API client to test changes, all resources will
     * be connected to, hopefully.
     */
    const server = http.createServer();
    server.listen(envConfig.port, () => {
        console.log()
        console.log((`  App is running at http://localhost:${envConfig.port}`));
        console.log(`  Press CTRL-C to stop\n`);
    })

    await store.init()

    await web.init()

    server.addListener('request', web.getRequestListener())
})()
