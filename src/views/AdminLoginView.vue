<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { signInAdmin, USING_DEFAULT_ADMIN_KEY } from '@/lib/adminAuth'

const router = useRouter()
const accessKey = ref('')
const errorMessage = ref('')

function handleSubmit() {
  errorMessage.value = ''

  const isValid = signInAdmin(accessKey.value.trim())

  if (!isValid) {
    errorMessage.value = 'Clave incorrecta. Intenta de nuevo.'
    return
  }

  router.replace({ name: 'admin' })
}
</script>

<template>
  <main class="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 py-12">
    <section
      class="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg"
    >
      <h1 class="text-2xl font-semibold text-slate-900">Acceso administrador</h1>
      <p class="mt-2 text-sm text-slate-600">
        Ingresa tu clave para acceder al panel de administración de links.
      </p>

      <!-- <p
        v-if="USING_DEFAULT_ADMIN_KEY"
        class="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700"
      >
        No detecté VITE_ADMIN_ACCESS_KEY.
      </p> -->

      <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700" for="accessKey">
            Clave de acceso
          </label>
          <input
            id="accessKey"
            v-model="accessKey"
            type="password"
            autocomplete="current-password"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-300 transition focus:border-slate-500 focus:ring-2"
            placeholder="Tu clave privada"
            required
          />
        </div>

        <p
          v-if="errorMessage"
          class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {{ errorMessage }}
        </p>

        <Button class="w-full" type="submit">Entrar al panel</Button>
      </form>
    </section>
  </main>
</template>
