'use server'
import {connectToMongoDB} from '@/database/databaseConection'
import {Answer} from '@/database/types/answer.type'
import {decodeMongoError} from '@/database/tools/decodeMongoError'
import {checkIsEditor} from './instance.services'
import {
  ExplorationFormSchema,
  ExplorationFormValues,
} from '../validation/exploration.schemas'
import Exploration from '../models/Exploration.model'
import Cave from '../models/Cave.model'
import Group from '../models/Group.model'

//* 1. Funciones de escritura */

/**
 * @version 1
 * @description Crea una nueva exploración en la base de datos
 * @param values datos del formulario
 * @param instanceName Nombre de la instancia a la que pertenece la exploración
 * @param commanderId id del usuario que crea la exploración
 * @returns redirect: `/exploration/[explorationId]`
 */

export async function createExploration(
  values: ExplorationFormValues,
  instanceName: string,
  commanderId: string
): Promise<Answer> {
  try {
    // Validar los datos:
    const validated = await ExplorationFormSchema.parseAsync(values)
    if (!validated || !commanderId) {
      return {ok: false, message: 'Datos no válidos'} as Answer
    }

    // Comprobar si el commander es editor de la instancia
    const isEditor = checkIsEditor(commanderId, instanceName)
    if (!isEditor) throw new Error('El usuario no es editor de la instancia')

    // Crear la nueva exploración en memoria:
    const newExploration = new Exploration(values)

    await connectToMongoDB()
    const savedExploration = await newExploration.save()

    return {
      ok: true,
      message: 'Exploración creada',
      redirect: `/exploration/${savedExploration._id}`,
    } as Answer
  } catch (error) {
    return decodeMongoError(error)
  }
}

/**
 * @version 1
 * @description Actualiza los datos de una exploración en la base de datos
 * @param values datos del formulario
 * @param explorationId id de la exploración a actualizar
 * @param instanceName Nombre de la instancia a la que pertenece la exploración
 * @param commanderId id del usuario que actualiza la exploración
 * @returns redirect: `/exploration/[explorationId]`
 */

export async function updateExploration(
  values: ExplorationFormValues,
  explorationId: string,
  instanceName: string,
  commanderId: string
): Promise<Answer> {
  try {
    // Validar los datos:
    const validated = await ExplorationFormSchema.parseAsync(values)
    if (!validated || !commanderId) {
      return {ok: false, message: 'Datos no válidos'} as Answer
    }

    // Comprobar si el commander es editor de la instancia
    const isEditor = checkIsEditor(commanderId, instanceName)
    if (!isEditor) throw new Error('El usuario no es editor de la instancia')

    // Actualizar la exploración en memoria:
    await connectToMongoDB()
    const updatedExploration = await Exploration.findByIdAndUpdate(
      explorationId,
      values,
      {new: true}
    )

    return {
      ok: true,
      message: 'Exploración actualizada',
      redirect: `/exploration/${updatedExploration._id}`,
    } as Answer
  } catch (error) {
    return decodeMongoError(error)
  }
}

//* 2. Funciones de lectura */

/**
 * @version 1
 * @description Obtiene el índice de exploraciones de una instancia
 * @param instanceName Nombre de la instancia
 * @returns content: Índice de exploraciones con los campos _id, name, dates, caves
 */

export async function getExplorationsIndex(
  instanceName: string
): Promise<Answer> {
  try {
    await connectToMongoDB()
    const explorations = await Exploration.find({instance: instanceName})
      .select('_id name dates caves')
      .exec()

    //? Transforma a objeto plano para poder pasar a componentes cliente de Next
    const explorationsPOJO = explorations.map((exploration) => {
      return JSON.parse(JSON.stringify(exploration))
    })

    return {
      ok: true,
      message: 'Índice de exploraciones obtenido',
      data: explorationsPOJO,
    } as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, message: 'Error desconocido'} as Answer
  }
}

/**
 * @version 1
 * @description Obtiene los datos de una exploración
 * @param explorationId id de la exploración
 * @returns content: Datos de la exploración con caves y group poblados
 */

export async function getOneExploration(
  explorationId: string
): Promise<Answer> {
  try {
    await connectToMongoDB()
    const exploration = await Exploration.findById(explorationId)
      .populate({path: 'caves', model: Cave})
      .populate({path: 'groups', model: Group})
      .exec()

    if (!exploration) throw new Error('Exploración no encontrada')

    return {
      ok: true,
      message: 'Exploración obtenida',
      data: exploration,
    } as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, message: 'Error desconocido'} as Answer
  }
}

/**
 * @version 1
 * @description Obtiene los datos de varias exploraciónes
 * @param explorationIds ids de las exploraciones
 * @returns content: Datos de las exploraciones
 *
 */
export async function getSomeExplorations(
  explorationIds: string[]
): Promise<Answer> {
  try {
    await connectToMongoDB()
    const explorations = await Exploration.find({
      _id: {$in: explorationIds},
    }).exec()

    //? Transforma a objeto plano para poder pasar a componentes cliente de Next
    const explorationsPOJO = explorations.map((exploration) => {
      return JSON.parse(JSON.stringify(exploration))
    })

    return {
      ok: true,
      message: 'Exploraciones obtenidas',
      data: explorationsPOJO,
    } as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, message: 'Error desconocido'} as Answer
  }
}

//* 3. Funciones de adición */

