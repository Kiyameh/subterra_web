'use server'
import {connectToMongoDB} from '@/database/databaseConection'
import {Answer} from '@/database/types/answer.type'

import Group from '@/database/models/Group.model'
import User from '@/database/models/User.model'
import Platform from '@/database/models/Platform.model'
import {PlatformDocument} from '@/database/models/Platform.model'

import Instance from '@/database/models/Instance.model'
import {InstanceObject} from '@/database/models/Instance.model'
import {InstanceIndex} from '@/database/models/Instance.model'
import {InstanceDocument} from '@/database/models/Instance.model'
import {PopulatedInstance} from '@/database/models/Instance.model'

import {InstanceFormValues} from '@/database/validation/instance.schemas'
import {InstanceFormSchema} from '@/database/validation/instance.schemas'
import {UpdateInstanceFormValues} from '@/database/validation/instance.schemas'
import {UpdateInstanceFormSchema} from '@/database/validation/instance.schemas'
import Cave from '../models/Cave.model'
import System from '../models/System.model'
import Exploration from '../models/Exploration.model'

//* 1. Funciones de escritura */

/**
 * @version 1
 * @description Función para crear una nueva instancia
 * @param values InstanceFormValues (Incluidos owner y coordinator)
 * @param commanderId string (Miembro del staff)
 */

export async function createInstance(
  values: InstanceFormValues,
  commanderId: string
): Promise<Answer> {
  try {
    // Validación:
    const validated = await InstanceFormSchema.parseAsync(values)
    if (!validated) {
      return {ok: false, message: 'Datos no validos'} as Answer
    }

    // Validar staff
    await connectToMongoDB()
    const subterra: PlatformDocument | null = await Platform.findOne({
      name: 'subterra',
    })
    const isStaff = subterra?.checkIsStaff(commanderId)
    if (!isStaff) throw new Error('No es staff de Subterra')

    // Iniciar transacción para garantizar la integridad de los datos
    //? https://mongoosejs.com/docs/transactions.html

    const conection = await connectToMongoDB()
    const session = await conection.startSession()
    session.startTransaction()

    // Crear nueva instancia con los valores:
    const newInstance = new Instance(values)

    // Obtener el grupo owner e insertar instancia:
    const group = await Group.findOne({_id: values.owner})
    const owner = group.pushInstance(newInstance._id, session)

    // Obtener el usuario coordinador e insertar instancia:
    const user = await User.findOne({_id: values.coordinator})
    const coordinator = user.pushCoordinatorOf(newInstance._id, session)

    // Guardar la nueva instancia:
    const savedInstance = await newInstance.save({session: session})

    if (!savedInstance || !owner || !coordinator) {
      session.abortTransaction()
      session.endSession()
      throw new Error('Error al guardar la instancia')
    }

    await session.commitTransaction()
    session.endSession()

    return {
      ok: true,
      message: 'Instancia creada correctamente',
    } as Answer
  } catch (error) {
    console.error(error)
    return {
      ok: false,
      message: 'Algo ha ido mal, consulta el error',
    } as Answer
  }
}

/**
 * @version 1
 * @description Función para actualizar una instancia
 * @param values datos de formulario
 * @param instanceId _id de la instancia
 * @param commanderId _id del usuario que edita
 */

export async function updateInstance(
  values: UpdateInstanceFormValues,
  instanceId: string,
  commanderId: string
): Promise<Answer> {
  try {
    // Validación:
    const validated = await UpdateInstanceFormSchema.parseAsync(values)
    if (!validated) {
      return {ok: false, message: 'Datos no validos'} as Answer
    }

    // Obtener instancia a editar:
    await connectToMongoDB()
    const instanceToUpdate = await Instance.findById(instanceId)
    if (!instanceToUpdate) throw new Error('Instancia no encontrada')

    // Comprobar si el usuario es coordinador de la instancia
    const commanderIsCoordinator = await checkIsCoordinator(
      instanceToUpdate.name,
      commanderId
    )
    if (!commanderIsCoordinator.ok)
      throw new Error('No es coordinador de instancia')

    // Actualización de la instancia:
    Object.assign(instanceToUpdate, values)
    await instanceToUpdate.save()
    return {
      ok: true,
      message: 'Instancia actualizada',
      redirect: `/instance/${instanceToUpdate.name}`,
    } as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, message: 'Error desconocido'} as Answer
  }
}

