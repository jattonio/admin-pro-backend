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

    res.json({
        ok: true,
        msg: 'actualizarHospital'
    });

}

const borrarHospital = async (req, res = response) => {

    res.json({
        ok: true,
        msg: 'borrarHospital'
    });

}



module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}