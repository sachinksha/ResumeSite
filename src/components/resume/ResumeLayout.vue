<template>
  <div id="resume-content" class="resume-layout">
    <ResumeHeader :personalInfo="resume.personalInfo" />

    <ResumeSection title="Introduction" :visible="!!resume.personalInfo.introduction">
      <p class="introduction-text">{{ resume.personalInfo.introduction }}</p>
    </ResumeSection>

    <ResumeSection title="Work Experience" :visible="settings.fieldVisibility.workExperience && resume.workExperience.length > 0">
      <ExperienceCard v-for="(exp, index) in resume.workExperience" :key="index" :experience="exp" />
    </ResumeSection>

    <ResumeSection title="Skills" :visible="settings.fieldVisibility.skills && resume.topSkills.length > 0">
      <SkillsList :skills="resume.topSkills" />
    </ResumeSection>

    <ResumeSection title="Education" :visible="settings.fieldVisibility.education && resume.education.length > 0">
      <EducationEntry v-for="(edu, index) in resume.education" :key="index" :education="edu" />
    </ResumeSection>

    <ResumeSection title="Languages" :visible="settings.fieldVisibility.languages && resume.languages.length > 0">
      <LanguageEntry v-for="(lang, index) in resume.languages" :key="index" :language="lang" />
    </ResumeSection>

    <ResumeSection title="Achievements" :visible="settings.fieldVisibility.achievements && resume.achievements.length > 0">
      <AchievementEntry v-for="(ach, index) in resume.achievements" :key="index" :achievement="ach" />
    </ResumeSection>

    <ResumeSection title="Side Projects" :visible="settings.fieldVisibility.sideProjects && resume.sideProjects.length > 0">
      <ProjectEntry v-for="(proj, index) in resume.sideProjects" :key="index" :project="proj" />
    </ResumeSection>

    <ResumeSection title="Other Interests" :visible="settings.fieldVisibility.otherInterests && resume.otherInterests.length > 0">
      <InterestEntry v-for="(intr, index) in resume.otherInterests" :key="index" :interest="intr" />
    </ResumeSection>

    <ResumeSection title="Personal Details" :visible="hasPersonalDetails">
      <div class="details-grid">
        <div v-if="settings.fieldVisibility.address && (personalInfo.address || personalInfo.addressSummary)" class="detail-row">
          <span class="detail-label">Address</span>
          <span class="detail-value">{{ settings.fieldDetailModes.address === 'summary' ? personalInfo.addressSummary || personalInfo.address : personalInfo.address || personalInfo.addressSummary }}</span>
        </div>
        <div v-if="settings.fieldVisibility.dateOfBirth && personalInfo.dateOfBirth" class="detail-row">
          <span class="detail-label">Date of Birth</span>
          <span class="detail-value">{{ personalInfo.dateOfBirth }}</span>
        </div>
        <div v-if="settings.fieldVisibility.age && personalInfo.age !== null" class="detail-row">
          <span class="detail-label">Age</span>
          <span class="detail-value">{{ personalInfo.age }}</span>
        </div>
        <div v-if="settings.fieldVisibility.gender && personalInfo.gender" class="detail-row">
          <span class="detail-label">Gender</span>
          <span class="detail-value">{{ personalInfo.gender }}</span>
        </div>
        <div v-if="settings.fieldVisibility.maritalStatus && personalInfo.maritalStatus" class="detail-row">
          <span class="detail-label">Marital Status</span>
          <span class="detail-value">{{ personalInfo.maritalStatus }}</span>
        </div>
        <div v-if="settings.fieldVisibility.noticePeriod && personalInfo.noticePeriod" class="detail-row">
          <span class="detail-label">Notice Period</span>
          <span class="detail-value">{{ personalInfo.noticePeriod }}</span>
        </div>
      </div>
    </ResumeSection>

    <footer v-if="resume.lastUpdated" class="resume-footer">
      <p class="last-updated">Last updated: {{ new Date(resume.lastUpdated).toLocaleDateString() }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ResumeData } from '../../types/resume'
import { useSettingsStore } from '../../stores/settingsStore'
import ResumeHeader from './ResumeHeader.vue'
import ResumeSection from './ResumeSection.vue'
import ExperienceCard from './ExperienceCard.vue'
import EducationEntry from './EducationEntry.vue'
import SkillsList from './SkillsList.vue'
import LanguageEntry from './LanguageEntry.vue'
import AchievementEntry from './AchievementEntry.vue'
import ProjectEntry from './ProjectEntry.vue'
import InterestEntry from './InterestEntry.vue'

const props = defineProps<{
  resume: ResumeData
}>()

const settings = useSettingsStore()

const personalInfo = computed(() => props.resume.personalInfo)

const hasPersonalDetails = computed(() => {
  const p = personalInfo.value
  const v = settings.fieldVisibility
  return !!(
    (v.address && (p.address || p.addressSummary)) ||
    (v.dateOfBirth && p.dateOfBirth) ||
    (v.age && p.age !== null) ||
    (v.gender && p.gender) ||
    (v.maritalStatus && p.maritalStatus) ||
    (v.noticePeriod && p.noticePeriod)
  )
})
</script>

<style scoped>
.resume-layout {
  max-width: var(--max-width-content);
  margin: 0 auto;
  padding: var(--spacing-lg);
  background-color: var(--color-bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.introduction-text {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.resume-footer {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
}

.last-updated {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  text-align: center;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-sm);
}

.detail-row {
  display: flex;
  gap: var(--spacing-xs);
}

.detail-label {
  font-weight: 600;
  color: var(--color-text);
  white-space: nowrap;
}

.detail-value {
  color: var(--color-text-secondary);
}
</style>
