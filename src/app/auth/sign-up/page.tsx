'use client'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateUser, setDocument, UpdateUser } from '@/lib/firebase'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Title } from '@/components/ui'
import { User } from '@/interfaces'

export default function Page(){
    const [isLoading, setisLoading] = useState<boolean>(false)
    
    // ! Información necesaria para el registro de credenciales
    const formSchema = z.object({
        uid: z.string(),
        name: z.string().min(4,{
            message: 'El nombre debe tener al menos 4 caracteres'
        }),
        email: z.string().email('El formato del correo no es valido. Ejemplo: user@gmail.com').min(1,{
            message: 'Este campo es requerido'
        }),
        password: z.string().min(6,{
            message: 'La contraseña debe tener al menos 6 caracteres'
        })
    }) 

    // * Validación de datos
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            uid: '',
            name: '',
            email: '',
            password: ''
        }
    })

    const { register, handleSubmit, formState } = form
    const { errors } = formState

    // todo: Envio de datos a la base de datos
    const onSubmit = async (user: z.infer<typeof formSchema>) => {
        setisLoading(true)
        try {
            let res = await CreateUser(user)
            await UpdateUser({displayName: user.name})
            // ? Hacemos que el uid tenga el valor del id de la base de datos
            user.uid = res.user.uid
            // ! Creamos el usuario 
            await createUserInDB(user as User)
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
    
    // ! Creacion de la informacion del usuario en la BDD
    const createUserInDB = async (user: User) => {

        // * Creacion de la coleccion y del registro de la informacion del usuario
        const path = `users/${user.uid}`
        setisLoading(true)
        try {
            delete user.password
            await setDocument(path, user)
            toast(`!Bienvenido¡ ${user.name}`, {duration: 5000, icon: '😎'})
        } catch (error : any) {
            toast.error(
                error.message,
                {duration: 5000}
            )
        }finally{
            setisLoading(false)
        }
    }

    return(
        <div className='min-h-screen flex items-center justify-center'>
            <div className='w-full'>
                <Title title='Registro'/>
                <div className="flex justify-center items-center text-center">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-12.5 px-14.5 shadow-lg rounded-xl text-center w-4/5 md:w-1/2 bg-white">
                        <div className="flex flex-col text-left mb-4" id="input-group">
                            <label className="text-[#283629] text-sm font-semibold m-2 text-center" htmlFor="user">Nombre: </label>
                            <input 
                                {...register('name')}
                                required 
                                className="px-4 py-2 md:px-6 md:py-4 rounded-full mb-5 bg-[#edfff0] border-2 border-[#faf0f1] outline-none placeholder:text-[#b5cab6]" 
                                type="text" 
                                name="name" 
                                id="nombre" 
                                placeholder="Miguel Paredes"
                            />
                            <div className='flex justify-center'>
                                {/* <span className='text-red-500 w-max rounded-lg p-2'>{errors.name?.message}</span> */}
                            </div>
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
                                <span className='text-red-500 w-max rounded-lg p-2'>{errors.email?.message}</span>
                            </div>
                            <label className="text-[#283629] text-sm font-semibold m-2 text-center" htmlFor="password">Password: </label>
                            <input 
                                {...register('password')}
                                required
                                className="px-4 py-2 md:px-6 md:py-4 rounded-full mb-5 bg-[#edfff0] border-2 border-[#faf0f1] outline-none placeholder:text-[#b5cab6]" 
                                type="password" 
                                name="password" 
                                id="password" 
                                placeholder="Contraseña"
                                />
                            <div className='flex justify-center'>
                                <span className='text-red-500 w-max rounded-lg p-2'>{errors.password?.message}</span>
                            </div>
                            <div className='flex justify-center mt-2'>
                                <button
                                    type="submit"
                                    className="bg-green-400 text-white mx-2 rounded-lg hover:underline hover:bg-black hover:text-white flex text-center justify-center w-1/3"
                                >
                                    {isLoading ? <span className="loader"></span> : 'Registrarse'}
                                </button>
                                <Link
                                    href={'/auth'}
                                    className="bg-blue-400 text-white mx-2 rounded-lg hover:underline hover:bg-black hover:text-white flex text-center justify-center w-1/3"
                                >
                                    Iniciar Sesión
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}