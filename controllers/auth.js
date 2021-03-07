const { response } = require( 'express' );
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');


const login = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {

        // Verificar email
        const usuarioDB = await Usuario.findOne({ email  }); 

        // Incluir función para retardar

        if ( !usuarioDB ) { 
            return res.status(404).json({
                ok: false,
                msg: 'Email no existe'
            })
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password )

        if ( !validPassword ) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña no válida.'
            })
        }

        // Generar Token
        const token = await generarJWT( usuarioDB.id );

        res.status(200).json({
            ok: true,
            token,
            usuario: usuarioDB
        })
        
    } catch (error) {

        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error inesperado.'
        })
    }

}

module.exports = {
    login
}
