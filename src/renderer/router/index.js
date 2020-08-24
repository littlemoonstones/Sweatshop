import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/landing',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '/',
      name: 'home',
      component: require('@/components/Home').default
    },
    {
      path: '/chart',
      name: 'chart',
      component: require('@/components/Chart').default
    },
    {
      path: '/chart-child',
      name: 'chart-child',
      component: require('@/components/Chart-child').default
    },
    {
      path: '*',
      redirect: '/'
    },
    {
      path: '/about',
      name: 'about',
      component: require('@/components/About').default
    }
  ]
})
