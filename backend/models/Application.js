const mongoose = require("mongoose")

const ApplicationSchema = new mongoose.Schema({
    projectId : {
        type : String,
        required : true
    },
    applier : {
        type: String,
        required : true
    },
    owner : {
        type: String,
        required : true
    },
    appliedAt : {
        type : Date,
        default : Date.now()
    },
    message: {
        type: String,
        maxlength: 1000
    },
    status : {
        type : String,
        enum : ['APPLIED','ACCEPTED','REJECTED'],
        default : 'APPLIED'
    }
},{timestamps : true})

const ApplicationModel = mongoose.model('ApplicationModel',ApplicationSchema)
module.exports  = ApplicationModel