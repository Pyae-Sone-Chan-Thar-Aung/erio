// Map country names (as in DB) to region and sub-region for Partner Universities modal

export const REGIONS = {
  ASIA_PACIFIC: 'Asia Pacific',
  EUROPE: 'Europe',
  AMERICAS: 'Americas'
}

// Sub-regions per region (keys used in UI and filtering)
export const SUB_REGIONS = {
  [REGIONS.ASIA_PACIFIC]: [
    { id: 'asean', label: 'ASEAN' },
    { id: 'east_asia', label: 'East Asia' },
    { id: 'south_asia', label: 'South Asia' },
    { id: 'oceania', label: 'Oceania' }
  ],
  [REGIONS.EUROPE]: [
    { id: 'western_europe', label: 'Western Europe' },
    { id: 'northern_europe', label: 'Northern Europe' },
    { id: 'eastern_europe', label: 'Eastern Europe' },
    { id: 'southern_europe', label: 'Southern Europe' }
  ],
  [REGIONS.AMERICAS]: [
    { id: 'north_america', label: 'North America' },
    { id: 'central_america_caribbean', label: 'Central America & Caribbean' },
    { id: 'south_america', label: 'South America' }
  ]
}

// ASEAN member countries (common name variations as in DB)
const ASEAN_COUNTRIES = [
  'Brunei', 'Cambodia', 'Indonesia', 'Lao PDR', 'Laos', 'Malaysia', 'Myanmar',
  'Philippines', 'Singapore', 'Thailand', 'Vietnam'
]

const EAST_ASIA_COUNTRIES = ['Japan', 'Korea', 'South Korea', 'Taiwan', 'Hong Kong', 'Macau', 'China']
const SOUTH_ASIA_COUNTRIES = ['India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Bhutan', 'Maldives']
const OCEANIA_COUNTRIES = ['Australia', 'New Zealand', 'Fiji', 'Papua New Guinea', 'Samoa', 'Solomon Islands']

const WESTERN_EUROPE_COUNTRIES = ['United Kingdom', 'UK', 'France', 'Germany', 'Belgium', 'Netherlands', 'Ireland', 'Switzerland', 'Austria', 'Spain', 'Portugal']
const NORTHERN_EUROPE_COUNTRIES = ['Finland', 'Sweden', 'Norway', 'Denmark', 'Iceland', 'Estonia', 'Latvia', 'Lithuania']
const EASTERN_EUROPE_COUNTRIES = ['Georgia', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Ukraine', 'Russia']
const SOUTHERN_EUROPE_COUNTRIES = ['Italy', 'Greece', 'Croatia', 'Serbia', 'Slovenia', 'Malta', 'Cyprus']

const NORTH_AMERICA_COUNTRIES = ['USA', 'United States', 'Canada', 'Mexico']
const CENTRAL_AMERICA_CARIBBEAN_COUNTRIES = ['Jamaica', 'Cuba', 'Costa Rica', 'Panama', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua', 'Belize', 'Bahamas', 'Dominican Republic', 'Trinidad and Tobago', 'Haiti', 'Barbados']
const SOUTH_AMERICA_COUNTRIES = ['Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela', 'Ecuador', 'Bolivia', 'Paraguay', 'Uruguay', 'Suriname', 'Guyana']

const subRegionToCountries = {
  asean: ASEAN_COUNTRIES,
  east_asia: EAST_ASIA_COUNTRIES,
  south_asia: SOUTH_ASIA_COUNTRIES,
  oceania: OCEANIA_COUNTRIES,
  western_europe: WESTERN_EUROPE_COUNTRIES,
  northern_europe: NORTHERN_EUROPE_COUNTRIES,
  eastern_europe: EASTERN_EUROPE_COUNTRIES,
  southern_europe: SOUTHERN_EUROPE_COUNTRIES,
  north_america: NORTH_AMERICA_COUNTRIES,
  central_america_caribbean: CENTRAL_AMERICA_CARIBBEAN_COUNTRIES,
  south_america: SOUTH_AMERICA_COUNTRIES
}

const regionByCountry = {}
const subRegionByCountry = {}

function registerCountry(countries, region, subRegionId) {
  countries.forEach(c => {
    regionByCountry[c.toLowerCase()] = region
    subRegionByCountry[c.toLowerCase()] = subRegionId
  })
}

Object.entries(subRegionToCountries).forEach(([subId, countries]) => {
  if (['asean', 'east_asia', 'south_asia', 'oceania'].includes(subId)) {
    registerCountry(countries, REGIONS.ASIA_PACIFIC, subId)
  } else if (['western_europe', 'northern_europe', 'eastern_europe', 'southern_europe'].includes(subId)) {
    registerCountry(countries, REGIONS.EUROPE, subId)
  } else {
    registerCountry(countries, REGIONS.AMERICAS, subId)
  }
})

/**
 * Get region (Asia Pacific | Europe | Americas) for a country name.
 */
export function getRegionForCountry(country) {
  if (!country) return null
  return regionByCountry[country.trim().toLowerCase()] || null
}

/**
 * Get sub-region id (e.g. 'asean', 'east_asia') for a country name.
 */
export function getSubRegionForCountry(country) {
  if (!country) return null
  return subRegionByCountry[country.trim().toLowerCase()] || null
}

/**
 * Filter partners that belong to the given region.
 */
export function filterPartnersByRegion(partners, region) {
  return partners.filter(p => getRegionForCountry(p.country) === region)
}

/**
 * Filter partners that belong to the given sub-region id (e.g. 'asean').
 */
export function filterPartnersBySubRegion(partners, subRegionId) {
  const countries = subRegionToCountries[subRegionId]
  if (!countries) return []
  const lower = countries.map(c => c.toLowerCase())
  return partners.filter(p => lower.includes((p.country || '').trim().toLowerCase()))
}
