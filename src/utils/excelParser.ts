import * as XLSX from 'xlsx'
import type { ResumeData, PersonalInfo, WorkExperience, Education, Skill, Language, Achievement, Project, Interest } from '../types/resume'

function excelSerialToDate(serial: number): string {
  const date = new Date((serial - 25569) * 86400000)
  if (isNaN(date.getTime())) return String(serial)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function tryParseDate(str: string): string {
  const num = Number(str)
  if (str && Number.isInteger(num) && num >= 30000 && num <= 100000) {
    return excelSerialToDate(num)
  }
  return str
}

function parseCell(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value).trim()
}

function normalizeRow(row: unknown[]): unknown[] {
  return Array.from({ length: row.length }, (_, i) => row[i])
}

function hasContent(row: unknown[]): boolean {
  for (let i = 0; i < row.length; i++) {
    const cell = row[i]
    if (cell !== undefined && cell !== null && String(cell).trim() !== '') return true
  }
  return false
}

function filterRows(data: unknown[][]): string[][] {
  return data.filter(hasContent).map(row => normalizeRow(row).map(c => parseCell(c)))
}

function detectFormat(workbook: XLSX.WorkBook): 'multi-sheet' | 'single-sheet' {
  const expected = ['Personal Info', 'Work Experience', 'Skills', 'Education', 'Languages']
  const lower = workbook.SheetNames.map(n => n.toLowerCase())
  const count = expected.filter(s => lower.includes(s.toLowerCase())).length
  return count >= 2 ? 'multi-sheet' : 'single-sheet'
}

function getMapFromRows(rows: string[][]): Map<string, string> {
  const map = new Map<string, string>()
  for (const row of rows) {
    if (row.length >= 2 && row[0]) {
      map.set(row[0].toLowerCase(), row[1])
    }
  }
  return map
}

function getMapValue(map: Map<string, string>, ...patterns: string[]): string {
  for (const pattern of patterns) {
    for (const [k, v] of map) {
      if (k.includes(pattern.toLowerCase())) return v
    }
  }
  return ''
}

function buildPersonalInfoFromMap(map: Map<string, string>): PersonalInfo {
  const fullName = getMapValue(map, 'full name')
  const firstName = getMapValue(map, 'first name')
  const lastName = getMapValue(map, 'last name')

  let finalFirst = firstName
  let finalLast = lastName

  if (fullName && !firstName && !lastName) {
    const parts = fullName.split(' ').filter(Boolean)
    finalFirst = parts[0] || ''
    finalLast = parts.slice(1).join(' ') || ''
  }

  return {
    firstName: finalFirst,
    lastName: finalLast,
    gender: getMapValue(map, 'gender'),
    photo: getMapValue(map, 'photo', 'photo url') || null,
    dateOfBirth: tryParseDate(getMapValue(map, 'date of birth', 'dob', 'birth date')),
    age: (() => {
      const v = getMapValue(map, 'age')
      return v ? Number(v) : null
    })(),
    designation: getMapValue(map, 'designation'),
    highestEducation: getMapValue(map, 'highest education', 'highest education '),
    totalExperience: getMapValue(map, 'total work experience', 'total experience', 'work experience'),
    noticePeriod: getMapValue(map, 'notice period'),
    introduction: getMapValue(map, 'introduction'),
    address: getMapValue(map, 'address'),
    addressSummary: getMapValue(map, 'address summary'),
    email: getMapValue(map, 'email'),
    phone: getMapValue(map, 'phone'),
    linkedIn: getMapValue(map, 'linkedin'),
    github: getMapValue(map, 'github'),
    maritalStatus: getMapValue(map, 'marital status'),
  }
}

function findRowIndex(rows: Record<number, string[]>, max: number, predicate: (r: string[]) => boolean): number {
  for (let i = 0; i <= max; i++) {
    if (rows[i] && predicate(rows[i])) return i
  }
  return -1
}

function parseWorkExperience(dataRows: string[][]): WorkExperience[] {
  if (dataRows.length < 1) return []
  const [header, ...rows] = dataRows

  const col = (pattern: string): number => {
    return header.findIndex(h => h.toLowerCase().includes(pattern))
  }

  const ci = {
    company: col('company'),
    designation: col('designation'),
    techStack: [col('tech stack'), col('tech')].find(i => i >= 0) ?? -1,
    role: col('role'),
    location: col('location'),
    aboutCompany: [col('about the company'), col('about company')].find(i => i >= 0) ?? -1,
    from: col('from'),
    to: col('to'),
  }

  return rows.map(row => ({
    company: row[ci.company] || '',
    designation: row[ci.designation] || '',
    techStack: (row[ci.techStack] || '').split(',').map(s => s.trim()).filter(Boolean),
    duration: '',
    role: row[ci.role] || '',
    location: row[ci.location] || '',
    aboutCompany: row[ci.aboutCompany] || '',
    from: tryParseDate(row[ci.from] || ''),
    to: tryParseDate(row[ci.to] || ''),
    isPresent: false,
  }))
}