//* 2. Funciones de consulta */

/**
 * @version 1
 * @description Función para obtener el índice de instancias
 * @returns content: Índice de instancias con los campos _id, name, fullname, territory e is_online
 */

export async function getInstancesIndex() {
  try {
    await connectToMongoDB()
    const instancesIndex = await Instance.find()
      .select('_id name fullname territory is_online')
      .exec()

    //? Transforma a objeto plano para poder pasar a componentes cliente de Next
    const instancesIndexPOJO = instancesIndex.map((instance) => {
      return JSON.parse(JSON.stringify(instance))
    })

    return {
      ok: true,
      message: 'Índice de instancias obtenido',
      content: instancesIndexPOJO as InstanceIndex[],
    } as Answer
  } catch (error) {
    console.error(error)
    return {
      ok: false,
      message: 'Error desconocido',
    } as Answer
  }
}

/**
 * @version 1
 * @description Función para obtener todas las instancias
 * @returns content: Todas las instancias con los campos coordinator, owner, editor y viewers poblados como índice
 */

export async function getAllInstances() {
  try {
    await connectToMongoDB()
    const allInstances = await Instance.find()
      .populate({
        path: 'coordinator',
        select: '_id name fullname image',
        model: User,
      })
      .populate({
        path: 'owner',
        select: '_id name fullname province',
        model: Group,
      })
      .populate({
        path: 'editors',
        select: '_id name fullname image',
        model: User,
      })
      .populate({
        path: 'viewers',
        select: '_id name fullname image',
        model: User,
      })
      .exec()
    const allInstancesPOJO = allInstances.map((instance) => {
      //? Transforma a objeto plano para poder pasar a componentes cliente de Next
      return JSON.parse(JSON.stringify(instance))
    })
    return {
      ok: true,
      message: 'Instancias obtenidas',
      content: allInstancesPOJO as PopulatedInstance[],
    } as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, message: 'Error desconocido'} as Answer
  }
}

/**
 * @version 1
 * @description Función para obtener algunas instancias
 * @param ids string[] (Array de ids de instancias)
 * @returns content: Instancias con los campos coordinator, owner, editor y viewers poblados como índice
 */

export async function getSomeInstances(ids: string[] | undefined) {
  try {
    await connectToMongoDB()
    const someInstances = await Instance.find({
      _id: {$in: ids},
    })
      .populate({
        path: 'coordinator',
        select: '_id name fullname image',
        model: User,
      })
      .populate({
        path: 'owner',
        select: '_id name fullname province',
        model: Group,
      })
      .populate({
        path: 'editors',
        select: '_id name fullname image',
        model: User,
      })
      .populate({
        path: 'viewers',
        select: '_id name fullname image',
        model: User,
      })
      .exec()
    const someInstancesPOJO = someInstances.map((instance) => {
      //? Transforma a objeto plano para poder pasar a componentes cliente de Next
      return JSON.parse(JSON.stringify(instance))
    })
    return {
      ok: true,
      message: 'Instancias obtenidas',
      content: someInstancesPOJO as PopulatedInstance[],
    } as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, message: 'Error desconocido'} as Answer
  }
}

/**
 * @version 1
 * @description Función para obtener una instancia por su nombre
 * @param name string (Nombre de la instancia)
 * @returns content: Instancia con los campos coordinator, owner, editor y viewers poblados como índice
 */

export async function getOneInstance(name: string) {
  try {
    await connectToMongoDB()
    const instance: InstanceDocument | null = await Instance.findOne({
      name: name,
    })
      .populate({
        path: 'coordinator',
        select: '_id name fullname image email',
        model: User,
      })
      .populate({
        path: 'owner',
        select: '_id name fullname province',
        model: Group,
      })
      .populate({
        path: 'editors',
        select: '_id name fullname image  email',
        model: User,
      })
      .populate({
        path: 'viewers',
        select: '_id name fullname image  email',
        model: User,
      })
      .exec()
    //? Transforma a objeto plano para poder pasar a componentes cliente de Next
    const instancePOJO = JSON.parse(JSON.stringify(instance))
    return {
      ok: true,
      message: 'Instancia obtenida',
      content: instancePOJO as PopulatedInstance,
    } as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, message: 'Error desconocido'} as Answer
  }
}

/**
 * @version 1
 * @description Función para obtener las estadisticas de una instancia
 * @param instanceId string (id de la instancia)
 */

