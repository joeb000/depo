import { success, notFound } from '../../services/response/'
import { Profiles } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Profiles.create(body)
    .then((profiles) => profiles.view(true))
    .then(success(res, 201))
    .catch(next)

export const newProfile = (req, res, next) => {
  return Profiles.create(req.profile)
  .then((profiles) => profiles.view(true))
  .then(success(res, 201))
  .catch(next)
}

export const getAddressData = async (req, res, next) => {
  console.log(req.params)
  try {
    let p = await Profiles.findOne({addressLower: req.params.address.toLowerCase()})
    console.log(p)
    res.send(p)
  } catch (error) {
    console.log(error)
    next()
  }
}


export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Profiles.count(query)
    .then(count => Profiles.find(query, select, cursor)
      .then((profiles) => ({
        count,
        rows: profiles.map((profiles) => profiles.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Profiles.findById(params.id)
    .then(notFound(res))
    .then((profiles) => profiles ? profiles.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Profiles.findById(params.id)
    .then(notFound(res))
    .then((profiles) => profiles ? Object.assign(profiles, body).save() : null)
    .then((profiles) => profiles ? profiles.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Profiles.findById(params.id)
    .then(notFound(res))
    .then((profiles) => profiles ? profiles.remove() : null)
    .then(success(res, 204))
    .catch(next)
