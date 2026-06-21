export type Theme = 'light' | 'dark'

export interface FieldVisibility {
  photo: boolean
  gender: boolean
  dateOfBirth: boolean
  age: boolean
  maritalStatus: boolean
  address: boolean
  noticePeriod: boolean
  linkedIn: boolean
  github: boolean
  skills: boolean
  languages: boolean
  achievements: boolean
  sideProjects: boolean
  otherInterests: boolean
  education: boolean
  workExperience: boolean
}

export type DetailMode = 'summary' | 'detailed'

export interface FieldDetailModes {
  address: DetailMode
  role: DetailMode
}

export interface Settings {
  theme: Theme
  fieldVisibility: FieldVisibility
  fieldDetailModes: FieldDetailModes
}

export const defaultFieldVisibility: FieldVisibility = {
  photo: true,
  gender: true,
  dateOfBirth: true,
  age: true,
  maritalStatus: true,
  address: true,
  noticePeriod: true,
  linkedIn: true,
  github: true,
  skills: true,
  languages: true,
  achievements: true,
  sideProjects: true,
  otherInterests: true,
  education: true,
  workExperience: true,
}

export const defaultFieldDetailModes: FieldDetailModes = {
  address: 'detailed',
  role: 'detailed',
}

export const defaultSettings: Settings = {
  theme: 'light',
  fieldVisibility: defaultFieldVisibility,
  fieldDetailModes: defaultFieldDetailModes,
}
