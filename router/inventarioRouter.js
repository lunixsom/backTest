


const express = require('express');
const router = express.Router();
const Inventario = require('../models/inventarioModel');

// importamos body de express-validator para validar los campos
const { body, validationResult } = require('express-validator');

// librería para encriptar contraseñas
const bcrypt = require('bcrypt');

//importamos el esquema del usuario
const User = require('../models/userModel');





// obtenemos todos los usuarios
router.get("/", async (req, res) => {
    try {
        const usuarios = await User.find();
        return res.status(200).json(usuarios);
    } catch (error) {
        console.log('Error al obtener los usuarios:', error);
        return res.status(400).json({ message: 'Error al obtener los usuarios' });
    }
});

// eliminamos un usuario
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        console.log(id);
        
        await User.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.log('Error al eliminar el usuario:', error);
        return res.status(400).json({ message: 'Error al eliminar el usuario' });
    }
});


// ruta para registrar un usuario
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

module.exports = router; //ES5