function parseSingleSheet(workbook: XLSX.WorkBook): ResumeData {
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const raw = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as unknown[][]
  const allRows = filterRows(raw)

  const rowMap: Record<number, string[]> = {}
  allRows.forEach((r, i) => { rowMap[i] = r })

  const infoMap = new Map<string, string>()
  const KEY_ROWS: Array<[number, number, string]> = [
    [0, 1, 'Full Name'],
    [1, 1, 'Designation'],
    [2, 1, 'Total work experience'],
    [3, 1, 'Notice period'],
    [4, 1, 'Introduction'],
  ]
  for (const [ri, vi, label] of KEY_ROWS) {
    const r = rowMap[ri]
    if (r && r[vi - 1] && r[0].toLowerCase().includes(label.toLowerCase().slice(0, 4))) {
      infoMap.set(label.toLowerCase(), r[vi] || '')
    }
  }

  const personalInfo = buildPersonalInfoFromMap(infoMap)

  const rawExp = infoMap.get('total work experience') || ''
  const rawNum = Number(rawExp)
  if (rawExp && !isNaN(rawNum) && rawExp.split(' ').length === 1) {
    personalInfo.totalExperience = `${rawNum} years`
  }

  const eduHeaderIdx = findRowIndex(rowMap, 30, r => r[0].toLowerCase().includes('highest education'))
  const education: Education[] = []
  if (eduHeaderIdx >= 0) {
    const eduRow = rowMap[eduHeaderIdx + 1]
    if (eduRow) {
      const edu: Education = {
        degree: eduRow[0] || '',
        college: eduRow[1] || '',
        location: eduRow[2] || '',
        passed: tryParseDate(eduRow[3] || ''),
      }
      if (edu.degree || edu.college) {
        education.push(edu)
        personalInfo.highestEducation = edu.degree
      }
    }
  }

  const skills: Skill[] = []
  for (let i = 6; i <= 9; i++) {
    const r = rowMap[i]
    if (!r) continue
    const start = (i === 6 && r[0].toLowerCase().includes('top skills')) ? 1 : 0
    for (let j = start; j < r.length; j++) {
      if (r[j]) {
        r[j].split(',').map(s => s.trim()).filter(Boolean).forEach(s => {
          skills.push({ name: s })
        })
      }
    }
  }

  const expHeaderIdx = findRowIndex(rowMap, 30, r =>
    r[0].toLowerCase().includes('company') && r.length >= 3
  )
  let workExperience: WorkExperience[] = []
  if (expHeaderIdx >= 0) {
    const header = rowMap[expHeaderIdx]
    const dataRows: string[][] = [header]
    let i = expHeaderIdx + 1
    while (i < 200) {
      const r = rowMap[i]
      if (!r || !r[0]) break
      if (r[0].toLowerCase().includes('highest education')) break
      dataRows.push(r)
      i++
    }
    workExperience = parseWorkExperience(dataRows)
  }

  const languages: Language[] = []
  const langRowIdx = findRowIndex(rowMap, 50, r => r[0].toLowerCase().includes('languages'))
  if (langRowIdx >= 0) {
    const langRow = rowMap[langRowIdx]
    const langStr = langRow[1] || langRow[0]
    if (langStr && !langStr.toLowerCase().includes('languages')) {
      langStr.split(',').map(s => s.trim()).filter(Boolean).forEach(entry => {
        const parts = entry.split('-').map(p => p.trim())
        if (parts.length >= 2) {
          languages.push({ name: parts[0], proficiency: parts.slice(1).join('-') })
        } else {
          languages.push({ name: entry, proficiency: '' })
        }
      })
    }
  }

  const interests: Interest[] = []
  if (eduHeaderIdx >= 0) {
    const eduDataRow = rowMap[eduHeaderIdx + 1]
    if (eduDataRow && eduDataRow.length > 5) {
      const col5 = eduDataRow[5] ? String(eduDataRow[5]).trim() : ''
      const col6 = eduDataRow[6] ? String(eduDataRow[6]).trim() : ''
      const rawInterest = col5.toLowerCase().includes('other interest') || !col5 ? col6 : col5
      if (rawInterest && !rawInterest.toLowerCase().includes('other interest')) {
        rawInterest.split(',').map(s => s.trim()).filter(Boolean).forEach(name => {
          interests.push({ name, description: '' })
        })
      }
    }
  }

  const extraFields = ['address', 'email', 'phone', 'linkedin', 'github', 'photo']
  for (const field of extraFields) {
    const idx = findRowIndex(rowMap, 50, r => r[0].toLowerCase().includes(field))
    if (idx >= 0) {
      infoMap.set(field, rowMap[idx][1] || '')
    }
  }

  const lastUpdatedIdx = findRowIndex(rowMap, 50, r => r[0].toLowerCase().includes('last updated'))
  const lastUpdated = lastUpdatedIdx >= 0 ? tryParseDate(rowMap[lastUpdatedIdx][1] || '') : new Date().toISOString()

  const genderIdx = findRowIndex(rowMap, 50, r => r[5]?.toLowerCase().includes('gender'))
  if (genderIdx >= 0) {
    infoMap.set('gender', rowMap[genderIdx][6] || rowMap[genderIdx][5] || '')
  }

  const maritalIdx = findRowIndex(rowMap, 50, r => r[5]?.toLowerCase().includes('marital status'))
  if (maritalIdx >= 0) {
    infoMap.set('marital status', rowMap[maritalIdx][6] || rowMap[maritalIdx][5] || '')
  }

  personalInfo.photo = infoMap.get('photo') || personalInfo.photo
  personalInfo.gender = infoMap.get('gender') || personalInfo.gender
  personalInfo.maritalStatus = infoMap.get('marital status') || personalInfo.maritalStatus
  personalInfo.address = infoMap.get('address') || personalInfo.address
  personalInfo.email = infoMap.get('email') || personalInfo.email
  personalInfo.phone = infoMap.get('phone') || personalInfo.phone
  personalInfo.linkedIn = infoMap.get('linkedin') || personalInfo.linkedIn
  personalInfo.github = infoMap.get('github') || personalInfo.github

  return {
    personalInfo,
    workExperience,
    topSkills: skills,
    education,
    languages,
    achievements: [],
    sideProjects: [],
    otherInterests: interests,
    lastUpdated,
  }
}

