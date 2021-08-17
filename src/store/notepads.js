import firebase from "firebase/app";
import { db } from "../firebase";
import { firebaseDateNow } from "../libs/helpers";

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
    async updateNotepad({ state, commit }, { id, ...payload }) {
      const now = firebaseDateNow();

      await db.collection("notepads").doc(id).update({ updateAt: now, ...payload });
      if (state.notepad != null) {
        commit("setNotepadSaved", true);
      }
    },
    // setNotepads({ commit }, payload) {
    //   commit("setNotepads", payload);
    // },
    toggleNotepadSave({ commit }, payload) {
      commit("setNotepadSaved", payload);
    },
    deleteNotepad({ state, commit }, payload) {
      if (state.notepad != null && state.notepad.id == payload) {
        commit("setNotepad", null);
      }
  
      return db.collection("notepads").doc(payload).delete();
    }
  },
  modules: {
  }
};
