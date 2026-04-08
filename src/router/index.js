import { createRouter, createWebHistory } from 'vue-router'
import AdminLoginView from '@/views/AdminLoginView.vue'
import AdminView from '@/views/AdminView.vue'
import LinkRedirectView from '@/views/LinkRedirectView.vue'
import { isAdminAuthenticated } from '@/lib/adminAuth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/admin',
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAdmin: true },
    },
    {
      path: '/:slug',
      name: 'link-redirect',
      component: LinkRedirectView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/admin',
    },
  ],
})

router.beforeEach(async (to) => {
  let hasAccess = false

  try {
    hasAccess = await isAdminAuthenticated()
  } catch {
    hasAccess = false
  }

  if (to.meta.requiresAdmin && !hasAccess) {
    return { name: 'admin-login' }
  }

  if (to.meta.guestOnly && hasAccess) {
    return { name: 'admin' }
  }

  return true
})

export default router
