<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { resolveLinkDestination } from '@/lib/linksApi'
import ThemeToggle from '@/components/ThemeToggle.vue'

const route = useRoute()
const isLoading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  const slug = String(route.params.slug || '').trim()

  if (!slug) {
    errorMessage.value = 'El link solicitado no es válido.'
    isLoading.value = false
    return
  }

  if (import.meta.env.PROD) {
    window.setTimeout(() => {
      window.location.replace(`/go/${encodeURIComponent(slug)}`)
    }, 250)
    return
  }

  try {
    const destinationUrl = await resolveLinkDestination(slug)
    window.location.replace(destinationUrl)
    return
  } catch (error) {
    errorMessage.value = error.message || 'No se pudo redireccionar el link.'
  }

  isLoading.value = false
})
</script>

<template>
  <main class="min-h-screen px-4 py-6">
    <div class="mx-auto flex w-full max-w-md justify-end pb-3">
      <ThemeToggle />
    </div>

    <div class="flex items-center justify-center">
      <section
        class="animate-in fade-in zoom-in-95 w-full max-w-md rounded-xl border border-border bg-card p-6 text-center text-card-foreground shadow duration-500"
      >
        <h1 class="text-xl font-semibold">Redireccionando...</h1>
        <p v-if="isLoading" class="mt-2 text-sm text-muted-foreground">
          Estamos buscando el destino del link corto.
        </p>
        <p v-else class="mt-2 text-sm text-red-700">{{ errorMessage }}</p>

        <a
          class="mt-4 inline-flex rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
          href="/admin"
        >
          Ir al panel admin
        </a>
      </section>
    </div>
  </main>
</template>
