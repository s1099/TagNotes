<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<main class="w-screen h-screen bg-white/85 dark:bg-black/85">
  <div
    id="titlebar"
    data-tauri-drag-region
    class="absolute w-screen h-16 z-10"
  ></div>
  {@render children()}
</main>
