import Layout from '@/layout'
// import Nested from '@/layout/nested.vue'

const dictionaryRouter = {
  path: '/build',
  component: Layout,
  name: 'Build',
  redirect: '/build/design',
  meta: {
    title: '流程建设',
    icon: '3'
    // roles: [] // you can set roles in root nav
  },
  children: [
    {
      path: 'design',
      component: () => import('@/views/build/design'),
      name: 'Design',
      meta: { title: '流程设计' }
    },
    {
      path: 'verify',
      component: () => import('@/views/build/verify'),
      name: 'Verify',
      meta: { title: '流程审核' }
    }
  ]
}

export default dictionaryRouter
