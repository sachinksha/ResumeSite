# Project Outline

Website to showcase a given person's profile in a resume/CV format. AI reader friendly as well as human friendly.

## Tech Stack
- **Frontend**: Vite + Vue 3.5 + TypeScript 6
- **Runtime**: Bun 1.3
- **State**: Pinia 3
- **Routing**: Vue Router 5
- **Excel**: SheetJS (xlsx)
- **PDF**: html2canvas + jsPDF
- **Build**: `bun run build` (vue-tsc + vite)

## Architecture

### Data Source
Resume data is read from a **static Excel file** at `public/resume-data.xlsx` (tracked in git). The developer replaces this file to update the resume. Website users cannot manipulate the data.

A placeholder photo lives at `public/resume-photo.svg`. The Excel's "Photo" field references this path (`/resume-photo.svg`). Replace with a real image and update the reference as needed.

### Views
1. **My CV** (`/`) — auto-loads `resume-data.xlsx` on mount and renders the resume with current settings applied.
2. **Settings** (`/settings`) — Field visibility toggles, address detail mode (summary/detailed), theme (light/dark), import/export panel (template download, Excel upload for testing, photo upload/URL, PDF export). Includes a live preview of the resume.

### Excel Format (8-sheet multi-sheet template)
| Sheet | Columns |
|---|---|
| Personal Info | Field, Value |
| Work Experience | Company, Designation, Tech Stack, Role, Location, About Company, From, To, Present |
| Skills | Skill |
| Education | Degree, College, Location, Passed |
| Languages | Language, Proficiency |
| Achievements | Achievement, Description |
| Projects | Project, Description |
| Interests | Interest, Description |

### Parser
- `parseResumeExcel()` auto-detects multi-sheet (8-sheet) vs single-sheet (legacy reference) format.
- Handles sparse array holes (XLSX bug with empty cells), date serial conversion (integers 30000–100000), and flexible field name matching.

### Rendering
- **ResumeHeader**: Photo (circular, 100px), full name, designation, subtitle (education + experience), email, phone, LinkedIn, GitHub.
- **Sections** (in order): Introduction, Work Experience, Skills, Education, Languages, Achievements, Side Projects, Other Interests, Personal Details.
- **Personal Details** (at bottom): Address (respects `fieldDetailModes.address` — summary vs detailed), Date of Birth, Age, Gender, Marital Status, Notice Period. Each gated by field visibility settings.
- **PDF export**: Full (all fields) or filtered (with current visibility settings). A4 size, multi-page via html2canvas + jsPDF.

### Settings (persisted to localStorage)
- **Field Visibility**: Toggle each field on/off (photo, gender, dateOfBirth, age, maritalStatus, address, noticePeriod, linkedIn, github, skills, languages, achievements, sideProjects, otherInterests, education, workExperience).
- **Field Detail Modes**: Address (summary / detailed).
- **Theme**: Light / Dark (via `data-theme` CSS custom properties).

### Photo Handling
- Excel "Photo" field accepts a URL or path (e.g., `/resume-photo.svg`).
- Settings page allows direct image upload (PNG/JPG/WebP → base64 data URL) or URL input.
- `store.setPhoto()` is independent of Excel load so re-uploading Excel doesn't clear a manually-set photo.

## Next Phase Ideas
- **Design view**: Drag-and-drop block rearrangement for the resume layout.
- **Responsive / mobile**: Optimize for phone-sized viewports.
- **Collapse/expand**: Work experience cards and other sections collapsible.
- **More detail modes**: Role descriptions, project descriptions (summary vs detailed).
- **Google auth + Firebase**: User accounts, cloud storage for resume data.
- **Edit-in-place**: Directly edit fields in the Settings preview.
- **Multiple resumes**: Switch between different resume profiles.
- **Dynamic field ordering**: Reorder sections via settings.
- **Multi-language support**: i18n for the resume fields.