export async function getInstanceStats(instanceId: string) {
  try {
    await connectToMongoDB()
    const numberOfCaves = await Cave.countDocuments({
      instances: {$in: [instanceId]},
    })
    const numberOfSystems = await System.countDocuments({
      instances: {$in: [instanceId]},
    })
    const numberOfExplorations = await Exploration.countDocuments({
      instances: {$in: [instanceId]},
    })

    console.log(numberOfCaves, numberOfSystems, numberOfExplorations)

    return {
      ok: true,
      message: 'Estadisticas obtenidas',
      content: {
        numberOfCaves,
        numberOfSystems,
        numberOfExplorations,
      },
    } as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, message: 'Error desconocido'} as Answer
  }
}

//* 3. Funciones de membresía */

/**
 * @version 1
 * @description Función para comprobar si un usuario es editor de una instancia
 * @param instanceName nombre de la instancia
 * @param userId _id del usuario
 */
export async function checkIsEditor(
  userId: string | undefined | null,
  instanceName?: string | null,
  instanceId?: string | null
) {
  try {
    await connectToMongoDB()
    let matchingInstance: InstanceDocument | null = null

    if (instanceName) {
      matchingInstance = await Instance.findOne({
        name: instanceName,
        editors: {$in: [userId]},
      })
    } else if (instanceId) {
      matchingInstance = await Instance.findOne({
        _id: instanceId,
        editors: {$in: [userId]},
      })
    }

    if (!matchingInstance) {
      return {ok: false, message: 'No eres editor'} as Answer
    }
    return {ok: true, message: 'Eres editor'} as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, message: 'Error desconocido'} as Answer
  }
}

/**
 * @version 1
 * @description Función para comprobar si un usuario es coordinador de una instancia
 * @param instanceName nombre de la instancia
 * @param userId _id del usuario
 */

export async function checkIsCoordinator(
  instanceName: string,
  userId: string | undefined | null
) {
  try {
    await connectToMongoDB()
    const matchingInstance: InstanceDocument | null = await Instance.findOne({
      name: instanceName,
      coordinator: userId,
    })
    if (!matchingInstance) {
      return {ok: false, message: 'No eres coordinador'} as Answer
    }
    return {ok: true, message: 'Eres coordinador'} as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, message: 'Error desconocido'} as Answer
  }
}

/**
 * @version 1
 * @description Función para eliminasr un editor de una instancia
 * @param instanceId _id de la instancia
 * @param userId _id del usuario
 *
 */

export async function removeEditor(instanceId: string, userId: string | null) {
  try {
    await connectToMongoDB()
    const instance: InstanceDocument | null =
      await Instance.findById(instanceId)
    if (!instance) throw new Error('Instancia no encontrada')

    const isEditor = await checkIsEditor(userId, instance.name)
    if (!userId || !isEditor.ok)
      throw new Error('No eres editor de esta instancia')

    const updated = await instance.removeEditor(userId)
    if (!updated) throw new Error('Error al eliminar el editor')

    return {ok: true, message: 'Editor eliminado'} as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, message: 'Error desconocido'} as Answer
  }
}

/**
 * @version 1
 * @description Función para promocionar un editor como coordinador
 * @param instanceId _id de la instancia
 * @param userId _id del usuario
 */

export async function promoteCoordinator(
  instanceId: string,
  userId: string | null
) {
  try {
    await connectToMongoDB()
    const instance: InstanceDocument | null =
      await Instance.findById(instanceId)
    if (!instance) throw new Error('Instancia no encontrada')

    const isEditor = await checkIsEditor(userId, instance.name)
    if (!userId || !isEditor.ok)
      throw new Error('No eres editor de esta instancia')

    const updated = await instance.setCoordinator(userId)
    if (!updated) throw new Error('Error al promocionar el editor')

    return {ok: true, message: 'Editor promocionado'} as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, message: 'Error desconocido'} as Answer
  }
}

export async function getInstanceId(
  instanceName: string
): Promise<string | null> {
  try {
    await connectToMongoDB()
    const instance: InstanceObject | null = await Instance.findOne({
      name: instanceName,
    })
      .select('_id')
      .exec()

    if (!instance) throw new Error('Instancia no encontrada')
    return instance._id.toString()
  } catch (error) {
    console.error(error)
    return null
  }
}
