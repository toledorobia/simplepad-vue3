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
    },
    setNotepadSaved(state, payload) {
      state.notepad.saved = payload;
    }
  },
  actions: {
    updateNotepad({ state }, payload) {
      const now = firebaseDateNow();
      return db.collection("notepads").doc(state.notepad.id).update({ updateAt: now, ...payload });
    },
    setNotepads({ commit }, payload) {
      commit("setNotepads", payload);
    },
    toggleNotepadSave({ commit }, payload) {
      commit("setNotepadSaved", payload);
    }
  },
  modules: {
  }
};
