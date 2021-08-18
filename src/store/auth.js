import firebase from "firebase/app";
import { auth } from "../firebase";

export default {
  // namespaced: true,
  state: () => ({
    user: null,
    loaded: false,
  }),
  getters: {
    uid: state => {
      return state.user == null ? null : state.user.uid;
    },
    user: state => {
      return state.user;
    },
    isLoaded: state => {
      return state.loaded;
    },
    isLogged: state => {
      return state.user != null;
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setLoaded(state) {
      state.loaded = true;
    },
  },
  actions: {
    setAuth({ commit }, payload) {
      commit("setUser", payload);
      commit("setLoaded");
    },
    async signIn({ commit, state }, payload) {
      await auth.setPersistence(payload.remember ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION);
      await auth.signInWithEmailAndPassword(payload.email, payload.password);
    },
    async signUp({ commit, state }, payload) {
      await auth.createUserWithEmailAndPassword(payload.email, payload.password);
      await auth.currentUser.sendEmailVerification();
      await auth.signOut();
    },
    async forgotPassword({ commit, state }, payload) {
      await auth.sendPasswordResetEmail(payload.email);
    },
    async signOut() {
      await auth.signOut();
    }
  },
  modules: {
  }
};
