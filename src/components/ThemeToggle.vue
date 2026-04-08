<script setup>
import { Moon, Sun } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/lib/theme'

const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <Button
    type="button"
    variant="outline"
    size="icon"
    class="relative overflow-hidden transition-transform duration-150 hover:scale-105 active:scale-95"
    @click="toggleTheme"
  >
    <Sun
      class="size-4 transition-all duration-200"
      :class="isDark ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'"
    />
    <Moon
      class="absolute size-4 transition-all duration-200"
      :class="isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'"
    />

    <span class="sr-only">Cambiar tema</span>
  </Button>
</template>
