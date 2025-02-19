'use server'
import {connectToMongoDB} from '@/database/databaseConection'
import {Answer} from '@/database/types/answer.type'

import Platform from '@/database/models/Platform.model'
import {InstanceRequest} from '@/database/models/Platform.model'
import {ContactMessage} from '@/database/models/Platform.model'
import {PlatformObject} from '@/database/models/Platform.model'
import {PlatformDocument} from '@/database/models/Platform.model'

import {contactFormSchema} from '@/database/validation/platform.schemas'
import {ContactFormValues} from '@/database/validation/platform.schemas'

import {InstanceRequestFormValues} from '@/database/validation/platform.schemas'
import {instanceRequestFormSchema} from '@/database/validation/platform.schemas'

//* 1. Funciones de consulta */

/**
 * @version 1
 * @description Función para obtener una plataforma
 * @param name Nombre de la plataforma (por defecto 'subterra')
 * @answer {ok, message, content: PlatformObject}
 */

export async function getOnePlatform(name: string = 'subterra') {
  try {
    // Obtener la plataforma:
    await connectToMongoDB()
    const platform = await Platform.findOne({name: name})
    if (!platform) throw new Error('No se ha encontrado la plataforma')

    // Convertir la plataforma a un objeto plano:
    const platformPOJO = JSON.parse(JSON.stringify(platform))

    // Devolver la plataforma:
    return {
      ok: true,
      message: 'Plataforma obtenida',
      content: platformPOJO as PlatformObject,
    } as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, message: 'Error desconocido'} as Answer
  }
}

//* 2. Gestión de mensajes de contacto */

/**
 * @version 1
 * @description Función para añadir un nuevo mensaje de contacto
 * @param message Cuerpo del mensaje (valores de formulario)
 * @answer {ok, message}
 */

export async function addContactMessage(message: ContactFormValues) {
  try {
    // Validar los datos:
    const validated = await contactFormSchema.parseAsync(message)
    if (!validated) throw new Error('Datos no válidos')

    // Buscar la plataforma subterra:
    await connectToMongoDB()
    const subterra: PlatformDocument | null = await Platform.findOne({
      name: 'subterra',
    })
    if (!subterra) throw new Error('No se ha encontrado la plataforma')

    // Introducir el mensaje en la plataforma:
    const updated = subterra.pushContactMessage(message as ContactMessage)

    if (!updated) throw new Error('No se ha podido añadir el mensaje')

    // Devolver respuesta exitosa:
    return {ok: true, message: 'Mensaje enviado'} as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, message: 'Error desconocido'} as Answer
  }
}

/**
 * @version 1
 * @description Función para eliminar un mensaje de contacto
 * @param messageId ID del mensaje a eliminar
 * @answer {ok, message}
 */

export async function deleteContactMessage(messageId: string) {
  try {
    // Buscar la plataforma subterra:
    await connectToMongoDB()
    const subterra: PlatformDocument | null = await Platform.findOne({
      name: 'subterra',
    })
    if (!subterra) throw new Error('No se ha encontrado la plataforma')

    // Eliminar el mensaje de la plataforma:

    const updated = subterra.removeContactMessage(messageId)
    if (!updated) throw new Error('No se ha podido eliminar el mensaje')

    // Devolver respuesta exitosa:
    return {ok: true, message: 'Mensaje eliminado'} as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, message: 'Error desconocido'} as Answer
  }
}

//* 3. Gestión de solicitudes de instancias */

/**
 * @description Función para añadir una nueva solicitud de creación de instancia
 * @param request Cuerpo de la solicitud (valores de formulario)
 * @returns
 */

export async function addInstanceRequest(request: InstanceRequestFormValues) {
  try {
    // Validar los datos:
    const validated = await instanceRequestFormSchema.parseAsync(request)
    if (!validated) throw new Error('Datos no válidos')

    // Buscar la plataforma subterra:
    await connectToMongoDB()
    const subterra: PlatformDocument | null = await Platform.findOne({
      name: 'subterra',
    })
    if (!subterra) throw new Error('No se ha encontrado la plataforma')

    // Introducir la solicitud en la plataforma:
    const updated = subterra.pushInstanceRequest(request as InstanceRequest)
    if (!updated) throw new Error('No se ha podido añadir la solicitud')

    // Devolver respuesta exitosa:
    return {ok: true, message: 'Solicitud enviada'} as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, message: 'Error desconocido'} as Answer
  }
}

/**
 * @version 1
 * @description Función para eliminar una solicitud de creación de instancia
 * @param requestId ID de la solicitud a eliminar
 * @answer {ok, message}
 */

export async function deleteInstanceRequest(requestId: string) {
  try {
    // Buscar la plataforma subterra:
    await connectToMongoDB()
    const subterra: PlatformDocument | null = await Platform.findOne({
      name: 'subterra',
    })
    if (!subterra) throw new Error('No se ha encontrado la plataforma')

    // Eliminar la solicitud de la plataforma:
    const updated = subterra.removeInstanceRequest(requestId)
    if (!updated) throw new Error('No se ha podido eliminar la solicitud')

    // Devolver respuesta exitosa:
    return {ok: true, message: 'Solicitud eliminada'} as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, message: 'Error desconocido'} as Answer
  }
}
