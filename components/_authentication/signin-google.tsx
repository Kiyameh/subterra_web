'use client'
import React from 'react'
import {FcGoogle} from 'react-icons/fc'
import {Button} from '@/components/ui/button'
import {signIn} from 'next-auth/react'
import {useSearchParams} from 'next/navigation'

/**
 * @version 1
 * @description Botón de inicio de sesión con Google
 */

export default function SigninGoogle() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  return (
    <Button
      className="w-full text-gray-600 font-bold bg-white hover:bg-blue-200"
      onClick={() => signIn('google', {callbackUrl})}
    >
      Continua con
      <FcGoogle className="h-8 w-8" />
      Google
    </Button>
  )
}
