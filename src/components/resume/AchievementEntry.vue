<template>
  <div class="achievement-entry">
    <span class="achievement-name">{{ achievement.name }}</span>
    <p v-if="achievement.description" class="achievement-desc">{{ achievement.description }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Achievement } from '../../types/resume'

defineProps<{
  achievement: Achievement
}>()
</script>

<style scoped>
.achievement-entry {
  padding: var(--spacing-xs) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.achievement-entry:last-child {
  border-bottom: none;
}

.achievement-name {
  font-weight: 500;
  font-size: var(--font-size-base);
  color: var(--color-text);
}

.achievement-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
}
</style>
