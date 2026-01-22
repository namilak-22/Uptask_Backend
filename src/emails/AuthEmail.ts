import { transporter } from "../config/nodemailer"

interface IEmail{
    email:string
    name:string
    token:string
}

export class AuthEmail{
    static sendConfirmationEmail=async (user:IEmail)=>{
             const info=await transporter.sendMail({
                from:'UpTask<admin@uptask.com>',
                to: user.email,
                subject:'Uptask - Confirma tu cuenta',
                text: 'Uptask - Confirma tu cuenta',
                html:`<p>Hola: ${user.name}, has creado tu cuenta en UpTask, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
                
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar Cuenta</a>
                <p>Ingresa el código: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>`
            })
            console.log('Mensaje Enviado', info.messageId)
    }
    static sendPasswordResetToken=async (user:IEmail)=>{
             const info=await transporter.sendMail({
                from:'UpTask<admin@uptask.com>',
                to: user.email,
                subject:'Uptask - Reestablece tu Password',
                text: 'Uptask - Reestablece tu Password',
                html:`<p>Hola: ${user.name}, has solicitado reestablecer tu password.</p>
                
                <p>Visita el siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">Reestablecer Password</a>
                <p>Ingresa el código: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>`
            })
            console.log('Mensaje Enviado', info.messageId)
    }
}