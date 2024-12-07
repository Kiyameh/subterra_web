'use server'
import {connectToMongoDB} from '@/database/databaseConection'
import User from '@/database/models/User.model'
import Instance from '@/database/models/Instance.model'

import Group, {
  GroupDocument,
  PopulatedGroup,
} from '@/database/models/Group.model'
import {Answer} from '@/database/types/answer.type'
import {decodeMongoError} from '@/database/tools/decodeMongoError'

import {
  GroupFormSchema,
  GroupFormValues,
} from '@/database/validation/group.schema'
import mongoose from 'mongoose'

/**
 * Función para crear un grupo
 * @param values datos del formulario
 * @param commander _id del creador del grupo
 * @returns <Answer> respuesta de la petición
 * Redirect: /group/:name
 */
export async function createOneGroup(
  values: GroupFormValues,
  commander: string
): Promise<Answer> {
  try {
    // Validación:
    const validated = await GroupFormSchema.parseAsync(values)
    if (!validated || !commander) {
      return {ok: false, message: 'Datos no válidos'} as Answer
    }

    // Crear nuevo grupo con los valores de miembro y admin asignados:
    const newGroup = new Group({
      ...values,
      admin: commander,
      members: [commander],
    })

    // Iniciar transacción para garantizar la integridad de los datos
    //? https://mongoosejs.com/docs/transactions.html

    const conection = await connectToMongoDB()
    const session = await conection.startSession()
    session.startTransaction()

    // Insertar el grupo en el usuario como memberOf y adminOf:
    const updatedUser = await User.findOneAndUpdate(
      {_id: commander},
      {
        $push: {memberOf: newGroup._id, adminOf: newGroup._id},
      },
      {session: session}
    )

    // Guardar el nuevo grupo:
    const savedGroup = await newGroup.save({session: session})

    if (!savedGroup || !updatedUser) {
      session.endSession()
      return {ok: false, message: 'Algo ha ido mal'} as Answer
    }

    await session.commitTransaction()
    session.endSession()

    return {
      ok: true,
      message: 'Grupo creado correctamente',
      redirect: `/group/${values.name}`,
    } as Answer
  } catch (e) {
    return decodeMongoError(e)
  }
}

/**
 * Función para editar un grupo
 * @param values datos del formulario
 * @param groupId_id del grupo
 * @param commanderId _id del usuario que edita
 * @returns <Answer> respuesta de la petición
 */

export async function updateOneGroup(
  values: GroupFormValues,
  groupId: string,
  commanderId: string
): Promise<Answer> {
  try {
    // Validación:
    const validated = await GroupFormSchema.parseAsync(values)
    if (!validated) {
      return {
        ok: false,
        code: 400,
        message: 'Datos no válidos',
      } as Answer
    }

    // Obtener grupo a editar:
    await connectToMongoDB()
    const groupToUpdate = await Group.findById(groupId)
    if (!groupToUpdate) {
      return {
        ok: false,
        code: 404,
        message: 'Grupo no encontrado',
      } as Answer
    }

    // Comprobar si el ordenante es el admin del grupo:
    const commanderIsAdmin = groupToUpdate.admin.toString() === commanderId
    if (!commanderIsAdmin) {
      return {
        ok: false,
        code: 403,
        message: 'No tienes permisos para editar este grupo',
      } as Answer
    }

    // Actualización de grupo:
    Object.assign(groupToUpdate, values)
    await groupToUpdate.save()
    return {
      ok: true,
      code: 200,
      message: 'Grupo actualizado correctamente',
    } as Answer
  } catch (e) {
    return decodeMongoError(e)
  }
}

/**
 * Función para obtener todos los grupos
 * @returns
 * answer{
 * ok: boolean,
 * code: number,
 * message: string,
 * content?: PopulatedGroup[]
 * } */

export async function getAllGroups() {
  try {
    await connectToMongoDB()
    const allGroups: GroupDocument[] | null = await Group.find()
      .populate({path: 'admin', model: User})
      .populate({path: 'members', model: User})
      .populate({path: 'instances', model: Instance})
      .populate({path: 'member_requests.user', model: User})
      .exec()
    //.populate({path: 'explorations', model: Exploration})//TODO: Añadir cuando este el tipo hecho
    const allGroupsPOJO = allGroups.map((group) => {
      //? Transforma a objeto plano para poder pasar a componentes cliente de Next
      return JSON.parse(JSON.stringify(group))
    })
    return {
      ok: true,
      code: 200,
      message: 'Grupos obtenidos',
      content: allGroupsPOJO as PopulatedGroup[],
    } as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, code: 500, message: 'Error desconocido'} as Answer
  }
}

