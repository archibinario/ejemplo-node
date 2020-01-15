/* MODULOS */
const express = require('express');
const app = express();
const errors = require('./lib/errors-handlers');
const apiv1 = require('./routes/v1');

/* MIDDLEWARES */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* CONFIGURACIÓN */
if (ENV === 'production') {
    // trust proxy
    app.set('trust proxy', 1);
}

/* RUTAS */
app.use('/api/v1', apiv1)

// 404
app.use((req, res, next) => {
    throw new Error('URL_NOT_FOUND');
})

/* MANEJO DE ERRORES */
app.use(errors.errorHandler);
app.use(errors.logErrors);
app.use(errors.errorResponse);

/* LEVANTAR SERVER */
const server = app.listen(PORT, async () => {
    try {
        console.log(`APP_LISTENING_PORT ${PORT} ON ${ENV}`);
        await connectDB();
        console.log(`DB CONNECTED ${MONGO.CONNECTION_STRING}`);
    } catch (error) {
        throw new Error('FAIL_STARTING_APP')
    }
});

/* MANEJADOR DE ERRORES NO CONTROLADOS */
process.on('uncaughtException', function (err) {
    // TODO
    // log
    closeApp();
});

/* PROCESO CIERRE ORDENADO */
process.on('SIGTERM', closeApp);    // cierre del proceso desde el gestor del sistema
process.on('SIGINT', closeApp);     // cierre ctrl + c

function closeApp() {
    // salimos del proceso de node de forma ordenada
    // TODO
    // log
    console.info('Close signal received. Closing http server.');
    server.close(() => {
        console.info('HTTP_SERVER_CLOSED');
        disconnectDB();
        console.info('DB_CONNECTION_CLOSED');
        process.exit(0);
    });
}
