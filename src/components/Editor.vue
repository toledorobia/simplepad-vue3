<template>
  <div ref="editor" class="vw-75 vh-without-navbar border-left-grey"></div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, watchEffect } from "vue";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import _ from 'lodash';

export default {
  name: "Editor",
  props: {
    content: { type: String, default: "" },
    debounce: { type: Number, default: 0 },
  },
  emits: ['update:content', 'debounce:content'],
  setup(props, { emit }) {
    const editor = ref(null);
    const isChangeFromProp = ref(false);

    const debounceContent = _.debounce((value) => {
      emit('debounce:content', value);
    }, props.debounce);

    const updateContent = (value) => {
      emit('update:content', value);
      debounceContent(value);
    };

    let stopEffect = null;
    let monacoEditor = null;
    onMounted(() => {
      monacoEditor = monaco.editor.create(editor.value, {
        value: props.content,
        language: 'plaintext',
        theme: "vs-dark",
        height: "100%",
        wordWrap: "on",
        quickSuggestions: false,
        automaticLayout: true,
        minimap: {
          enabled: false
        }
      });

      monacoEditor.onDidChangeModelContent(event => {
        if (!isChangeFromProp.value) {
          const value = monacoEditor.getValue();
          updateContent(value);
        }

        isChangeFromProp.value = false;
      });

      stopEffect = watchEffect(() => {
        isChangeFromProp.value = true;
        monacoEditor.setValue(props.content);
      }, [props.content]);
    });

    onUnmounted(() => {
      console.log("unmount", monacoEditor);

      stopEffect();
      if (monacoEditor != null) {
        monacoEditor.dispose();
      }
    });

    return {
      editor,
    }
  }
};
</script>

<style scoped>
</style>
