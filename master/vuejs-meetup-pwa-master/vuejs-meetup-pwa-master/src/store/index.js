import Vue from 'vue';
import Vuex from 'vuex';
// Only needed for the purpose of fetching data from Meetup.com
import fetchJsonp from 'fetch-jsonp';

import { meetupKey } from '../config';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    members: [],
  },
  actions: {
    LOAD_MEMBERS_LIST({ commit }) {
      fetchJsonp(`https://api.meetup.com/VueJS-SP/events/246652170/rsvps?sign=true&api&key=${meetupKey}`)
        .then(response => response.json())
        .then((data) => {
          const members = data.data
            .filter(item => item.response === 'yes')
            .map(item => item.member);

          commit('SET_MEMBERS_LIST', { list: members });
        })
        .catch((err) => { console.error(err); });
    },
  },
  mutations: {
    SET_MEMBERS_LIST(state, { list }) {
      state.members = list;
    },
  },
});

export default store;
