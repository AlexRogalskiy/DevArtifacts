import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    entries: [],
  },
  actions: {
    LOAD_ENTRIES_LIST({ commit }) {
      axios.get('http://localhost:3000/entries').then((response) => {
        commit('SET_ENTRIES_LIST', { list: response.data });
      }, (err) => {
        // eslint-disable-next-line
        console.log(err);
      });
    },
  },
  mutations: {
    SET_ENTRIES_LIST(state, { list }) {
      // eslint-disable-next-line
      state.entries = list;
    },
  },
  getters: {
    // eslint-disable-next-line
    getById: (state, getters) => (id) => {
      return state.entries.find(entrie => entrie.id === id);
    },
  },
});

export default store;
