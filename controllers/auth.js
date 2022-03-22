const { response } = require( 'express' );
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');


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

const googleSingIn = async ( req, resp ) => {

    const googleToken = req.body.token; 


    try {
        
        const { name, email, picture } = await googleVerify( googleToken );

        // Verificar email
        const usuarioDB = await Usuario.findOne({ email  });
        let usuario;
        
        // Si no existe usuario
        if ( !usuarioDB ) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        }else{
            // Existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Guardar en BD
        await usuario.save();

        // Generar Token
        const token = await generarJWT( usuario.id );

        resp.json({
            ok: true,
            msg: 'Google Sign in',
            token
        });
    } catch (error) {

        console.log( error );

        resp.status(401).json({
            ok: false,
            msg: 'El Token no es correcto.',
            error
        });

    }
}


const renewToken = async ( req, res ) => {

    const uid = req.uid;

     // Generar Token
    const token = await generarJWT( uid  );

    // Obtener usuario por UID
    const usuario = await Usuario.findById( uid );


    res.json({
        ok: true,
        token,
        usuario
    });

}

module.exports = {
    login,
    googleSingIn,
    renewToken
}
