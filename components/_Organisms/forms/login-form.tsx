'use client'
import React from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {useRouter, useSearchParams} from 'next/navigation'

import {SignInSchema, SignInValues} from '@/database/validation/auth.schemas'
import {signIn} from 'next-auth/react'
import {Answer} from '@/database/types/answer.type'

import {Form} from '@/components/ui/form'
import TextField from '@/components/_Atoms/fields/text-field'
import DbAwnserBox from '@/components/_Atoms/boxes/db-answer-box'
import SubmitButton from '@/components/_Atoms/buttons/submit-button'

/**
 * @version 1
 * @description Formulario de inicio de sesión
 */

export default function LoginForm() {
  // Página de la que proviene el usuario:
  const searchParams = useSearchParams()
  const router = useRouter()
  const src = searchParams.get('src')

  const [dbAnswer, setDbAnswer] = React.useState<Answer | null>(null)
  const [isPending, startTransition] = React.useTransition()

  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    } as SignInValues,
  })

  const onSubmit = (values: SignInValues) => {
    // Vaciar el mensaje de error
    setDbAnswer(null)
    // Iniciar el inicio de sesión con next-auth
    startTransition(async () => {
      const response = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      })

      console.log(response)

      if (response?.error) {
        setDbAnswer({
          ok: false,
          message: 'Credenciales incorrectas',
        })
      } else {
        setDbAnswer({
          ok: true,
          message: 'Sesión iniciada',
        })

        // Redirigir a la página de origen
        router.push(src || '/')
      }
    })
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <TextField
            control={form.control}
            name="email"
            label="Correo electrónico"
            placeholder="arcaute@mail.com"
            type="email"
          />
          <TextField
            control={form.control}
            name="password"
            label="Contraseña"
            placeholder="******"
            type="password"
          />

          <DbAwnserBox answer={dbAnswer} />
          <SubmitButton isPending={isPending} />
        </form>
      </Form>
    </>
  )
}
