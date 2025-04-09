<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn't exist or has been moved.</p>
      <router-link to="/" class="btn-home">Go to Home</router-link>
    </div>
  </div>
</template>

<script setup>
// No additional logic needed
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-color);
  padding: var(--spacing-md);
}

.content {
  text-align: center;
  max-width: 500px;
  padding: var(--spacing-xl);
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

h1 {
  font-size: 6rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
  line-height: 1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 2rem;
  color: var(--text-primary);
  margin: var(--spacing-md) 0;
}

p {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
  font-size: 1.1rem;
}

.btn-home {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.btn-home:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

@media (max-width: 640px) {
  .content {
    padding: var(--spacing-lg);
  }

  h1 {
    font-size: 4rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  p {
    font-size: 1rem;
  }
}
</style> 