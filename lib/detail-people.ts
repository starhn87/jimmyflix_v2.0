import type { Locale } from '@/lib/i18n'
import type { CastMember, CrewMember } from '@/types/tmdb'

export interface DetailPerson {
  id: number
  name: string
  originalName: string
  profilePath: string | null
  roles: Array<{ key: string; label: string }>
}

export interface PeopleMessages {
  viewAll: string
  close: string
  searchCast: string
  searchCrew: string
  filterRole: string
  allRoles: string
  noResults: string
  clearFilters: string
  results: string
  loadMore: string
  previous: string
  next: string
}

export const PEOPLE_PREVIEW_LIMIT = 12
export const PEOPLE_PAGE_SIZE = 40

const crewJobOrder = [
  'Director', 'Creator', 'Screenplay', 'Writer', 'Executive Producer', 'Producer',
  'Director of Photography', 'Original Music Composer',
]

const koreanCrewJobs: Record<string, string> = {
  Director: '감독', Creator: '크리에이터', Screenplay: '각본', Writer: '작가',
  'Executive Producer': '총괄 프로듀서', Producer: '프로듀서',
  'Director of Photography': '촬영 감독', 'Original Music Composer': '음악 감독',
  Editor: '편집', Casting: '캐스팅', 'Production Design': '프로덕션 디자인',
  'Art Direction': '미술 감독', 'Costume Design': '의상 디자인',
  'Set Decoration': '세트 장식', 'Visual Effects Supervisor': '시각효과 감독',
  'Stunt Coordinator': '스턴트 코디네이터', Stunts: '스턴트',
}

function mergePeople(entries: Array<DetailPerson>): DetailPerson[] {
  const people = new Map<number, DetailPerson>()
  for (const entry of entries) {
    if (!Number.isInteger(entry.id) || entry.id <= 0 || !entry.name) continue
    const person = people.get(entry.id)
    if (!person) {
      people.set(entry.id, entry)
      continue
    }
    person.profilePath ||= entry.profilePath
    person.originalName ||= entry.originalName
    for (const role of entry.roles) {
      if (!person.roles.some(({ key }) => key === role.key)) person.roles.push(role)
    }
  }
  return [...people.values()]
}

export function getCastPeople(cast: CastMember[], fallbackRole: string): DetailPerson[] {
  return mergePeople([...cast]
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity))
    .map((person) => ({
      id: person.id,
      name: person.name?.trim() || person.original_name?.trim() || '',
      originalName: person.original_name || '',
      profilePath: person.profile_path,
      roles: [{ key: person.character?.trim() || '', label: person.character?.trim() || fallbackRole }],
    })))
}

export function getCrewPeople(crew: CrewMember[], locale: Locale): DetailPerson[] {
  const priority = (job: string) => {
    const index = crewJobOrder.indexOf(job)
    return index < 0 ? crewJobOrder.length : index
  }
  return mergePeople([...crew]
    .sort((a, b) => priority(a.job) - priority(b.job))
    .map((person) => ({
      id: person.id,
      name: person.name?.trim() || person.original_name?.trim() || '',
      originalName: person.original_name || '',
      profilePath: person.profile_path,
      roles: [{
        key: person.job || person.department,
        label: (locale === 'ko' ? koreanCrewJobs[person.job] : undefined) || person.job || person.department,
      }],
    })))
}

const normalizeSearch = (value: string) => value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase()

export function filterDetailPeople(people: DetailPerson[], query: string, role = ''): DetailPerson[] {
  const words = normalizeSearch(query).trim().split(/\s+/).filter(Boolean)
  return people.filter((person) => {
    if (role && !person.roles.some(({ key }) => key === role)) return false
    const text = normalizeSearch([
      person.name, person.originalName, ...person.roles.flatMap(({ key, label }) => [key, label]),
    ].join(' '))
    return words.every((word) => text.includes(word))
  })
}
