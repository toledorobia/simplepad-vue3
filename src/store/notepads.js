import firebase from "firebase/app";
import { db } from "../firebase";

export default {
  // namespaced: true,
  state: () => ({
    notepad: null,
    notepads: null,
  }),
  getters: {
    notepad: state => state.notepad,
    notepads: state => state.notepads,
  },
  mutations: {
    setNotepads(state, payload) {
      state.notepads = payload;
    },
    setNotepad(state, payload) {
      state.notepad = payload;
    }
  },
  actions: {
    setNotepads({ commit }, payload) {
      commit("setNotepads", payload);
    }
  },
  modules: {
  }
};
