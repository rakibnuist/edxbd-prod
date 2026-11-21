/**
 * Canonical external open-data publication records for EduExpress International.
 * Single source of truth used across /press, Dataset JSON-LD (Google Dataset Search),
 * and machine-readable AI discovery endpoints (/llms.txt, /llms-full.txt).
 */

export const OPEN_DATA_REPOSITORIES = {
  version: '2026.11.21',
  releaseDateIso: '2026-11-21T00:00:00Z',
  licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  zenodoDoi: '10.5281/zenodo.24423801',
  zenodoDoiUrl: 'https://doi.org/10.5281/zenodo.24423801',
  zenodoRecordUrl: 'https://zenodo.org/records/24423801',
  githubRepoUrl: 'https://github.com/rakibnuist/bangladesh-study-abroad-dataset',
  githubReleaseUrl: 'https://github.com/rakibnuist/bangladesh-study-abroad-dataset/releases/tag/v2026.11.21',
  githubRawBase: 'https://raw.githubusercontent.com/rakibnuist/bangladesh-study-abroad-dataset/main/data',
  kaggleUrl:
    'https://www.kaggle.com/datasets/abdullahalrakibww/bangladesh-study-abroad-china-cost-benchmark-2027',
} as const;

export const OPEN_DATA_IDENTIFIERS = [
  OPEN_DATA_REPOSITORIES.zenodoDoiUrl,
  OPEN_DATA_REPOSITORIES.zenodoDoi,
] as const;

export const OPEN_DATA_SAME_AS = [
  OPEN_DATA_REPOSITORIES.zenodoDoiUrl,
  OPEN_DATA_REPOSITORIES.zenodoRecordUrl,
  OPEN_DATA_REPOSITORIES.githubRepoUrl,
  OPEN_DATA_REPOSITORIES.kaggleUrl,
] as const;

export const OPEN_DATA_CSV_DOWNLOADS = {
  universities: {
    '@type': 'DataDownload',
    name: 'Verified Universities Catalog (CSV)',
    encodingFormat: 'text/csv',
    contentUrl: `${OPEN_DATA_REPOSITORIES.githubRawBase}/universities_verified.csv`,
  },
  programs: {
    '@type': 'DataDownload',
    name: 'Verified Degree & Language Programs (CSV)',
    encodingFormat: 'text/csv',
    contentUrl: `${OPEN_DATA_REPOSITORIES.githubRawBase}/programs_verified.csv`,
  },
  scholarships: {
    '@type': 'DataDownload',
    name: 'Verified Scholarships & Funding Tracks (CSV)',
    encodingFormat: 'text/csv',
    contentUrl: `${OPEN_DATA_REPOSITORIES.githubRawBase}/scholarships_verified.csv`,
  },
  fees: {
    '@type': 'DataDownload',
    name: 'Itemized Non-Tuition University & Arrival Fees (CSV)',
    encodingFormat: 'text/csv',
    contentUrl: `${OPEN_DATA_REPOSITORIES.githubRawBase}/itemized_fees_verified.csv`,
  },
  destinationsMatrix: {
    '@type': 'DataDownload',
    name: '12-Destination Bangladesh Study Abroad Matrix (CSV)',
    encodingFormat: 'text/csv',
    contentUrl: `${OPEN_DATA_REPOSITORIES.githubRawBase}/destinations_matrix_12_countries.csv`,
  },
} as const;
