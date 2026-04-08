<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { signInAdmin } from '@/lib/adminAuth'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

async function handleSubmit() {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await signInAdmin({
      username: username.value.trim(),
      password: password.value,
    })

    router.replace({ name: 'admin' })
  } catch (error) {
    errorMessage.value = error.message || 'No se pudo iniciar sesion.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="min-h-screen px-4 py-12">
    <div class="mx-auto flex w-full max-w-md justify-end pb-3">
      <ThemeToggle />
    </div>

    <section
      class="mx-auto w-full max-w-md rounded-xl border border-border bg-card p-6 text-card-foreground shadow-lg"
    >
      <h1 class="text-2xl font-semibold">Admin Login</h1>
      <p class="mt-2 text-sm text-muted-foreground">
        Login with your administrator username to access the links panel.
      </p>

      <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="mb-1 block text-sm font-medium text-foreground" for="username">
            Username
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            autocomplete="username"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-ring/30 transition focus:ring-2"
            placeholder=""
            required
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-foreground" for="password">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-ring/30 transition focus:ring-2"
            placeholder=""
            required
          />
        </div>

        <p
          v-if="errorMessage"
          class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {{ errorMessage }}
        </p>

        <Button class="w-full" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Ingresando...' : 'Entrar al panel' }}
        </Button>
      </form>
    </section>
  </main>
</template>
