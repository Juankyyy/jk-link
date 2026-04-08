<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { RefreshCw, Shield } from 'lucide-vue-next'
import { resolveLinkDestination } from '@/lib/linksApi'
import ThemeToggle from '@/components/ThemeToggle.vue'

const route = useRoute()
const isLoading = ref(true)
const errorMessage = ref('')
const isResolved = ref(false)

async function attemptRedirect() {
  const slug = String(route.params.slug || '').trim()

  isLoading.value = true
  errorMessage.value = ''
  isResolved.value = false

  if (!slug) {
    errorMessage.value = 'The link you requested is invalid'
    isLoading.value = false
    return
  }

  if (import.meta.env.PROD) {
    isResolved.value = true
    window.setTimeout(() => {
      window.location.replace(`/go/${encodeURIComponent(slug)}`)
    }, 500)
    return
  }

  try {
    const destinationUrl = await resolveLinkDestination(slug)
    isResolved.value = true
    window.setTimeout(() => {
      window.location.replace(destinationUrl)
    }, 500)
    return
  } catch (error) {
    errorMessage.value = error.message || 'The link could not be redirected'
  }

  isLoading.value = false
}

function retryRedirect() {
  attemptRedirect()
}

onMounted(async () => {
  await attemptRedirect()
})
</script>

<template>
  <main class="app-page-bg min-h-screen px-4 py-6">
    <div class="mx-auto flex w-full max-w-md items-center justify-between pb-3">
      <p class="text-xl font-semibold tracking-wide text-foreground">JK Link</p>

      <div class="flex items-center gap-2">
        <a
          href="/admin"
          class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition hover:bg-accent"
          aria-label="Ir al panel admin"
          title="Admin mode"
        >
          <Shield class="size-4" />
        </a>
        <ThemeToggle />
      </div>
    </div>

    <div class="flex items-center justify-center">
      <section
        :class="[
          'animate-in fade-in zoom-in-95 w-full max-w-md rounded-xl border p-6 text-center shadow duration-500 transition-all',
          errorMessage && !isLoading
            ? 'bg-red-500 border-red-700 text-white shadow-red-700/40'
            : isResolved
              ? 'bg-emerald-400 border-emerald-500 text-white'
              : 'bg-card border-border text-card-foreground shadow-black/10 dark:bg-zinc-900/90 dark:border-zinc-700 dark:text-zinc-100 dark:shadow-black/40',
        ]"
      >
        <h1 class="text-xl font-semibold">
          {{ !isLoading && errorMessage ? 'Redirection failed' : 'Redirecting...' }}
        </h1>

        <p
          v-if="isLoading && !isResolved"
          class="mt-2 text-sm text-muted-foreground dark:text-zinc-300"
        >
          Arriving at the destination link
        </p>

        <transition name="fade-slide" mode="out-in">
          <p v-if="isResolved" key="success" class="mt-2 text-sm text-white">
            Link found, redirecting...
          </p>
        </transition>

        <transition name="fade-slide" mode="out-in">
          <div v-if="!isLoading && errorMessage" key="error" class="mt-3 space-y-1">
            <p class="text-sm font-medium text-white/95">
              {{ errorMessage }}
            </p>

            <button
              type="button"
              class="inline-flex items-center rounded-md border border-white/40 mt-5 bg-white/15 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/25"
              @click="retryRedirect"
            >
              <RefreshCw class="mr-2 size-3.5" />
              Reload
            </button>

            <p class="text-xs text-white/75 mt-2">Check that the link is correct</p>
          </div>
        </transition>
      </section>
    </div>
  </main>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 320ms ease,
    transform 320ms ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
