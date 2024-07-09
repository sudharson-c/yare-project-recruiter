import mongoose from "mongoose";


const Project = mongoose.model('Project',{
    project_name : {type:String,required:true},
    project_desc : {type:String,required:true},
    project_link : {type:String,required:true},
    owner : {type:mongoose.Schema.ObjectId,ref:'User',required:true}  ,
    collaborators : [{type:mongoose.Schema.ObjectId,ref:'User',default:{}}]
},{
    timestamps:true
})

export default Project;