import firebase from "firebase/app";
import { db } from "../firebase";
import { firebaseDateNow, isSomethingWithId } from "../libs/helpers";
import { cl } from "../libs/dump";

export default {
  // namespaced: true,
  state: () => ({
    id: null,
    content: null,
    notepads: null,
    requests: [],
    updating: false,
  }),
  getters: {
    content: state => state.content,
    notepad: state => state.notepads == null ? null : state.notepads.find(n => n.current == true),
    notepads: state => state.notepads,
    notepadId: (state, getters) => getters.notepad == null ? null : getters.notepad.id,
  },
  mutations: {
    setId(state, payload) {
      state.id = payload;
    },
    setContent(state, payload) {
      state.content = payload;
    },
    setNotepads(state, payload) {
      state.notepads = payload;
    },
    updateNotepads(state, { id, ...payload }) {
      state.notepads.forEach(n => Object.assign(n, payload));
    },
    updateNotepad(state, { id, ...payload }) {
      let notepad = state.notepads.find(notepad => notepad.id === id);
      if (notepad) {
        Object.assign(notepad, payload);
      }
    },
    putRequest(state, payload) {
      state.requests.unshift(payload);
    },
    removeRequest(state, payload) {
      state.requests = state.requests.filter(r => r.id !== payload);
    },
    clearRequests(state) {
      state.requests = [];
    },
    toggleUpdating(state, payload) {
      state.updating = payload;
    }
  },
  actions: {
    setNotepads({ state, commit, dispatch }, payload) {
      commit("setNotepads", payload);

      if (state.id != null) {
        dispatch("selectNotepad", state.id);
      }
    },
    selectNotepad({ commit }, payload) {
      commit("setId", payload);
      commit("updateNotepads", { current: false });

      if (payload != null) {
        commit("updateNotepad", { id: payload, current: true });
      }
    },
    selectNotepadWithContent({ state, commit, dispatch }, payload) {
      dispatch("selectNotepad", payload);

      if (payload == null) {
        commit("setContent", null);
      }
      else {
        let notepad = state.notepads.find(n => n.id == payload);
        commit("setContent", notepad.content);
      }
    },
    putNotepadUpdate({ commit }, payload) {
      cl("putNotepadUpdate", payload, isSomethingWithId(payload));
      if (!isSomethingWithId(payload)) {
        return;
      }

      commit("updateNotepad", { id: payload.id, saved: false });
      commit("removeRequest", payload.id);
      commit("putRequest", payload);
    },
    async triggerRequests({ state, commit }, payload) {
      if (state.updating) {
        return;
      }

      if (state.requests.length == 0) {
        return;
      }

      commit("toggleUpdating", true);

      cl("triggerRequests", state.requests);

      try {
        const now = firebaseDateNow();
        let batch = db.batch();

        for (let i = 0; i < state.requests.length; i++) {
          let { id, ...data } = state.requests[i];
          let ref = db.collection("notepads").doc(id);
          batch.update(ref, data);
        }

        await batch.commit();
        commit("clearRequests");
      } catch (e) {
        throw e;
      } finally {
        cl("finally");
        commit("toggleUpdating", false);
      }
    },
    async newNotepad({ state, dispatch }, payload) {
      const now = firebaseDateNow();

      const res = await db.collection("notepads").add({
        content: "",
        updateAt: now,
        createdAt: now,
        ...payload
      });

      dispatch("selectNotepadWithContent", res.id);
    },
    updateNotepad({ state, commit }, { id, ...payload }) {
      const now = firebaseDateNow();
      return db.collection("notepads").doc(id).update({ updateAt: now, ...payload });
    },
    deleteNotepad({ state, commit }, payload) {
      if (state.notepadId == payload) {
        dispatch("selectNotepadWithContent", null);
      }

      return db.collection("notepads").doc(payload).delete();
    }
  },
  modules: {
  }
};
