const { response, request, json } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require( '../models/usuario' );
const { generarJWT } = require('../helpers/jwt');
 


const getUsuarios = async(req, resp) => {

    const desde = Number(req.query.desde) || 0;
    
    const [ usuarios, total ] = await Promise.all([
        Usuario
            .find( {},'nombre email rol google img' )
            .skip( desde )
            .limit(5),
        Usuario.countDocuments(),
    ]);

    resp.json({
        ok: true,
        usuarios,
        total
    });
}



const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;



    try {
        // Validar si email ya existe
        const existeEmail = await Usuario.findOne({ email });

        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado '
            })
        }

        const usuario = new Usuario( req.body );

        // encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );


        // Guardar usuario 
        await usuario.save();

        // Generar Token
        const token = await generarJWT( Usuario.id );

    
        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

const actualizarUsuario = async( req = request, res = response ) => {

    const uid = req.params.id;

    try {

        // Validar si usuario a actualizar existe
        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {

            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe.'
            });
        }

        // Campos que no se permitirán actualizar
        const { password, google, email, ...campos } = req.body;

        // Validadr si el correo a actualizar ya existe con otro usuario
        if ( usuarioDB.email !== email ) {

            const existeEmail = await Usuario.findOne({ email });

            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No es posible actualizar. Existe un usuario con el mismo email.'
                });
            }
        }

        campos.email = email

        // Actualizar Usuario
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado - Actualizar usuario.'
        });
        
    }

}

const borrarUsuario = async ( req, res ) => {

    uid = req.params.id;

    try {

        // Validar si usuario a borrar existe
        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {

            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe.'
            });
        }
        
        // Borrar usuario
        await Usuario.findByIdAndDelete( uid );

        console.log('Borrar usuario:' + uid);
        res.status(200).json({
            ok: true,
            uid
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado - Borrar usuario.'
        });
    }

}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}