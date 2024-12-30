// Usar 'const' con 'require' para importar módulos en lugar de 'import'
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

// importo las rutas a inventario y a user
const routerUser = require('./router/userRouter');
const listainventarioRouter = require('./router/ListaInventarioRouter'); // Archivo que maneja la lógica de listainventario



// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Importar la conexión a la base de datos
const conexion = require('./conexion/conexion.js');


// Crear una instancia de express
const app = express();

// Importar la variable de entorno
const PORT = process.env.PORT;
const MONGO_LOCAL = process.env.MONGO_LOCAL;
const MONGO_ATLAS = process.env.MONGO_ATLAS;

// Conectar a la base de datos
conexion(MONGO_ATLAS);

// Configurar los middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

// Definir las rutas de la aplicación como middleware
app.use('/user', routerUser);// MISMO NOMBRE DE LA VARIABLE de const
app.use('/listainventario', listainventarioRouter); // Rutas relacionadas con lista de inventario
 

// Ruta raíz para la API
app.get("/", (req, res) => {
    res.send(`<h1>Bienvenido a la Api Rest</h1>`);
});

// Levantar el servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});

// Manejo de errores en el servidor
server.on('error', (error) => {
    console.log(`Error en el servidor: ${error}`);
});
