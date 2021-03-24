const { Schema, model } = require('mongoose');


const HospitalSchema = Schema({ 

    nombre: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    usuario: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }

}, { collection: 'hospitales' });


// formateo de la salida de datos
HospitalSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
} )

module.exports = model( 'Hospital', HospitalSchema );

 