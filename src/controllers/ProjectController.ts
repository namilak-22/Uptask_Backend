import type { Request,Response } from "express";
import Project from "../models/Projects";

/**
 * *Se genera la clase para que se llamen por métodos del router, se genera la clase static para que no se tenga que instanciar.
 * *En el createProject se tiene que instanciar el modelo de proyecto para que se pueda enviar el body
 * *res.send('mensaje'), es para mandar mesnajes como string y res.json({mensaje:mensaje}) devuelve mensaje como json
 */
export class ProjectController{

    static createProject= async (req:Request,res:Response)=>{
       const project= new Project(req.body);//Aqui se instancia nada mas no se tiene que hacer await

       //Asigna un manager
       project.manager=req.user.id
       
       try {
            await project.save() //aqui ya es await porque se esta realizando un proceso
            //await Project.create(req.body) // una manera mas directa sin tener que instanciar en una variable
            res.send('Proyecto Creado Correctamente...')

       } catch (error) {
        console.log(error)
       }
    }

    static getAllProjects= async (req:Request,res:Response)=>{
        try {
            const projects=await Project.find({
                $or:[
                    {manager:{$in: req.user.id}},
                    {team:{$in:req.user.id}}
                ]
            })
            res.json(projects)
        } catch (error) {
            console.log(error)
        }
       
    }
    static getProjectById= async (req:Request,res:Response)=>{
        const {id}=req.params //obtiene el id por la url ejemplo /api/projects/xxxxxxxxxxxxx req.params='id':xxxxxxxxxxxxx
        try {
            const project=await Project.findById(id).populate('tasks')
            if(!project){
                const error=new Error('Proyecto no encontrado')//para acceder al mensaje creado por la clase error es con .message
                res.status(404).json({error:error.message})
            }
            if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)){
                 const error=new Error('Acción no válida')//para acceder al mensaje creado por la clase error es con .message
                res.status(404).json({error:error.message})
            }
            res.json(project)
            
        } catch (error) {
            console.log(error)
        }
       
    }
    static updateProject= async (req:Request,res:Response)=>{
      
        try {
            
         
            req.project.projectName=req.body.projectName
            req.project.clientName=req.body.clientName
            req.project.description=req.body.description
            await req.project.save()
            res.send('Proyecto Actualizado Correctamente')
        } catch (error) {
            console.log(error)
        }
       
    }

    static deleteProject= async (req:Request,res:Response)=>{
        try{

            await req.project.deleteOne()
            
            res.send('Proyecto Eliminado ')

        }

            
         catch (error) {
            console.log(error)
        }
       
}
}