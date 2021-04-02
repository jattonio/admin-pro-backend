const { response, request, json } = require('express');
const Medico = require('../models/medico');




const getMedicos = async(req, res) => {

    // const hospitales = await hospital.find( {}, 'nombre usuario' );
    
    const medicos = await Medico.find( )
                                    .populate('usuario', 'nombre')
                                    .populate('hospital', 'nombre')

    res.json({
        ok: true,
        medicos
    });
}

const crearMedico = async (req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {
        const medicoDB = await medico.save();
        
        res.status(200).json({
            ok: true,
            medico: medico
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }


}

const actualizarMedico = async (req, res = response) => {

    const id = req.params.id;
    const usuario = req.uid;

    try {

        // Validar si médico a actualizar existe
        const medicoDB = await Medico.findById( id );

        if ( !medicoDB ) {

            return res.status(404).json({
                ok: false,
                msg: 'Médico no existe.'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario
        }

        // Actualizar Hospital
        const medicoActualizado = await Medico.findByIdAndUpdate( id, cambiosMedico, { new: true } );

        res.json({
            ok: true,
            msg: 'Medico actualizado',
            medicoActualizado
        });

    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
        
    }

}

const borrarMedico = async (req, res = response) => {

    id = req.params.id;

    try {

        // Validar si medico a borrar existe
        const medicoDB = await Medico.findById( id );

        if ( !medicoDB ) {

            return res.status(404).json({
                ok: false,
                msg: 'Medico no existe.'
            });
        }
        
        // Borrar hospital
        await Medico.findByIdAndDelete( id );

        console.log('Borrar medico: ' + id);
        res.status(200).json({
            ok: true,
            msg: 'Medico borrado',
            id
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error Inesperado - Borrar medico.'
        });
    }
}



module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}