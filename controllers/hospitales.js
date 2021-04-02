const { response  } = require('express');
const Hospital = require('../models/hospital');




const getHospitales = async(req, res) => {

    const hospitales = await Hospital.find( )
                                    .populate('usuario', 'nombre');

    res.json({
        ok: true,
        hospitales
    });
}



const crearHospital = async (req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {
        const hospitalDB = await hospital.save();
        
        res.status(200).json({
            ok: true,
            hospital: hospitalDB
        });
    } catch (error) {
        console.log( error );
        
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }


}



const actualizarHospital = async (req, res = response) => {

    const id = req.params.id;
    const usuario = req.uid;

    try {

        // Validar si usuario a actualizar existe
        const hospitalDB = await Hospital.findById( id );

        if ( !hospitalDB ) {

            return res.status(404).json({
                ok: false,
                msg: 'Hospital no existe.'
            });
        }

        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        // Actualizar Usuario
        const hospitalActualizado = await Hospital.findByIdAndUpdate( id, cambiosHospital, { new: true } );

        res.json({
            ok: true,
            hospitalActualizado
        });

    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
        
    }

}

const borrarHospital = async (req, res = response) => {

    id = req.params.id;

    try {

        // Validar si hospital a borrar existe
        const hospitalDB = await Hospital.findById( id );

        if ( !hospitalDB ) {

            return res.status(404).json({
                ok: false,
                msg: 'Hospital no existe.'
            });
        }
        
        // Borrar hospital
        await Hospital.findByIdAndDelete( id );

        console.log('Borrar hospital: ' + id);
        res.status(200).json({
            ok: true,
            msg: 'Hospital borrado',
            id
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado - Borrar hospital.'
        });
    }

}



module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}