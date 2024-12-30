const mongoose = require('mongoose');
const { Schema } = mongoose;

const inventarioSchema = new Schema({
    nombre: {
        type: String,
        required: true,
    }, 
    precio: { 
        type: Number,
        required: true,
    },
    cantidad: {
        type:   Number,
        required: true,
    },
    date: {
        type: Date,
        default: new Date()
    },
});

module.exports = mongoose.model('Inventario', inventarioSchema);


// define la estructura de el ingreso de datos de los ususrios