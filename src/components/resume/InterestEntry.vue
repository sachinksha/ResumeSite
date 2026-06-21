<template>
  <div class="interest-entry">
    <span class="interest-name">{{ interest.name }}</span>
    <span v-if="showDescription && interest.description" class="interest-desc"> - {{ interest.description }}</span>
  </div>
</template>

<script setup lang="ts">
import type { Interest } from '../../types/resume'

defineProps<{
  interest: Interest
  showDescription?: boolean
}>()
</script>

<style scoped>
.interest-entry {
  padding: var(--spacing-xs) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.interest-entry:last-child {
  border-bottom: none;
}

.interest-name {
  font-weight: 500;
  font-size: var(--font-size-base);
  color: var(--color-text);
}

.interest-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: var(--spacing-xs);
}
</style>
