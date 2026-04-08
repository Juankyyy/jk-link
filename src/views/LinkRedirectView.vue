<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { resolveLinkDestination } from '@/lib/linksApi'

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
  <main class="flex min-h-screen items-center justify-center bg-slate-100 px-4">
    <section
      class="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 text-center shadow"
    >
      <h1 class="text-xl font-semibold text-slate-900">Redireccionando...</h1>
      <p v-if="isLoading" class="mt-2 text-sm text-slate-600">
        Estamos buscando el destino del link corto.
      </p>
      <p v-else class="mt-2 text-sm text-red-700">{{ errorMessage }}</p>

      <a
        class="mt-4 inline-flex rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        href="/admin"
      >
        Ir al panel admin
      </a>
    </section>
  </main>
</template>