/**
 * @version 1
 * @description Añadir una exploración a una cueva
 * @param explorationId id de la exploración
 * @param caveId id de la cueva
 * @param commanderId id del usuario que añade la exploració
 * @param instanceName: string nombre de la instancia
 */

export async function addExplorationToCave(
  explorationId: string,
  caveId: string,
  commanderId: string,
  instanceName: string
): Promise<Answer> {
  try {
    // Comprobar si el commander es editor de la instancia
    const isEditor = checkIsEditor(commanderId, instanceName)
    if (!isEditor) throw new Error('El usuario no es editor de la instancia')

    const conection = await connectToMongoDB()

    const cave = await Cave.findById(caveId)
    const exploration = await Exploration.findById(explorationId)

    if (!cave || !exploration)
      throw new Error('Cueva o exploración no encontrada')

    const session = await conection.startSession()
    session.startTransaction()

    // Añadir la exploración a la cueva
    const updatedCave = cave.pushExploration(explorationId, session)
    // Añadir la cueva a la exploración
    const updatedExploration = exploration.pushCave(caveId, session)

    if (!updatedCave || !updatedExploration)
      throw new Error('Error al añadir la exploración a la cueva')

    session.commitTransaction()
    session.endSession()

    return {
      ok: true,
      message: 'Exploración añadida a la cueva',
    } as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, message: 'Error desconocido'} as Answer
  }
}

/**
 * @version 1
 * @description Eliminar exploración de una cueva
 * @param explorationId id de la exploración
 * @param caveId id de la cueva
 * @param commanderId id del usuario que elimina la exploración
 * @param instanceName nombre de la instancia
 *
 */

export async function removeExplorationFromCave(
  explorationId: string,
  caveId: string,
  commanderId: string,
  instanceName: string
): Promise<Answer> {
  try {
    // Comprobar si el commander es editor de la instancia
    const isEditor = checkIsEditor(commanderId, instanceName)
    if (!isEditor) throw new Error('El usuario no es editor de la instancia')

    const conection = await connectToMongoDB()

    const cave = await Cave.findById(caveId)
    const exploration = await Exploration.findById(explorationId)

    if (!cave || !exploration)
      throw new Error('Cueva o exploración no encontrada')

    const session = await conection.startSession()
    session.startTransaction()

    // Eliminar la exploración de la cueva
    const updatedCave = cave.removeExploration(explorationId, session)
    // Eliminar la cueva de la exploración
    const updatedExploration = exploration.removeCave(caveId, session)

    if (!updatedCave || !updatedExploration)
      throw new Error('Error al eliminar la exploración de la cueva')

    session.commitTransaction()
    session.endSession()

    return {
      ok: true,
      message: 'Exploración eliminada de la cueva',
    } as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, message: 'Error desconocido'} as Answer
  }
}

/**
 * @version 1
 * @description Añadir una exploración a un grupo
 * @param explorationId id de la exploración
 * @param groupId id del grupo
 * @param commanderId id del usuario que añade la exploración
 * @param instanceName nombre de la instancia
 *
 */

export async function addExplorationToGroup(
  explorationId: string,
  groupId: string,
  commanderId: string,
  instanceName: string
): Promise<Answer> {
  try {
    // Comprobar si el commander es editor de la instancia
    const isEditor = checkIsEditor(commanderId, instanceName)
    if (!isEditor) throw new Error('El usuario no es editor de la instancia')

    const conection = await connectToMongoDB()

    const group = await Group.findById(groupId)
    const exploration = await Exploration.findById(explorationId)

    if (!group || !exploration)
      throw new Error('Grupo o exploración no encontrada')

    const session = await conection.startSession()
    session.startTransaction()

    // Añadir la exploración al grupo
    const updatedGroup = group.pushExploration(explorationId, session)
    // Añadir el grupo a la exploración
    const updatedExploration = exploration.pushGroup(groupId, session)

    if (!updatedGroup || !updatedExploration)
      throw new Error('Error al añadir la exploración al grupo')

    session.commitTransaction()
    session.endSession()

    return {
      ok: true,
      message: 'Exploración añadida al grupo',
    } as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, message: 'Error desconocido'} as Answer
  }
}

/**
 * @version 1
 * @description Eliminar exploración de un grupo
 * @param explorationId id de la exploración
 * @param groupId id del grupo
 * @param commanderId id del usuario que elimina la exploración
 * @param instanceName nombre de la instancia
 */

export async function removeExplorationFromGroup(
  explorationId: string,
  groupId: string,
  commanderId: string,
  instanceName: string
): Promise<Answer> {
  try {
    // Comprobar si el commander es editor de la instancia
    const isEditor = checkIsEditor(commanderId, instanceName)
    if (!isEditor) throw new Error('El usuario no es editor de la instancia')

    const conection = await connectToMongoDB()

    const group = await Group.findById(groupId)
    const exploration = await Exploration.findById(explorationId)

    if (!group || !exploration)
      throw new Error('Grupo o exploración no encontrada')

    const session = await conection.startSession()
    session.startTransaction()

    // Eliminar la exploración del grupo
    const updatedGroup = group.removeExploration(explorationId, session)
    // Eliminar el grupo de la exploración
    const updatedExploration = exploration.removeGroup(groupId, session)

    if (!updatedGroup || !updatedExploration)
      throw new Error('Error al eliminar la exploración del grupo')

    session.commitTransaction()
    session.endSession()

    return {
      ok: true,
      message: 'Exploración eliminada del grupo',
    } as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, message: 'Error desconocido'} as Answer
  }
}