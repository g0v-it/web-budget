import Vue from 'vue'
import Router from 'vue-router'
import D3BubbleGraph from './views/D3BubbleGraph.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/account/:code',
            name: 'account-details',
            component: D3BubbleGraph,
            props: true
        },
        {
            path: '/partition/:urlPartitionID',
            name: 'accounts-partition',
            component: D3BubbleGraph,
            props: true
        },
        {
            path: '/',
            name: 'd3-bubble-graph',
            component: D3BubbleGraph
        },
        {
            path: '/credits',
            name: 'credits',
            // route level code-splitting
            // this generates a separate chunk (credit.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('./views/Credit.vue')
        },
        {
            path: '/table',
            name: 'accounts-table',
            component: () => import('./views/AccountsTable.vue')
        }
        ,
        {
            path: '/list',
            name: 'accounts-list',
            component: () => import('./views/AccountsList.vue')
        }
    ]
})
