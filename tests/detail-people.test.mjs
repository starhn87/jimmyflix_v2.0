import assert from 'node:assert/strict'
import test from 'node:test'
import { getCastPeople, getCrewPeople, filterDetailPeople } from '../lib/detail-people.ts'

const actor = (id, overrides = {}) => ({ id, name: `Actor ${id}`, original_name: `Actor ${id}`, profile_path: null, character: 'Guest', ...overrides })
const crew = (id, job, overrides = {}) => ({ id, name: `Crew ${id}`, profile_path: null, job, department: 'Production', ...overrides })

test('cast preserves billing order and merges multiple characters into a single person without mutating the response', () => {
  const source = [actor(2, { order: 2 }), actor(1, { order: 0, character: 'Hero' }), actor(1, { order: 1, character: 'Narrator', profile_path: '/photo.jpg' }), actor(3)]
  const original = structuredClone(source)
  const people = getCastPeople(source, 'Cast member')
  assert.deepEqual(people.map(({ id }) => id), [1, 2, 3])
  assert.deepEqual(people[0].roles.map(({ label }) => label), ['Hero', 'Narrator'])
  assert.equal(people[0].profilePath, '/photo.jpg')
  assert.deepEqual(source, original)
})

test('all cast remain available beyond the former 30-person limit and invalid records are excluded', () => {
  const source = Array.from({ length: 70 }, (_, index) => actor(index + 1))
  const people = getCastPeople([...source, actor(0), actor(80, { name: '', original_name: '' })], '출연')
  assert.equal(people.length, 70)
  assert.equal(people.at(-1).id, 70)
  assert.deepEqual(getCastPeople([], '출연'), [])
  assert.equal(getCastPeople([actor(1, { name: '', original_name: 'Original name', character: '' })], '출연')[0].roles[0].label, '출연')
})

test('crew prioritizes key roles while retaining all departments and every role for the same person', () => {
  const source = [crew(4, 'Visual Effects Supervisor'), crew(2, 'Producer'), crew(1, 'Writer'), crew(1, 'Director'), crew(1, 'Director'), crew(3, 'Foley Artist')]
  const original = structuredClone(source)
  const people = getCrewPeople(source, 'ko')
  assert.deepEqual(people.map(({ id }) => id), [1, 2, 4, 3])
  assert.deepEqual(people[0].roles, [{ key: 'Director', label: '감독' }, { key: 'Writer', label: '작가' }])
  assert.equal(people[3].roles[0].label, 'Foley Artist')
  assert.equal(getCrewPeople([crew(1, 'Director')], 'en')[0].roles[0].label, 'Director')
  assert.deepEqual(source, original)
})

test('search finds local names, original names and characters regardless of accents or case', () => {
  const people = getCastPeople([actor(1, { name: '페드로 파스칼', original_name: 'Pédro Pascal', character: 'Joel Miller' }), actor(2)], '출연')
  for (const query of ['  PEDRO   pascal ', '페드로', 'joel', 'MILLER']) {
    assert.deepEqual(filterDetailPeople(people, query).map(({ id }) => id), [1])
  }
  assert.equal(filterDetailPeople(people, 'nobody').length, 0)
  assert.equal(filterDetailPeople(people, '   ').length, 2)
})

test('role filters match secondary credits and combine with localized and original role search', () => {
  const people = getCrewPeople([crew(1, 'Director'), crew(1, 'Writer'), crew(2, 'Producer')], 'ko')
  assert.deepEqual(filterDetailPeople(people, '', 'Writer').map(({ id }) => id), [1])
  assert.deepEqual(filterDetailPeople(people, '감독', 'Writer').map(({ id }) => id), [1])
  assert.deepEqual(filterDetailPeople(people, 'producer').map(({ id }) => id), [2])
  assert.equal(filterDetailPeople(people, '감독', 'Producer').length, 0)
  assert.equal(filterDetailPeople(people, '', 'Unknown').length, 0)
})
