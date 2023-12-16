<script>
  import Header from '../components/Header.svelte';
</script>

<div class="app">
  <Header />
  <main>
    <slot />
  </main>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  main {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
