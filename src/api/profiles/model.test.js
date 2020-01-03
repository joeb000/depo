import { Profiles } from '.'

let profiles

beforeEach(async () => {
  profiles = await Profiles.create({ name: 'test', image: 'test', address: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = profiles.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(profiles.id)
    expect(view.name).toBe(profiles.name)
    expect(view.image).toBe(profiles.image)
    expect(view.address).toBe(profiles.address)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = profiles.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(profiles.id)
    expect(view.name).toBe(profiles.name)
    expect(view.image).toBe(profiles.image)
    expect(view.address).toBe(profiles.address)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
