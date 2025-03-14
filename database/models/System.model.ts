import {model, models, Schema, Types, Document} from 'mongoose'
import {Topography} from '../types/topography.type'
import {Picture} from '../types/picture.type'
import {Installation} from '../types/installation.type'

//* INTERFACES:

export interface SystemDocument extends Document {
  //* Añadidos por Mongo:
  //  _id: Types.ObjectId
  //  __v: number
  //  createdAt: Date
  //  updataedAt: Date

  //* Manejo de relaciones:
  datatype: 'system'
  instances: Types.ObjectId[]

  //* Datos troncales:
  catalog?: string
  initials?: string[]
  name: string
  alt_names?: string[]

  //* Descripciónes:
  description?: string
  regulations?: boolean
  regulation_description?: string
  exploration_description?: string
  length?: number
  depth?: number
  massif?: string

  //* Datos científicos:
  geolog_age?: string
  geolog_litology?: string
  arqueolog?: string
  paleontolog?: string
  mineralog?: string
  contamination?: string
  biolog?: string
  hidrolog_system?: string
  hidrolog_subsystem?: string

  //* Adjuntos:
  topographies?: Topography[]
  pictures?: Picture[]
  installations?: Installation[]
}

//* ESQUEMA:

const systemSchema = new Schema<SystemDocument>({
  //* Manejo de relaciones:
  datatype: {type: String, required: true, default: 'system'},
  instances: {type: [Schema.Types.ObjectId], ref: 'Instance', required: true},

  //* Datos troncales:
  catalog: {type: String},
  initials: {type: [String]},
  name: {type: String, required: true, unique: true},
  alt_names: {type: [String]},

  //* Datos descriptivos:
  description: {type: String},
  regulations: {type: Boolean},
  regulation_description: {type: String},
  exploration_description: {type: String},
  length: {type: Number},
  depth: {type: Number},
  massif: {type: String},

  //* Datos científicos:
  geolog_age: {type: String},
  geolog_litology: {type: String},
  arqueolog: {type: String},
  paleontolog: {type: String},
  mineralog: {type: String},
  contamination: {type: String},
  biolog: {type: String},
  hidrolog_system: {type: String},
  hidrolog_subsystem: {type: String},

  //* Adjuntos:
  pictures: {
    type: [
      {
        author: {type: String},
        date: {type: Date},
        description: {type: String},
        file_src: {type: String},
        publicId: {type: String},
      },
    ],
  },
  topographies: {
    type: [
      {
        authors: {type: String},
        groups: {type: String},
        date: {type: Date},
        description: {type: String},
        file_src: {type: String},
        publicId: {type: String},
        type: {
          type: String,
          enum: ['plan', 'proyected', 'developed', '3D', 'other'],
        },
      },
    ],
  },

  // TODO: Añadir instalaciones
})

//* MODELO:

const System = models?.System || model<SystemDocument>('System', systemSchema)

export default System
