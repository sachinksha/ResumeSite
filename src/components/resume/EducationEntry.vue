<template>
  <div class="education-entry">
    <div class="edu-row">
      <span class="degree">{{ education.degree }}</span>
      <span class="passed">{{ education.passed }}</span>
    </div>
    <p class="college">{{ education.college }}<template v-if="education.location">, {{ education.location }}</template></p>
  </div>
</template>

<script setup lang="ts">
import type { Education } from '../../types/resume'

defineProps<{
  education: Education
}>()
</script>

<style scoped>
.education-entry {
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.education-entry:last-child {
  border-bottom: none;
}

.edu-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.degree {
  font-weight: 600;
  font-size: var(--font-size-base);
  color: var(--color-text);
}

.passed {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  white-space: nowrap;
}

.college {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
</style>
