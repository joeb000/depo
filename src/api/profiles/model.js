import mongoose, { Schema } from 'mongoose'

const profilesSchema = new Schema({
  name: {
    type: String
  },
  image: {
    type: String
  },
  address: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

profilesSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      name: this.name,
      image: this.image,
      address: this.address,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Profiles', profilesSchema)

export const schema = model.schema
export default model
