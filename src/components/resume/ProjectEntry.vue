<template>
  <div class="project-entry">
    <span class="project-name">{{ project.name }}</span>
    <p v-if="project.description" class="project-desc">{{ project.description }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Project } from '../../types/resume'

defineProps<{
  project: Project
}>()
</script>

<style scoped>
.project-entry {
  padding: var(--spacing-xs) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.project-entry:last-child {
  border-bottom: none;
}

.project-name {
  font-weight: 500;
  font-size: var(--font-size-base);
  color: var(--color-text);
}

.project-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
}
</style>
