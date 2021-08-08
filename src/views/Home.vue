<template>
  <div class="d-flex vw-100 vh-100 flex-column">
    <Navbar />
    <div class="d-flex">
      <div v-if="notepads == null" class="d-flex justify-content-center align-items-center w-25 vh-100 container-list text-muted">
        <div class="spinner-border text-light" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-if="notepads != null" class="d-flex flex-column full-height-navbar w-25 container-list">
        <div class="d-flex position-sticky">
          <input type="text" class="form-control rounded-0 input-search w-90" placeholder="Search..." aria-label="Search..." />
          <button class="btn btn-outline-secondary rounded-0 button-new-simplepad border-start-0 flex-shrink-1" type="button"><i class="bi bi-plus-square-fill"></i></button>
        </div>

        <div class="border-left-grey overflow-auto">
          <div class="border-0 rounded-0">
            <NotepadListItem v-for="n in notepads" :key="n.id" :notepad="n" />
          </div>
        </div>
      </div>

      <div v-if="notepad == null" class="d-flex justify-content-center align-items-center w-75 sp-editor-container text-muted">
        <div>Select a simplepad</div>
      </div>

      <div v-if="notepad != null" class="w-75 sp-editor-container">
        <Editor :content="content" :debounce="2000" @update:content="onContentChange" />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, computed } from "vue";
import { useStore } from "vuex";
import Navbar from "../components/Navbar";
import NotepadListItem from "../components/NotepadListItem";
import Editor from "../components/Editor";

import { db } from "./../firebase";
import { firebaseDocToObject } from "./../libs/helpers";

export default {
  name: 'Home',
  components: {
    Navbar,
    NotepadListItem,
    Editor,
  },
  setup() {
    const store = useStore();
    const uid = store.getters.uid;

    const notepad = computed(() => {
      console.log("notepad computed", store.getters.notepad);

      if (store.getters.notepad != null) {
        console.log("selected notepad", store.getters.notepad.name);
      }

      return store.getters.notepad;
    });

    const content = computed(() => {
      console.log("content computed", notepad.value);
      return notepad.value == null ? "" : notepad.value.content;
    });

    const notepads = computed(() => store.getters.notepads);
    

    const onContentChange = (content) => {
      console.log("content changed", content);
    };

    let unsubscribe = null;
    onMounted(() => {
      unsubscribe = db
        .collection('notepads')
        .where("uid", "==", uid)
        .orderBy('name')
        .onSnapshot(
          snap => {
            const items = snap.docs.map(doc => firebaseDocToObject(doc, { saved: true }));
            store.dispatch('setNotepads', items);
          },
          err => {
            console.log(err);
          },
        );
    });

    onUnmounted(() => {
      if (unsubscribe != null) {
        unsubscribe();
      }
    });

    return {
      content,
      notepad,
      notepads,
      onContentChange,
    }

  }
}
</script>


<style scoped>
.vh-without-navbar {
  height: calc(100vh - 56px);
}
</style>