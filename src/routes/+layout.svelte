<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<main class="w-screen h-screen bg-white/85 dark:bg-black/85">
  <div
    data-tauri-drag-region
    class="absolute w-screen h-16"
    id="drag-region"
  ></div>
  {@render children()}
</main>
