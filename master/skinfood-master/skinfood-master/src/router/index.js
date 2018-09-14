import Vue from 'vue';
import Router from 'vue-router';
import listEntries from '@/components/listEntries';
import entrie from '@/components/entrie';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'List of Entries',
      component: listEntries,
    },
    {
      path: '/entrie/:id',
      name: 'Entrie',
      component: entrie,
      props: true,
    },
  ],
});
