<template>
  <div class="language-entry">
    <span class="lang-name">{{ language.name }}</span>
    <span class="lang-proficiency">{{ language.proficiency }}</span>
  </div>
</template>

<script setup lang="ts">
import type { Language } from '../../types/resume'

defineProps<{
  language: Language
}>()
</script>

<style scoped>
.language-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-xs) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.language-entry:last-child {
  border-bottom: none;
}

.lang-name {
  font-weight: 500;
  font-size: var(--font-size-base);
  color: var(--color-text);
}

.lang-proficiency {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
</style>
