import {Router} from 'express';
import {body,param} from 'express-validator'
import { ProjectController } from '../controllers/ProjectController';
import {TaskController} from '../controllers/TaskController'
import { handleInputErrors } from '../middleware/validation';
import { projectExists } from '../middleware/project';
import { hasAuthorization, taskBelongToProject, taskExists } from '../middleware/task';
import { authenticate } from '../middleware/auth';
import { AuthEmail } from '../emails/AuthEmail';
import { TeamMemberController } from '../controllers/TeamController';
import { NoteController } from '../controllers/NoteController';


/**
 * *Se generan las rutas y se manda a llamar el método de la clase que se va a requerir en casa ruta y método (GET,POST,PUT,PATCH,DELETE)
 * *Con express-validator se usa para validar los campos post que se envían a la base de datos, es validación por parte del servidor.
 * *Para poder validar los errores correctamente se necesita un middleware que gestione los errores que detecta el express-validator.
 * *Para poder validar errores del body con post es con body(), y para poder validar los parametros que se recuperan en un get es con param()
 */
const router=Router();
router.use(authenticate)
//Rutas del Proyecto
router.post('/',
    body('projectName')
    .notEmpty().withMessage('El nombre del Proyecto es Obligatorio'),
    body('clientName')
    .notEmpty().withMessage('El cliente del Proyecto es Obligatorio'),
    body('description')
    .notEmpty().withMessage('La descripción del Proyecto es Obligatorio'),
    handleInputErrors,
    ProjectController.createProject)

router.get('/',ProjectController.getAllProjects)//obtener todos los proyectos

router.get('/:id',
    param('id').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    ProjectController.getProjectById)//obtener proyectos por id

    //Rutas de las Tareas
    router.param('projectId', projectExists)

router.put('/:projectId',
    param('projectId').isMongoId().withMessage('ID no válido'),
    body('projectName')
    .notEmpty().withMessage('El nombre del Proyecto es Obligatorio'),
    body('clientName')
    .notEmpty().withMessage('El cliente del Proyecto es Obligatorio'),
    body('description')
    .notEmpty().withMessage('La descripción del Proyecto es Obligatorio'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.updateProject)

router.delete('/:projectId',
    param('projectId').isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProject)



    router.post('/:projectId/tasks',
      hasAuthorization,
    body('name')
    .notEmpty().withMessage('El nombre de la tarea es Obligatorio'),
    body('description')
    .notEmpty().withMessage('La descripción de la tarea es Obligatoria'),
        handleInputErrors,
        TaskController.createTask)

     router.get('/:projectId/tasks',
        TaskController.getProjectTasks

     )

     router.param('taskId',taskExists)
     router.param('taskId',taskBelongToProject)

     router.get('/:projectId/tasks/:taskId',
        param('taskId').isMongoId().withMessage('ID no válido'),
        handleInputErrors,
        TaskController.getTaskById

     )
     router.put('/:projectId/tasks/:taskId',
         hasAuthorization,
        param('taskId').isMongoId().withMessage('ID no válido'),
        body('name')
        .notEmpty().withMessage('El nombre de la tarea es Obligatorio'),
        body('description')
        .notEmpty().withMessage('La descripción de la tarea es Obligatoria'),
        handleInputErrors,
        TaskController.updateTask

     )
      router.delete('/:projectId/tasks/:taskId',
         hasAuthorization,
        param('taskId').isMongoId().withMessage('ID no válido'),
        handleInputErrors,
        TaskController.deleteTask

     )
     router.post('/:projectId/tasks/:taskId/status',
        param('taskId').isMongoId().withMessage('ID no válido'),
        body('status')
        .notEmpty().withMessage('El estado es obligatorio'),
        handleInputErrors,
        TaskController.updateStatusTask
      )

      /**Routes para los teams */

      router.post('/:projectId/team/find',
         body('email')
         .isEmail().toLowerCase().withMessage('E-mail no válido'),
         handleInputErrors,
         TeamMemberController.findMemberByEmail
      )
      router.get('/:projectId/team',
        
         TeamMemberController.getProjectTeam
      )
      router.post('/:projectId/team',
         body('id')
         .isMongoId().withMessage('ID no válido'),
         handleInputErrors,
         TeamMemberController.addMemberById
      )
      router.delete('/:projectId/team/:userId',
         param('userId')
         .isMongoId().withMessage('ID no válido'),
         handleInputErrors,
         TeamMemberController.removeMemberById
      )
      //** Ruta para las Notas */
      router.post('/:projectId/tasks/:taskId/notes',
         body('content')
         .notEmpty().withMessage('El Contenido de la nota es obligatorio'),
         handleInputErrors,
         NoteController.createNote
      )

      router.get('/:projectId/tasks/:taskId/notes',
         NoteController.getTaskNotes
      )
      router.delete('/:projectId/tasks/:taskId/notes/:noteId',
         param('noteId').isMongoId().withMessage('ID no válido'),
         handleInputErrors,
         NoteController.deleteNotes
      )
export default router;