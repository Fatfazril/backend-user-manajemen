const { string } = require('joi')
const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    decsriptions : {
        type : String,
    },
    completed :{
        type : Boolean , 
        default : false
    }, 
}, {timestamps : true}
)

module.exports = mongoose.model('Tasks' , TaskSchema)