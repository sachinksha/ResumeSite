<template>
  <header class="app-header no-print">
    <div class="header-inner">
      <router-link to="/" class="logo">ResumeSite</router-link>
      <nav class="nav-links">
        <router-link to="/" class="nav-link" active-class="nav-link--active" exact-active-class="nav-link--active">
          My CV
        </router-link>
        <router-link to="/settings" class="nav-link" active-class="nav-link--active">
          Settings
        </router-link>
      </nav>
      <ThemeToggle />
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(8px);
}

.header-inner {
  max-width: var(--max-width-content);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  height: 3.5rem;
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.logo {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-primary);
  text-decoration: none;
}

.logo:hover {
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: var(--spacing-sm);
  flex: 1;
}

.nav-link {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.15s, background-color 0.15s;
}

.nav-link:hover {
  color: var(--color-text);
  background-color: var(--color-bg-secondary);
  text-decoration: none;
}

.nav-link--active {
  color: var(--color-primary);
}
</style>
