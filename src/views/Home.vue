<script setup>
import { onMounted, onUnmounted, ref, computed } from "vue";
import { useStore } from "vuex";
import Navbar from "../components/Navbar";
import NotepadList from "../components/NotepadList";
import Editor from "../components/Editor";

import { db } from "./../firebase";
import { firebaseDocToObject, cl } from "@toledorobia/helpers";

const store = useStore();
const uid = store.getters.uid;
const content = computed(() => store.getters.content);
const isNotepadSelected = computed(() => store.getters.notepadId != null);

const onContentChange = (content) => {
  store.dispatch("putNotepadUpdate", { id: store.getters.notepadId, content });
};

const onContentDebounce = (content) => {
  //store.dispatch("updateNotepad", { id: notepad.value.id, content });
};

let unsubscribe = null;
let interval = null;
onMounted(() => {
  cl("onMounted");

  interval = setInterval(async () => {
    try {
      await store.dispatch("triggerRequests");
    } catch (e) {
      console.error(e);
    }
  }, 2000);


  unsubscribe = db
    .collection('notepads')
    .where("uid", "==", uid)
    .orderBy('name')
    .onSnapshot(
      snap => {
        cl("onsnapshot");

        const items = snap.docs.map(doc => firebaseDocToObject(doc, { current: false, saved: true }));
        store.dispatch('setNotepads', items);
      },
      err => {
        cl(err);
      },
    );
});

onUnmounted(() => {
  cl("onUnmounted");

  if (interval != null) {
    clearInterval(interval);
  }

  if (unsubscribe != null) {
    unsubscribe();
  }
});
</script>

<template>
  <div class="d-flex vw-100 vh-100 flex-column">
    <Navbar />
    <div class="d-flex">

      <NotepadList />

      <div v-if="!isNotepadSelected" class="d-flex justify-content-center align-items-center w-75 sp-editor-container text-muted">
        <div>Select a simplepad</div>
      </div>

      <div v-if="isNotepadSelected" class="w-75 sp-editor-container">
        <Editor :content="content" :debounce="2000" @update:content="onContentChange" @debounce:content="onContentDebounce" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.vh-without-navbar {
  height: calc(100vh - 56px);
}
</style>