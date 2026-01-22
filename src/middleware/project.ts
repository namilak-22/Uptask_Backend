import type {Request,Response,NextFunction} from 'express'
import Project, { IProject } from "../models/Projects";
/**
 * *Se crea la función que valida si existe el proyecto de la url, pero se esta haciendo a través del middleware, por lo que hay que pasar el project desde el TaskController por lo que se hace mediante el request, por lo que se tiene que renombrar el request para agrega el project como atributo, se hace mediante un interface para que no pierda sus atributos anteriores ya que el interface los va agregando cuando se crean con el mismo nombre, en este caso Request.
 * *Con declare global, mandamos a llamar el namespace de Express que es el que tiene el Request para poder anexarle el atributo project mediante la interface.
 */
declare global{
    namespace Express{
        interface Request{
            project:IProject
        }
    }
}

export async function projectExists(req:Request,res:Response,next:NextFunction){
    try {
        const {projectId}=req.params
        const project=await Project.findById(projectId)
        if(!project){
            const error=new Error('Proyecto no Encontrado')
            return res.status(404).json({error:error.message})
        }
        req.project=project
        next()
    } catch (error) {
        res.status(500).json({error:'Hubo un error'})
    }
}