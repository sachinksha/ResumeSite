<template>
  <section v-if="visible" class="resume-section">
    <h2 class="section-title">{{ title }}</h2>
    <div class="section-body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  visible: boolean
}>()
</script>

<style scoped>
.resume-section {
  margin-bottom: var(--spacing-xl);
}

.section-body {
  padding-top: var(--spacing-sm);
}
</style>
