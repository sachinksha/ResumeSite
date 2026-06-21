<template>
  <div class="resume-header">
    <div v-if="settings.fieldVisibility.photo && personalInfo.photo" class="photo">
      <img :src="personalInfo.photo" :alt="`${personalInfo.firstName} ${personalInfo.lastName}`" />
    </div>
    <div class="header-main">
      <h1 class="name">{{ personalInfo.firstName }} {{ personalInfo.lastName }}</h1>
      <p class="designation">{{ personalInfo.designation }}</p>
      <p class="subtitle">
        {{ personalInfo.highestEducation }}
        <template v-if="personalInfo.totalExperience"> | {{ personalInfo.totalExperience }}</template>
      </p>
    </div>
    <div class="header-contact">
      <a v-if="personalInfo.email" :href="`mailto:${personalInfo.email}`" class="contact-link">{{ personalInfo.email }}</a>
      <span v-if="personalInfo.phone" class="contact-item">{{ personalInfo.phone }}</span>
      <a v-if="settings.fieldVisibility.linkedIn && personalInfo.linkedIn" :href="personalInfo.linkedIn" target="_blank" rel="noopener noreferrer" class="contact-link">LinkedIn</a>
      <a v-if="settings.fieldVisibility.github && personalInfo.github" :href="personalInfo.github" target="_blank" rel="noopener noreferrer" class="contact-link">GitHub</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PersonalInfo } from '../../types/resume'
import { useSettingsStore } from '../../stores/settingsStore'

defineProps<{
  personalInfo: PersonalInfo
}>()

const settings = useSettingsStore()
</script>

<style scoped>
.resume-header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl) 0;
  border-bottom: 2px solid var(--color-primary);
  margin-bottom: var(--spacing-lg);
}

.photo {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--color-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.photo img {
  width: 100%;
  height: 100%;
  image-rendering: auto;
}

.header-main {
  flex: 1;
}

.name {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
}

.designation {
  font-size: var(--font-size-lg);
  color: var(--color-primary);
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
}

.subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.header-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs) var(--spacing-md);
}

.meta-item {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.header-contact {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  flex-shrink: 0;
  text-align: right;
}

.contact-item {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.contact-link {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  text-decoration: none;
}

.contact-link:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .resume-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .header-meta {
    justify-content: center;
  }

  .header-contact {
    text-align: center;
  }
}
</style>
