
require('dotenv').config();

const express = require('express');
const cors = require('cors')

const { dbConnection } = require('./database/config');



// crear servidor de express
const app = express();

// configurar cors
app.use(cors())

// Base de Datos
dbConnection();


// rutas
app.get( '/', (req, resp) => {
    resp.json({
        ok: true,
        msg: 'Hola mundo'
    });
} );

app.listen( process.env.PORT, () => {
    console.log('Servidor express corriendo en puerto ' + process.env.PORT);
} );
