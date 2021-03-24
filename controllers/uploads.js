

const { response, request } = require('express');
const path = require('path');
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = ( req = request, res = response ) => {

    const tipo = req.params.tipo;
    const id   = req.params.id;

    const tiposValidos = ['usuarios', 'medicos', 'hospitales'];

    if ( !tiposValidos.includes( tipo ) ) {
        return res.status(400).json({
            ok: false,
            msg:'No es un médico, hostipital o usuario (tipo).'
        });
    }

    // Valida que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg:'No se encontraron archivos que subir.'
        });
    }

    // Procesar imagen
    const file = req.files.img;
    
    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[ nombreCortado.length - 1 ];

    // Validar extrensión
    const extensionesValidas = ['png','jpg','gif','jpeg'];

    if ( !extensionesValidas.includes( extensionArchivo ) ) {
        return res.status(400).json({
            ok: false,
            msg:'La extensión del archivo no es válida.'
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    // Path para guardar la imagen
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;
    


    // Actualizar Base de datos
    if ( actualizarImagen( tipo, id, nombreArchivo ) ){
    
        // Mover archivo a su carpeta correspondiente
        file.mv( path, (err) => {
            if (err){
                console.log(err);
                return res.status(500).json({
                    ok: false,
                    msg: 'Error al mover la imagen'
                });
            }
        });
    
        res.status(200).json({
            ok: true,
            msg: 'Archivo guardado',
            nombreArchivo
        });
    }else{

        res.status(400).json({
            ok: false,
            msg: 'No se pudo subir el archivo',
            nombreArchivo
        });
    }

}


const retornaImagen = ( req, res = response ) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }` );

    if ( fs.existsSync( pathImg ) ) {
        res.sendFile( pathImg );
    }else{
        const pathImg = path.join( __dirname, `../uploads/no-image.jpg` );
        res.sendFile( pathImg );
    }

}


module.exports = {
    fileUpload,
    retornaImagen
}