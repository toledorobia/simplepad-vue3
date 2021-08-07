<template>
  <div>
    <!-- <Navbar />
    <div ref="editor" class="w-75 vh-100 border-left-grey"></div> -->

    <div class="d-flex vw-100 vh-100 flex-column">
      <Navbar />
      <div class="d-flex flex-row">
        <!-- <div class="w-25 h-100 border-left-grey">Segundo</div> -->
        <div ref="editor" class="vw-100 vh-without-navbar border-left-grey"></div>
      </div>
    </div>

  </div>
</template>

<script>
import { onMounted, onUnmounted, ref, computed } from "vue";
import { useStore } from "vuex";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import Navbar from "../components/Navbar";

import { db } from "./../firebase";
import { firebaseDocToObject } from "./../libs/helpers";

export default {
  name: 'Home',
  components: {
    Navbar,
  },
  setup() {
    const store = useStore();
    const uid = store.getters.uid;

    let unsubscribe = null;
    onMounted(() => {
      unsubscribe = db
        .collection('notepads')
        .where("uid", "==", uid)
        .orderBy('name')
        .onSnapshot(
          snap => {
            const items = snap.docs.map(doc => firebaseDocToObject(doc));
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

    const editor = ref(null);
    onMounted(() => {
      console.log(editor.value);

      monaco.editor.create(editor.value, {
        value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
        language: 'javascript',
        theme: "vs-dark",
        height: "100vh",
        wordWrap: "on",
        quickSuggestions: false,
        automaticLayout: true,
        minimap: {
          enabled: false
        }
      });
    });

    return {
      editor,
    }

  }
}
</script>


<style scoped>
.vh-without-navbar {
  height: calc(100vh - 56px);
}
</style>