/**
 * Función para obtener un grupo
 * @param name <string> nombre del grupo
 * @returns <Answer> respuesta de la petición
 * Content: POJO del grupo
 */

export async function getOneGroup(name: string) {
  try {
    await connectToMongoDB()
    const group: GroupDocument | null = await Group.findOne({name: name})
      .populate({path: 'admin', model: User})
      .populate({path: 'members', model: User})
      .populate({path: 'instances', model: Instance})
      .populate({path: 'member_requests.user', model: User})
      .exec()
    //.populate({path: 'explorations', model: 'Exploration'})//TODO: Añadir cuando este el tipo hecho
    const groupPOJO = JSON.parse(JSON.stringify(group))
    return {
      ok: true,
      code: 200,
      message: 'Grupo obtenido',
      content: groupPOJO as PopulatedGroup,
    } as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, code: 500, message: 'Error desconocido'} as Answer
  }
}

/**
 * Función para añadir una petición de miembro
 * @param groupId <string> _id del grupo
 * @param request <{user: string, message: string}> datos de la petición
 * @returns <Answer> respuesta de la petición
 */

export async function addMemberRequest(
  groupId: string,
  request: {user: string; message: string}
) {
  try {
    await connectToMongoDB()
    const group: GroupDocument | null = await Group.findById(groupId)
    if (!group) {
      return {ok: false, code: 404, message: 'Grupo no encontrado'} as Answer
    }

    const existingRequest = group.member_requests.find(
      (groupRequest) => groupRequest.user.toString() === request.user
    )

    if (existingRequest) {
      return {
        ok: false,
        code: 400,
        message: 'Ya existe una solicitud',
      } as Answer
    }
    group.member_requests.push({
      _id: new mongoose.Types.ObjectId(),
      message: request.message,
      user: new mongoose.Types.ObjectId(request.user),
    })
    const updatedGroup = await group.save()
    if (!updatedGroup) {
      return {ok: false, code: 404, message: 'Error desconocido'} as Answer
    }
    return {
      ok: true,
      code: 200,
      message: 'Solicitud de miembro añadida',
    } as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, code: 500, message: 'Error desconocido'} as Answer
  }
}

/**
 * Función para aceptar una solicitud de miembro
 * @param groupId <string> _id del grupo
 * @param requestId <string> _id de la solicitud
 * @returns <Answer> respuesta de la petición
 */

export async function acceptMemberRequest(groupId: string, requestId: string) {
  try {
    await connectToMongoDB()
    const group: GroupDocument | null = await Group.findById(groupId)
      .populate({path: 'member_requests.user', model: User})
      .exec()

    if (!group) {
      return {ok: false, code: 404, message: 'Grupo no encontrado'} as Answer
    }

    const requestIndex = group.member_requests.findIndex(
      (request) => request._id.toString() === requestId
    )

    if (requestIndex === -1) {
      return {
        ok: false,
        code: 404,
        message: 'Solicitud no encontrada',
      } as Answer
    }

    // Transferir id aceptada al array de members

    group.members.push(group.member_requests[requestIndex].user._id)
    group.member_requests.splice(requestIndex, 1)
    await group.save()

    return {
      ok: true,
      code: 200,
      message: 'Solicitud aceptada y miembro añadido',
    } as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, code: 500, message: 'Error desconocido'} as Answer
  }
}

/**
 * Función para rechazar una solicitud de miembro
 * @param groupId <string> _id del grupo
 * @param requestId <string> _id de la solicitud
 * @returns <Answer> respuesta de la petición
 */

export async function rejectMemberRequest(groupId: string, requestId: string) {
  try {
    await connectToMongoDB()
    const group: GroupDocument | null = await Group.findById(groupId)
    if (!group) {
      return {ok: false, code: 404, message: 'Grupo no encontrado'} as Answer
    }

    const requestIndex = group.member_requests.findIndex(
      (request) => request._id.toString() === requestId
    )

    if (requestIndex === -1) {
      return {
        ok: false,
        code: 404,
        message: 'Solicitud no encontrada',
      } as Answer
    }

    // Eliminar solicitud del array de member_requests
    group.member_requests.splice(requestIndex, 1)
    await group.save()

    return {ok: true, code: 200, message: 'Solicitud rechazada'} as Answer
  } catch (error) {
    console.error(error)
    return {ok: false, code: 500, message: 'Error desconocido'} as Answer
  }
}
