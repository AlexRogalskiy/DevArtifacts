import Vue from 'vue';
import Router from 'vue-router';
import Members from '@/components/Members';
import setWinner from '@/components/setWinner';
import Winner from '@/components/Winner';

Vue.use(Router);

export default new Router({
  base: '/',
  routes: [
    {
      path: '/',
      name: 'Members',
      component: Members,
    },
    {
      path: '/set-winner',
      name: 'Set Winner',
      component: setWinner,
    },
    {
      path: '/winner',
      name: 'Winner',
      component: Winner,
    },
  ],
});
