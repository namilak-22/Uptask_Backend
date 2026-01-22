import mongoose, {Schema, Document,PopulatedDoc,Types} from 'mongoose';
import Task, { ITask } from './Task';
import { IUser } from './User';
import Note from './Note';

/**
 * *Se realiza un Interface que es similar al tipado de typescript para estructurar el objeto del modelo.
 * *El ProjectSchema es el modelo de la tabla que se usará con MongoDB con la librería mongoose
 * * Cuando se realiza el mongoose.model el primer parámetro es como se va a llamar el modelo, el nombre debe ser único y el segundo parámetro es el Schema 
 * * El ProjectType, es el tipado que se hace aparte en typescript para que se ponga de manera generica en el modelo y sepa typscript como va a ser la estructura de los modelos en el proyecto
 * *Hay que vinculas las tareas con el proyecto ya que un proyecto tiene múltiples tareas, en el interface se tiene que hacer con populatedDoc que es un tipo de monggose que accedes a la informacion por el object id, y tienes que declararla como document igual para que herede el tipado de mongoDB, se finaliza con [] porque son arreglo de tareas.
 * *En el apartado del Schema de mongoDB solo se declara un arreglo de objetos con el tipado Types.ObjectId y la referencia es el modelo de Task.
 * *timestamps es una funcion de mongoose para que puedas saber el momento en que fue actualizada la base de datos 
 */
export interface IProject extends Document {
    projectName:string
    clientName:string
    description:string
    tasks:PopulatedDoc<ITask & Document>[]
    manager:PopulatedDoc<IUser & Document>
    team:PopulatedDoc<IUser & Document>[]
}

const ProjectSchema:Schema=new Schema({
    projectName:{
        type:String,
        required:true,
        trim:true
    },
     clientName:{
        type:String,
        required:true,
        trim:true
    },
      description:{
        type:String,
        required:true,
        trim:true
    },
    tasks:[
        {
            type:Types.ObjectId,
            ref:'Task'
        }
    ],
    manager:{
        type:Types.ObjectId,
        ref:'User'
    },
    team:[
        {
            type:Types.ObjectId,
            ref:'User'
        }
    ],

    
},{timestamps:true})

// Middleware
ProjectSchema.pre('deleteOne',{document:true},async function() {
    const projectId=this._id
   if(!projectId) return
   const tasks=await Task.find({project:projectId})
   for(const task of tasks){
    await Note.deleteMany({task:task.id})
   }
   await Task.deleteMany({project:projectId})
})
const Project= mongoose.model<IProject>('Project',ProjectSchema)
export default Project
