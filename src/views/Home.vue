<script setup>
import { onMounted, onUnmounted, ref, computed } from "vue";
import { useStore } from "vuex";
import Navbar from "../components/Navbar";
import NotepadList from "../components/NotepadList";
import Editor from "../components/Editor";

import { db } from "./../firebase";
import { firebaseDocToObject } from "./../libs/helpers";

const store = useStore();
const uid = store.getters.uid;
const notepad = computed(() => store.getters.notepad);

const onContentChange = (content) => {
  store.dispatch("toggleNotepadSave", false);
};

const onContentDebounce = (content) => {
  store.dispatch("updateNotepad", { id: notepad.value.id, content });
};

let unsubscribe = null;
onMounted(() => {
  unsubscribe = db
    .collection('notepads')
    .where("uid", "==", uid)
    .orderBy('name')
    .onSnapshot(
      snap => {
        console.log("onsnapshot");

        const items = snap.docs.map(doc => firebaseDocToObject(doc, { saved: true }));
        store.commit('setNotepads', items);
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

</script>


<template>
  <div class="d-flex vw-100 vh-100 flex-column">
    <Navbar />
    <div class="d-flex">

      <NotepadList />

      <div v-if="notepad == null" class="d-flex justify-content-center align-items-center w-75 sp-editor-container text-muted">
        <div>Select a simplepad</div>
      </div>

      <div v-if="notepad != null" class="w-75 sp-editor-container">
        <Editor :content="notepad.content" :debounce="2000" @update:content="onContentChange" @debounce:content="onContentDebounce" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.vh-without-navbar {
  height: calc(100vh - 56px);
}
</style>