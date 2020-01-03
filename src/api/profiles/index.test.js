import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Profiles } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, profiles

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  profiles = await Profiles.create({})
})

test('POST /profiles 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, name: 'test', image: 'test', address: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.name).toEqual('test')
  expect(body.image).toEqual('test')
  expect(body.address).toEqual('test')
})

test('POST /profiles 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /profiles 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /profiles/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${profiles.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(profiles.id)
})

test('GET /profiles/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /profiles/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${profiles.id}`)
    .send({ access_token: userSession, name: 'test', image: 'test', address: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(profiles.id)
  expect(body.name).toEqual('test')
  expect(body.image).toEqual('test')
  expect(body.address).toEqual('test')
})

test('PUT /profiles/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${profiles.id}`)
  expect(status).toBe(401)
})

test('PUT /profiles/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: userSession, name: 'test', image: 'test', address: 'test' })
  expect(status).toBe(404)
})

test('DELETE /profiles/:id 204 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${profiles.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(204)
})

test('DELETE /profiles/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${profiles.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /profiles/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${profiles.id}`)
  expect(status).toBe(401)
})

test('DELETE /profiles/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})
