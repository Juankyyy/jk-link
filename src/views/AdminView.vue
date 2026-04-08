<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { LogOut, Plus, RefreshCw } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/ThemeToggle.vue'
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
  modalMode.value === 'create' ? 'New short link' : 'Edit short link',
)
const submitLabel = computed(() => (modalMode.value === 'create' ? 'Create link' : 'Save changes'))

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
  const shouldDelete = window.confirm(`The link "${link.name}" will be deleted. Continue?`)

  if (!shouldDelete) {
    return
  }

  await linksStore.removeLink(link.name)
}

async function logout() {
  await signOutAdmin()
  router.replace({ name: 'admin-login' })
}

function toExternalUrl(url) {
  if (/^https?:\/\//i.test(url)) {
    return url
  }

  return `https://${url}`
}

function toShortLink(name) {
  const normalizedName = String(name || '').trim()

  if (!normalizedName || typeof window === 'undefined') {
    return '#'
  }

  return `${window.location.origin}/${encodeURIComponent(normalizedName)}`
}
</script>

<template>
  <main class="app-page-bg min-h-screen px-4 py-6 sm:px-8">
    <section class="mx-auto w-full max-w-5xl">
      <header
        class="animate-in fade-in slide-in-from-top-2 flex flex-col gap-4 rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 class="text-2xl font-semibold">Link Management</h1>
          <p class="mt-1 text-sm text-muted-foreground">
            Manage all your shortened links from this dashboard.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <ThemeToggle />
          <Button
            variant="destructive"
            size="icon"
            class="relative overflow-hidden transition-transform duration-150 hover:scale-105 active:scale-95"
            @click="logout"
          >
            <LogOut class="size-4" />
            <span class="sr-only">Logout</span>
          </Button>
        </div>
      </header>

      <p
        v-if="errorMessage"
        class="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {{ errorMessage }}
      </p>

      <section
        class="animate-in fade-in slide-in-from-bottom-2 mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
      >
        <div class="flex items-center justify-between border-b border-border px-4 py-3">
          <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            List of links
          </p>

          <div class="flex items-end gap-2">
            <Button
              variant="outline"
              size="icon"
              class="relative overflow-hidden transition-transform duration-150 hover:scale-105 active:scale-95"
              @click="linksStore.loadLinks"
              :disabled="isLoading || isSaving"
            >
              <RefreshCw class="size-4" />
              <span class="sr-only">Reload Links</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              class="relative overflow-hidden border-emerald-500 bg-emerald-500 text-white transition-transform duration-150 hover:scale-105 hover:border-emerald-500! hover:bg-emerald-500! active:scale-95"
              @click="openCreateModal"
            >
              <Plus class="size-5 text-white" />
              <span class="sr-only">New Link</span>
            </Button>
          </div>
        </div>

        <div v-if="isLoading" class="px-4 py-8 text-center text-sm text-muted-foreground">
          Loading links...
        </div>

        <div v-else-if="!links.length" class="px-4 py-8 text-center text-sm text-muted-foreground">
          No links have been created yet
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-border">
            <thead class="bg-muted/60">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Name
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  URL
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border bg-card">
              <tr v-for="link in links" :key="link.name">
                <td class="px-4 py-3 text-sm font-medium text-foreground">
                  <a
                    class="underline decoration-border underline-offset-4 hover:text-foreground/80"
                    :href="toShortLink(link.name)"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    /{{ link.name }}
                  </a>
                </td>
                <td class="px-4 py-3 text-sm text-muted-foreground">
                  <a
                    class="text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
                    :href="toExternalUrl(link.url)"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {{ link.url }}
                  </a>
                </td>
                <td class="px-4 py-3">
                  <div class="flex justify-end gap-2">
                    <Button size="sm" variant="outline" @click="openEditModal(link)">Edit</Button>
                    <Button size="sm" variant="destructive" @click="deleteItem(link)"
                      >Delete</Button
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
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <section
        class="animate-in fade-in zoom-in-95 w-full max-w-lg rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xl duration-300"
      >
        <h2 class="text-lg font-semibold">{{ modalTitle }}</h2>

        <form class="mt-4 space-y-4" @submit.prevent="submitModal">
          <div>
            <label class="mb-1 block text-sm font-medium text-foreground" for="link-name"
              >Link name</label
            >
            <input
              id="link-name"
              v-model="form.name"
              type="text"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-ring/30 transition focus:ring-2"
              placeholder="example"
              required
            />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-foreground" for="link-url"
              >Destination URL</label
            >
            <input
              id="link-url"
              v-model="form.url"
              type="text"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-ring/30 transition focus:ring-2"
              placeholder="example.com"
              required
            />
          </div>

          <div class="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" @click="closeModal" :disabled="isSaving"
              >Cancel</Button
            >
            <Button type="submit" :disabled="isSaving">
              {{ isSaving ? 'Saving...' : submitLabel }}
            </Button>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>
