export interface PersonalInfo {
  firstName: string
  lastName: string
  gender: string
  photo: string | null
  dateOfBirth: string
  age: number | null
  designation: string
  highestEducation: string
  totalExperience: string
  noticePeriod: string
  introduction: string
  address: string
  addressSummary: string
  email: string
  phone: string
  linkedIn: string
  github: string
  maritalStatus: string
}

export interface WorkExperience {
  company: string
  designation: string
  techStack: string[]
  duration: string
  role: string
  location: string
  aboutCompany: string
  from: string
  to: string
  isPresent: boolean
}

export interface Education {
  degree: string
  college: string
  location: string
  passed: string
}

export interface Skill {
  name: string
}

export interface Language {
  name: string
  proficiency: string
}

export interface Achievement {
  name: string
  description: string
}

export interface Project {
  name: string
  description: string
}

export interface Interest {
  name: string
  description: string
}

export interface ResumeData {
  personalInfo: PersonalInfo
  workExperience: WorkExperience[]
  topSkills: Skill[]
  education: Education[]
  languages: Language[]
  achievements: Achievement[]
  sideProjects: Project[]
  otherInterests: Interest[]
  lastUpdated: string
}

export const defaultResumeData: ResumeData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    gender: '',
    photo: null,
    dateOfBirth: '',
    age: null,
    designation: '',
    highestEducation: '',
    totalExperience: '',
    noticePeriod: '',
    introduction: '',
    address: '',
    addressSummary: '',
    email: '',
    phone: '',
    linkedIn: '',
    github: '',
    maritalStatus: '',
  },
  workExperience: [],
  topSkills: [],
  education: [],
  languages: [],
  achievements: [],
  sideProjects: [],
  otherInterests: [],
  lastUpdated: '',
}
