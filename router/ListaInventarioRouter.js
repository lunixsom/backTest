const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');


const Inventario = require('../models/inventarioModel');


// Datos de ejemplo (esto debería conectarse a tu base de datos)
/* const listaInventario = [
    { _id: '1', nombre: 'Producto A', precio: 100, cantidad: 10 },
    { _id: '2', nombre: 'Producto B', precio: 200, cantidad: 5 },
    { _id: '3', nombre: 'Producto C', precio: 300, cantidad: 8 },
]; */


// ruta para registrar un producto
router.post("/register",
    [
        body('nombre')
            .isLength({ min: 3, max: 20 }).withMessage('El nombre debe tener entre 3 y 20 caracteres')
            .notEmpty().withMessage('El nombre es obligatorio')
            .isString().withMessage('El nombre debe ser de tipo texto')
            .trim(),
        body('precio')
       
            .notEmpty().withMessage('El nombre es obligatorio')
            .isNumeric().withMessage('valor ingresado debe ser un numero'),
            
        body('cantidad')

            .notEmpty().withMessage('El nombre es obligatorio')
            .isNumeric().withMessage('valor ingresado debe ser un numero')
        
            

    ]
    , async (req, res) => {

        const errores = validationResult(req);

        const { nombre, precio, cantidad } = req.body;


        console.log(errores)


        const producto = {
            nombre,
            
            precio,
            
            cantidad
        }

     

      try {

        const newInventario = new Inventario(producto);

        await newInventario.save();

        return res.status(201).json({ message: 'iventario exitoso' });


    } catch (error) {

        console.log('Error al registrar el producto:', error);
        return res.status(400).json({ message: 'error en inventario' });
    }

      /*   try {

            if (!errores.isEmpty()) {
                return res.status(404).json({ message: 'Error al enviar los datos' });
            }
            
            const usuarioExiste = await User.findOne({ email })
            console.log(usuarioExiste);

            
            const salt = bcrypt.genSaltSync(10);
            console.log(salt);

            persona.password = await bcrypt.hashSync(password, salt);
            console.log(persona.password);

            const newUser = new User(persona);

            await newUser.save(); 

            return res.status(201).json({ message: 'Usuario registrado correctamente' });


        } catch (error) {

            console.log('Error al registrar el usuario:', error);
            return res.status(400).json({ message: 'Error al registrar el usuario' });
        } */

    });


// Ruta para obtener la lista de inventario
router.get('/inventario', async (req, res) => {
    try {
        const listaInventario = await Inventario.find();
        res.status(200).json(listaInventario); // Devuelve la lista de inventarios
    } catch (error) {
        console.error('Error al obtener el inventario:', error);
        res.status(500).json({ message: 'Error al obtener el inventario' });
    }
});

// Ruta para eliminar un producto por ID
router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
    
            console.log(id);
            
            await Inventario.findByIdAndDelete(id);
            return res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            console.log('Error al eliminar el usuario:', error);
            return res.status(400).json({ message: 'Error al eliminar el usuario' });
        }
    });
/*     const { id } = req.params;

    const index = Inventario.findIndex((item) => item._id === id);
    if (index === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    Inventario.splice(index, 1); // Elimina el producto del array
    res.status(200).json({ message: 'Producto eliminado' });
}); */

module.exports = router;