function parseMultiSheet(workbook: XLSX.WorkBook): ResumeData {
  const readSheet = (name: string): string[][] => {
    const idx = workbook.SheetNames.findIndex(s => s.toLowerCase() === name.toLowerCase())
    if (idx === -1) return []
    return filterRows(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[idx]], { header: 1 }))
  }

  const piRows = readSheet('Personal Info')
  const piMap = getMapFromRows(piRows)
  const personalInfo = buildPersonalInfoFromMap(piMap)

  const expRows = readSheet('Work Experience')
  const workExperience = parseWorkExperience(expRows)

  const eduRows = readSheet('Education')
  let education: Education[] = []
  if (eduRows.length > 1) {
    const [, ...data] = eduRows
    education = data.filter(r => r.length >= 1).map(row => ({
      degree: row[0] || '',
      college: row[1] || '',
      location: row[2] || '',
      passed: tryParseDate(row[3] || ''),
    }))
  }

  const skills: Skill[] = []
  const skRows = readSheet('Skills')
  if (skRows.length > 1) {
    const [, ...data] = skRows
    data.filter(r => r.length >= 1).forEach(row => skills.push({ name: row[0] || '' }))
  }

  const languages: Language[] = []
  const langRows = readSheet('Languages')
  if (langRows.length > 1) {
    const [, ...data] = langRows
    data.filter(r => r.length >= 2).forEach(row => languages.push({ name: row[0] || '', proficiency: row[1] || '' }))
  }

  const parseND = (name: string): Array<{ name: string; description: string }> => {
    const rows = readSheet(name)
    if (rows.length > 1) {
      const [, ...data] = rows
      return data.filter(r => r.length >= 2).map(row => ({ name: row[0] || '', description: row[1] || '' }))
    }
    return []
  }

  const parseProjects = (): Project[] => {
    const rows = readSheet('Projects')
    if (rows.length <= 1) return []
    const [, ...data] = rows
    return data.filter(r => r.length >= 1).map(row => ({
      name: row[0] || '',
      description: row[1] || '',
      link: row[2] || undefined,
    }))
  }

  const parseInterests = (): Interest[] => {
    const rows = readSheet('Interests')
    if (rows.length <= 1) return []
    const [, ...data] = rows
    return data.filter(r => r.length >= 1 && r[0]).map(row => ({
      name: row[0] || '',
      description: row[1] || '',
    }))
  }

  return {
    personalInfo,
    workExperience,
    topSkills: skills,
    education,
    languages,
    achievements: parseND('Achievements') as Achievement[],
    sideProjects: parseProjects(),
    otherInterests: parseInterests(),
    lastUpdated: new Date().toISOString(),
  }
}

export function parseResumeExcel(file: ArrayBuffer): ResumeData {
  try {
    const workbook = XLSX.read(file, { type: 'array', cellDates: false })

    if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error('Excel file has no sheets')
    }

    const format = detectFormat(workbook)
    const result = format === 'multi-sheet' ? parseMultiSheet(workbook) : parseSingleSheet(workbook)

    const p = result.personalInfo
    if (!p.firstName && !p.lastName && !p.email && result.workExperience.length === 0) {
      throw new Error(
        'Could not find resume data. Ensure the Excel file has fields like "Full Name", "Designation", "Email" etc. ' +
        'Supported formats: single-sheet layout or multi-sheet template.'
      )
    }

    return result
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('Could not find')) {
      throw err
    }
    if (err instanceof Error) {
      throw new Error(`Failed to parse Excel file: ${err.message}`)
    }
    throw new Error('Failed to parse Excel file: Unknown error')
  }
}
