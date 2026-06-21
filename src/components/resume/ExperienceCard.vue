<template>
  <div class="experience-card">
    <div class="card-header">
      <div class="card-title-row">
        <h3 class="company">{{ experience.company }}</h3>
        <span class="duration">{{ experience.from }} – {{ experience.isPresent ? 'Present' : experience.to }}</span>
      </div>
      <p class="designation">{{ experience.designation }}</p>
      <p v-if="experience.location" class="location">{{ experience.location }}</p>
    </div>
    <div class="card-body">
      <p v-if="experience.aboutCompany" class="about-company">{{ experience.aboutCompany }}</p>
      <p v-if="experience.role" class="role">{{ experience.role }}</p>
      <div v-if="experience.techStack.length > 0" class="tech-stack">
        <span class="tech-label">Tech Stack:</span>
        <span v-for="tech in experience.techStack" :key="tech" class="tech-badge">{{ tech }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WorkExperience } from '../../types/resume'

defineProps<{
  experience: WorkExperience
}>()
</script>

<style scoped>
.experience-card {
  padding: var(--spacing-md);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
  transition: box-shadow 0.15s;
}

.experience-card:hover {
  box-shadow: var(--shadow-sm);
}

.card-header {
  margin-bottom: var(--spacing-sm);
}

.card-title-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.company {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--color-text);
}

.duration {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  white-space: nowrap;
}

.designation {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
}

.location {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.card-body {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.about-company {
  margin-bottom: var(--spacing-sm);
}

.role {
  margin-bottom: var(--spacing-sm);
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--spacing-xs);
}

.tech-label {
  font-weight: 500;
  color: var(--color-text);
  margin-right: var(--spacing-xs);
}

.tech-badge {
  display: inline-block;
  padding: 2px 8px;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 500;
}
</style>
