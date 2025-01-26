'use client'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Title } from '@/components/ui'
import { sendtResetEmail } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

export default function ForgotPassword (){

    const [isLoading, setisLoading] = useState<boolean>(false)

    const router = useRouter()
    
    // ! Información necesaria para el registro de credenciales
    const formSchema = z.object({
        email: z.string().email('El formato del correo no es valido. Ejemplo: user@gmail.com').min(1,{
            message: 'Este campo es requerido'
        }),
    }) 

    // * Validación de datos
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ''
        }
    })

    const { register, handleSubmit, formState } = form
    const { errors } = formState

    // todo: Envio de datos a la base de datos
    const onSubmit = async (user: z.infer<typeof formSchema>) => {
        setisLoading(true)
        try {
            // Enviamos el correo para restablecer la contraseña
            await sendtResetEmail(user.email)
            // Mostramos un mensaje de exito
            toast.success('Revisa tu correo para restablecer tu contraseña', {duration: 5000})
            // Redirigimos al usuario a la pagina principal
            router.push('/')
        } catch (error: any) {
            toast.error(
                // Mostramos el mensaje de error
                error.message, 
                // Duracion que se ve el mensaje
                {duration: 5000}
            )
        }finally{
            setisLoading(false)
        }
    }
    
    return(
        <div className='min-h-screen flex items-center justify-center'>
            <div className='w-full'>
                <Title title='Recuperar Contraseña'/>
                <p className='text-center mt-2'>¿Has olvidado tu contraseña? Descuida aqui estamos para ayudarte</p>
                <div className="flex justify-center items-center text-center">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-12.5 px-14.5 shadow-lg rounded-xl text-center w-4/5 md:w-1/2 bg-white">
                        <div className="flex flex-col text-left mb-4" id="input-group">
                            <label className="text-[#283629] text-sm font-semibold m-2 text-center" htmlFor="user">Usuario: </label>
                            <input 
                                {...register('email')}
                                required 
                                className="px-4 py-2 md:px-6 md:py-4 rounded-full mb-5 bg-[#edfff0] border-2 border-[#faf0f1] outline-none placeholder:text-[#b5cab6]" 
                                type="text" 
                                name="email" 
                                id="user" 
                                placeholder="Usuario"
                            />
                            <div className='flex justify-center'>
                                <span className='text-red-500 w-max rounded-lg pt-1'>{errors.email?.message}</span>
                            </div>
                            <div className='flex justify-center'>
                                <button
                                    className="bg-blue-400 text-white mx-2 rounded-lg hover:underline hover:bg-black hover:text-white flex text-center justify-center w-1/3"
                                >
                                    Recuperar Contraseña
                                </button>
                            </div>
                            <div className='flex justify-center mt-2'>
                                <Link
                                    href={'/'}
                                    className="text-gray-400 mx-2 rounded-lg hover:underline flex text-center justify-center w-max"
                                >
                                    Regresar
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}