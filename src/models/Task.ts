import mongoose, {Schema, Document,Types} from 'mongoose';
import Note from './Note';

/**
 * *Para vincular el modelo de Proyecto con Tarea, es mas sencillo porque las tareas solo pueden tener un Proyecto, para eso en el inerface de typescript se hace el       tipado con Types.ObjectId que es el de mongoDB y en el Schema se hace el mismo tipado de mongoDB y la referencia es la variable del modelo Project.
 * *timestamps es una funcion de mongoose para que puedas saber el momento en que fue actualizada la base de datos 
 * *Se crea un diccionario de taskStatus que luego se vuelve constante para que sean de solo lectura, luego se crea un type con esa estructura pero usando el keyof para que solo agarre como valores las keys de los elementos del diccionario. Se agrega en la interface con el tipado creado en typescript, y en el Schema se usa como string y se agrega enum que es para definir que una coleccion de valores y se define el tipado con un object.values(taskStatus), y se agrega como valor defaul el estatus de pendiente.
 */
const taskStatus={
        PENDING:'pending',
        ON_HOLD:'onHold',
        IN_PROGRESS:'inProgress',
        UNDER_REVIEW:'underReview',
        COMPLETED:'completed'
}as const;

export type TaskStatus=typeof taskStatus[keyof typeof taskStatus]

export interface ITask extends Document {
    name:string
    description:string
    project:Types.ObjectId
    status:TaskStatus
    completedBy:{
        user:Types.ObjectId,
        status:TaskStatus
    }[]
    notes:Types.ObjectId[]
}

const TaskSchema:Schema=new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    project:{
        type:Types.ObjectId,
        ref:'Project'
    },
    status:{
        type:String,
        enum:Object.values(taskStatus),
        default:taskStatus.PENDING

    },
    completedBy:[
        {
            user:{
                type:Types.ObjectId,
                ref:'User',
                default:null
            },
            status: {
                type:String,
                enum:Object.values(taskStatus),
                default:taskStatus.PENDING

            }
        }
    ],
    notes:[
        {
            type:Types.ObjectId,
            ref:'Note'
        }
    ]
},{timestamps:true})

// Middleware
TaskSchema.pre('deleteOne',{document:true},async function() {
    const taskId=this._id
   if(!taskId) return
   await Note.deleteMany({task:taskId})
})

const Task=mongoose.model<ITask>('Task',TaskSchema)
export default Task