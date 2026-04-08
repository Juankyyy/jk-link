import { defineStore } from 'pinia'
import { createLink, deleteLink, fetchLinks, updateLink } from '@/lib/linksApi'

export const useLinksStore = defineStore('links', {
  state: () => ({
    links: [],
    isLoading: false,
    isSaving: false,
    errorMessage: '',
  }),

  actions: {
    clearError() {
      this.errorMessage = ''
    },

    async loadLinks() {
      this.isLoading = true
      this.clearError()

      try {
        this.links = await fetchLinks()
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    },

    async createNewLink(payload) {
      this.isSaving = true
      this.clearError()

      try {
        await createLink(payload)
        await this.loadLinks()
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isSaving = false
      }
    },

    async editLink(payload) {
      this.isSaving = true
      this.clearError()

      try {
        await updateLink(payload)
        await this.loadLinks()
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isSaving = false
      }
    },

    async removeLink(name) {
      this.isSaving = true
      this.clearError()
      const previousLinks = [...this.links]
      this.links = this.links.filter((link) => link.name !== name)

      try {
        await deleteLink(name)
        await this.loadLinks()
      } catch (error) {
        this.links = previousLinks
        this.errorMessage = error.message
      } finally {
        this.isSaving = false
      }
    },
  },
})
