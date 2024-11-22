import mongoose, {InferSchemaType} from 'mongoose'

//! 1. ESQUEMA:
export const userSchema = new mongoose.Schema(
  {
    OAuthId: {type: String},
    name: {type: String, required: true, unique: true},
    fullname: {type: String},
    email: {type: String, required: true, unique: true},
    email_verified: {type: Date, default: false},
    password: {type: String},
    image: {type: String},
    instances: {type: Array<mongoose.Schema.Types.ObjectId>, ref: 'Instance'},
    groups: {type: Array<mongoose.Schema.Types.ObjectId>, ref: 'Group'},
    fav_caves: {type: Array<mongoose.Schema.Types.ObjectId>, ref: 'Cave'},
    fav_systems: {type: Array<mongoose.Schema.Types.ObjectId>, ref: 'System'},
    fav_explorations: {
      type: Array<mongoose.Schema.Types.ObjectId>,
      ref: 'Exploration',
    },
  },
  {timestamps: true}
)

// Método para obtener referencia de este item:
userSchema.methods.getReference = function () {
  return {
    id: this._id.toString(),
    name: this.name,
  }
}
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    // Serializar datos para evitar conflictos con client components de Next:
    return JSON.parse(JSON.stringify(ret))
  },
})

//! 2. MODELO:
const UserModel = mongoose.models?.User || mongoose.model('User', userSchema)

export default UserModel

//! 3. TIPOS:
type UserDocument = InferSchemaType<typeof userSchema>

// Tipo con los campos groups, instance_roles y group_roles poblados y la _id añadida como string:
type FieldsToRewrite =
  | 'groups'
  | 'favourites'
  | 'instance_roles'
  | 'group_roles'
export type User = Omit<UserDocument, FieldsToRewrite> & {
  _id: string
  groups: Array<{_id: string; name: string}>
  favourites: {
    caves: Array<{_id: string; name: string}>
    systems: Array<{_id: string; name: string}>
    explorations: Array<{_id: string; name: string}>
  }
  instance_roles: {
    viewer: Array<{_id: string; name: string}>
    editor: Array<{_id: string; name: string}>
  }
  group_roles: {
    member: Array<{_id: string; name: string}>
    admin: Array<{_id: string; name: string}>
  }
}
