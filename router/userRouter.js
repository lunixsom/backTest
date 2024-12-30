const express = require('express');
const router = express.Router();

// importamos body de express-validator para validar los campos
const { body, validationResult } = require('express-validator');

// librería para encriptar contraseñas
const bcrypt = require('bcrypt');

//importamos el esquema del usuario
const User = require('../models/userModel');

// responde a la ruta '/user'

// ruta para loguear un usuario
router.post("/login", async (req, res) => {

    const { email, password } = req.body

    console.log(email, password);

    // vemos si ya existe el usuario
    const usuarioExiste = await User.findOne({ email })
    console.log(usuarioExiste);

});

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

// obtener usuario por id
router.get("/:id", async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id);
        if(!usuario) return res.status(404).json({ message: 'Usuario no encontrado'});
        res.json(usuario)
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener el usuario' });
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
        body('email')
            .isLength({ min: 3, max: 45 }).withMessage('El email debe tener entre 3 y 45 caracteres')
            .notEmpty().withMessage('El nombre es obligatorio')
            .isEmail().withMessage('El correo tiene que existir')
            .trim(),
        body('password')
            .isLength({ min: 8 }).withMessage('El password debe tener como mínimo 8 caracteres')
            .notEmpty().withMessage('El nombre es obligatorio')
            .isString().withMessage('El password debe ser de tipo texto')
            .trim(),

    ]
    , async (req, res) => {

        const errores = validationResult(req);

        const { nombre, email, password } = req.body;


        console.log(errores)


        const persona = {
            nombre,
            email,
            password
        }

        console.log(persona);


        try {

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
        }

    });

    router.put("/editar/:id", 
        [
            body('nombre')
                .optional()
                .isLength({ min: 3, max: 20 }).withMessage('El nombre debe tener entre 3 y 20 caracteres')
                .isString().withMessage('El nombre debe ser de tipo texto')
                .trim(),
            body('email')
                .optional()
                .isLength({ min: 3, max: 45 }).withMessage('El email debe tener entre 3 y 45 caracteres')
                .isEmail().withMessage('El correo tiene que existir')
                .trim(),
            body('password')
                .optional()
                .isLength({ min: 8 }).withMessage('El password debe tener como mínimo 8 caracteres')
                .isString().withMessage('El password debe ser de tipo texto')
                .trim(),
        ], 
        async (req, res) => {
            const { id } = req.params;
            const { nombre, email, password } = req.body;
    
            // Validar los posibles errores en los datos enviados
            const errores = validationResult(req);
            if (!errores.isEmpty()) {
                return res.status(400).json({ errores: errores.array() });
            }
    
            try {
                // Buscar el usuario a editar
                const usuario = await User.findById(id);
                if (!usuario) {
                    return res.status(404).json({ message: 'Usuario no encontrado' });
                }
    
                // Si se pasa un nuevo password, lo encriptamos
                if (password) {
                    const salt = bcrypt.genSaltSync(10);
                    usuario.password = await bcrypt.hashSync(password, salt);
                }
    
                // Actualizar los campos del usuario
                usuario.nombre = nombre || usuario.nombre;
                usuario.email = email || usuario.email;
    
                // Guardar el usuario actualizado
                await usuario.save();
    
                return res.status(200).json({ message: 'Usuario actualizado correctamente' });
            } catch (error) {
                console.log('Error al actualizar el usuario jaja:', error);
                return res.status(400).json({ message: 'Error al actualizar el usuario' });
            }
        }
    );

module.exports = router; //ES5