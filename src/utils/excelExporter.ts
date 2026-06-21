import * as XLSX from 'xlsx'
import type { ResumeData } from '../types/resume'

export function exportTemplate(): void {
  const wb = XLSX.utils.book_new()

  const personalInfoSheet = XLSX.utils.aoa_to_sheet([
    ['Field', 'Value'],
    ['First Name', ''],
    ['Last Name', ''],
    ['Gender', ''],
    ['Photo', ''],
    ['Date of Birth', ''],
    ['Age', ''],
    ['Designation', ''],
    ['Highest Education', ''],
    ['Total Experience', ''],
    ['Notice Period', ''],
    ['Introduction', ''],
    ['Address', ''],
    ['Address Summary', ''],
    ['Email', ''],
    ['Phone', ''],
    ['LinkedIn', ''],
    ['Github', ''],
    ['Marital Status', ''],
  ])
  XLSX.utils.book_append_sheet(wb, personalInfoSheet, 'Personal Info')

  const experienceSheet = XLSX.utils.aoa_to_sheet([
    ['Company', 'Designation', 'Tech Stack', 'Role', 'Location', 'About Company', 'From', 'To', 'Present'],
  ])
  XLSX.utils.book_append_sheet(wb, experienceSheet, 'Work Experience')

  const skillsSheet = XLSX.utils.aoa_to_sheet([
    ['Skill'],
  ])
  XLSX.utils.book_append_sheet(wb, skillsSheet, 'Skills')

  const educationSheet = XLSX.utils.aoa_to_sheet([
    ['Degree', 'College', 'Location', 'Passed'],
  ])
  XLSX.utils.book_append_sheet(wb, educationSheet, 'Education')

  const languagesSheet = XLSX.utils.aoa_to_sheet([
    ['Language', 'Proficiency'],
  ])
  XLSX.utils.book_append_sheet(wb, languagesSheet, 'Languages')

  const achievementsSheet = XLSX.utils.aoa_to_sheet([
    ['Achievement', 'Description'],
  ])
  XLSX.utils.book_append_sheet(wb, achievementsSheet, 'Achievements')

  const projectsSheet = XLSX.utils.aoa_to_sheet([
    ['Project', 'Description'],
  ])
  XLSX.utils.book_append_sheet(wb, projectsSheet, 'Projects')

  const interestsSheet = XLSX.utils.aoa_to_sheet([
    ['Interest', 'Description'],
  ])
  XLSX.utils.book_append_sheet(wb, interestsSheet, 'Interests')

  XLSX.writeFile(wb, 'Resume-Template.xlsx')
}

export function exportResumeToExcel(data: ResumeData): void {
  const wb = XLSX.utils.book_new()

  const personalInfoData: string[][] = [
    ['Field', 'Value'],
    ['First Name', data.personalInfo.firstName],
    ['Last Name', data.personalInfo.lastName],
    ['Gender', data.personalInfo.gender],
    ['Photo', data.personalInfo.photo ?? ''],
    ['Date of Birth', data.personalInfo.dateOfBirth],
    ['Age', data.personalInfo.age?.toString() ?? ''],
    ['Designation', data.personalInfo.designation],
    ['Highest Education', data.personalInfo.highestEducation],
    ['Total Experience', data.personalInfo.totalExperience],
    ['Notice Period', data.personalInfo.noticePeriod],
    ['Introduction', data.personalInfo.introduction],
    ['Address', data.personalInfo.address],
    ['Address Summary', data.personalInfo.addressSummary],
    ['Email', data.personalInfo.email],
    ['Phone', data.personalInfo.phone],
    ['LinkedIn', data.personalInfo.linkedIn],
    ['Github', data.personalInfo.github],
    ['Marital Status', data.personalInfo.maritalStatus],
  ]
  const personalInfoSheet = XLSX.utils.aoa_to_sheet(personalInfoData)
  XLSX.utils.book_append_sheet(wb, personalInfoSheet, 'Personal Info')

  const experienceData: string[][] = [
    ['Company', 'Designation', 'Tech Stack', 'Role', 'Location', 'About Company', 'From', 'To', 'Present'],
    ...data.workExperience.map(exp => [
      exp.company,
      exp.designation,
      exp.techStack.join(', '),
      exp.role,
      exp.location,
      exp.aboutCompany,
      exp.from,
      exp.to,
      exp.isPresent ? 'Yes' : 'No',
    ]),
  ]
  const experienceSheet = XLSX.utils.aoa_to_sheet(experienceData)
  XLSX.utils.book_append_sheet(wb, experienceSheet, 'Work Experience')

  const skillsData: string[][] = [
    ['Skill'],
    ...data.topSkills.map(s => [s.name]),
  ]
  const skillsSheet = XLSX.utils.aoa_to_sheet(skillsData)
  XLSX.utils.book_append_sheet(wb, skillsSheet, 'Skills')

  const educationData: string[][] = [
    ['Degree', 'College', 'Location', 'Passed'],
    ...data.education.map(e => [e.degree, e.college, e.location, e.passed]),
  ]
  const educationSheet = XLSX.utils.aoa_to_sheet(educationData)
  XLSX.utils.book_append_sheet(wb, educationSheet, 'Education')

  const languagesData: string[][] = [
    ['Language', 'Proficiency'],
    ...data.languages.map(l => [l.name, l.proficiency]),
  ]
  const languagesSheet = XLSX.utils.aoa_to_sheet(languagesData)
  XLSX.utils.book_append_sheet(wb, languagesSheet, 'Languages')

  const achievementsData: string[][] = [
    ['Achievement', 'Description'],
    ...data.achievements.map(a => [a.name, a.description]),
  ]
  const achievementsSheet = XLSX.utils.aoa_to_sheet(achievementsData)
  XLSX.utils.book_append_sheet(wb, achievementsSheet, 'Achievements')

  const projectsData: string[][] = [
    ['Project', 'Description'],
    ...data.sideProjects.map(p => [p.name, p.description]),
  ]
  const projectsSheet = XLSX.utils.aoa_to_sheet(projectsData)
  XLSX.utils.book_append_sheet(wb, projectsSheet, 'Projects')

  const interestsData: string[][] = [
    ['Interest', 'Description'],
    ...data.otherInterests.map(i => [i.name, i.description]),
  ]
  const interestsSheet = XLSX.utils.aoa_to_sheet(interestsData)
  XLSX.utils.book_append_sheet(wb, interestsSheet, 'Interests')

  XLSX.writeFile(wb, 'Resume-Data.xlsx')
}
