<template>
  <div class="d-flex">
      <button type="button" :class="[className, 'w-90']" v-on:click="onSelectNotepad">
        <i v-if="!notepad.saved" class="bi bi-cloud me-2"></i>
        <i v-if="notepad.saved" class="bi bi-cloud-check me-2"></i>
        {{ notepad.name }}
      </button>
      <button type="button" :class="[className, 'flex-shrink-1 text-center']"><i class="bi-gear-fill"></i></button>
    </div>
</template>

<script>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  name: "NotepadListItem",
  props: {
    notepad: { type: Object, required: true },
  },
  setup(props) {
    const store = useStore();

    const currentNotepad = computed(() => store.getters.notepad);
    const className = computed(() => {
      if (currentNotepad == null) {
        return "btn btn-list";
      }

      return currentNotepad.id == props.notepad.id ? "btn btn-list active" : "btn btn-list";
    });

    const onSelectNotepad = () => {
      store.commit("setNotepad", props.notepad);
    };

    return {
      notepad: props.notepad,
      className,
      onSelectNotepad,
    }
  }
};
</script>

<style scoped>
</style>
