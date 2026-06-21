<template>
  <main class="my-cv-view">
    <div v-if="!resumeStore.isLoaded" class="empty-state">
      <h2>Resume Not Configured</h2>
      <p>No resume data file found. Contact the developer to set up resume data.</p>
    </div>
    <ResumeLayout v-else :resume="resumeStore.staticData" />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useResumeStore } from '../stores/resumeStore'
import ResumeLayout from '../components/resume/ResumeLayout.vue'

const resumeStore = useResumeStore()

onMounted(() => {
  if (!resumeStore.isLoaded) {
    resumeStore.loadFromStaticFile()
  }
})
</script>

<style scoped>
.my-cv-view {
  padding: var(--spacing-lg) var(--spacing-md);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-secondary);
}

.empty-state h2 {
  font-size: var(--font-size-2xl);
  margin-bottom: var(--spacing-md);
}

.empty-state p {
  margin-bottom: var(--spacing-lg);
  font-size: var(--font-size-lg);
}
</style>
