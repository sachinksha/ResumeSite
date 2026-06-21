<template>
  <div class="skills-list">
    <span v-for="skill in skills" :key="skill.name" class="skill-badge">{{ skill.name }}</span>
  </div>
</template>

<script setup lang="ts">
import type { Skill } from '../../types/resume'

defineProps<{
  skills: Skill[]
}>()
</script>

<style scoped>
.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.skill-badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-primary);
  color: var(--color-text-on-primary);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 500;
}
</style>
