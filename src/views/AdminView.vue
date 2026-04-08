<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { signOutAdmin } from '@/lib/adminAuth'
import { useLinksStore } from '@/stores/links'

const router = useRouter()
const linksStore = useLinksStore()

const isModalOpen = ref(false)
const modalMode = ref('create')
const originalName = ref('')
const form = reactive({
  name: '',
  url: '',
})

const links = computed(() => linksStore.links)
const isLoading = computed(() => linksStore.isLoading)
const isSaving = computed(() => linksStore.isSaving)
const errorMessage = computed(() => linksStore.errorMessage)
const modalTitle = computed(() =>
  modalMode.value === 'create' ? 'Nuevo link acortado' : 'Editar link acortado',
)
const submitLabel = computed(() =>
  modalMode.value === 'create' ? 'Crear link' : 'Guardar cambios',
)

onMounted(() => {
  linksStore.loadLinks()
})

function resetForm() {
  form.name = ''
  form.url = ''
}

function openCreateModal() {
  modalMode.value = 'create'
  originalName.value = ''
  resetForm()
  linksStore.clearError()
  isModalOpen.value = true
}

function openEditModal(link) {
  modalMode.value = 'edit'
  originalName.value = link.name
  form.name = link.name
  form.url = link.url
  linksStore.clearError()
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  resetForm()
}

async function submitModal() {
  const payload = {
    name: form.name.trim(),
    url: form.url.trim(),
  }

  if (!payload.name || !payload.url) {
    return
  }

  if (modalMode.value === 'create') {
    await linksStore.createNewLink(payload)
  } else {
    await linksStore.editLink({
      currentName: originalName.value,
      ...payload,
    })
  }

  if (!linksStore.errorMessage) {
    closeModal()
  }
}

async function deleteItem(link) {
  const shouldDelete = window.confirm(`Se eliminará el link "${link.name}". ¿Continuar?`)

  if (!shouldDelete) {
    return
  }

  await linksStore.removeLink(link.name)
}

function logout() {
  signOutAdmin()
  router.replace({ name: 'admin-login' })
}

function toExternalUrl(url) {
  if (/^https?:\/\//i.test(url)) {
    return url
  }

  return `https://${url}`
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-6 sm:px-8">
    <section class="mx-auto w-full max-w-5xl">
      <header
        class="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 class="text-2xl font-semibold text-slate-900">Administración de links</h1>
          <p class="mt-1 text-sm text-slate-600">
            Gestiona todos los links acortados desde este panel.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <Button variant="outline" @click="linksStore.loadLinks" :disabled="isLoading || isSaving">
            Recargar
          </Button>
          <Button @click="openCreateModal">Nuevo link</Button>
          <Button variant="destructive" @click="logout">Salir</Button>
        </div>
      </header>

      <p
        v-if="errorMessage"
        class="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ errorMessage }}
      </p>

      <section class="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div v-if="isLoading" class="px-4 py-8 text-center text-sm text-slate-600">
          Cargando links...
        </div>

        <div v-else-if="!links.length" class="px-4 py-8 text-center text-sm text-slate-600">
          Aún no hay links creados.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-100">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  Nombre
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  Destino
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-for="link in links" :key="link.name">
                <td class="px-4 py-3 text-sm font-medium text-slate-900">/{{ link.name }}</td>
                <td class="px-4 py-3 text-sm text-slate-700">
                  <a
                    class="text-slate-700 underline decoration-slate-300 underline-offset-4 hover:text-slate-900"
                    :href="toExternalUrl(link.url)"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ link.url }}
                  </a>
                </td>
                <td class="px-4 py-3">
                  <div class="flex justify-end gap-2">
                    <Button size="sm" variant="outline" @click="openEditModal(link)">Editar</Button>
                    <Button size="sm" variant="destructive" @click="deleteItem(link)"
                      >Eliminar</Button
                    >
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </section>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
      @click.self="closeModal"
    >
      <section class="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
        <h2 class="text-lg font-semibold text-slate-900">{{ modalTitle }}</h2>

        <form class="mt-4 space-y-4" @submit.prevent="submitModal">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700" for="link-name"
              >Nombre del link</label
            >
            <input
              id="link-name"
              v-model="form.name"
              type="text"
              class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 transition focus:border-slate-500 focus:ring-2"
              placeholder="por-ejemplo-promocion"
              required
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700" for="link-url"
              >URL destino</label
            >
            <input
              id="link-url"
              v-model="form.url"
              type="url"
              class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 transition focus:border-slate-500 focus:ring-2"
              placeholder="https://ejemplo.com"
              required
            />
          </div>

          <div class="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" @click="closeModal" :disabled="isSaving"
              >Cancelar</Button
            >
            <Button type="submit" :disabled="isSaving">
              {{ isSaving ? 'Guardando...' : submitLabel }}
            </Button>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>
