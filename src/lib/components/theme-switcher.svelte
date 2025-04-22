<script>
  import { Moon, Sun } from "lucide-svelte";
  import { onMount } from "svelte";

  let isDark = $state(false);

  function toggleTheme() {
    // TODO: change the animation time
    if (!document.startViewTransition) {
      document.documentElement.classList.toggle("dark");
      isDark = !isDark;
      localStorage.setItem("theme", isDark ? "dark" : "light");
      return;
    }

    document.startViewTransition(() => {
      document.documentElement.classList.toggle("dark");
      isDark = !isDark;
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  onMount(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      isDark = true;
    } else {
      document.documentElement.classList.remove("dark");
      isDark = false;
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          document.documentElement.classList.toggle("dark", e.matches);
          isDark = e.matches;
        }
      });
  });
</script>

<button
  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
  class="flex items-center justify-center p-2 rounded-full border-2 bg-white dark:bg-black"
  onclick={toggleTheme}
>
  {#if isDark}
    <Sun class="h-5 w-5" />
  {:else}
    <Moon class="h-5 w-5" />
  {/if}
</button>
