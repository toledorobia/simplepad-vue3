<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

import { modalInputWithDelete, modalLoading, modalClose, modalConfirm } from "../libs/modal";
import { toastError } from "../libs/toast";
import { cl } from "../libs/dump";

const props = defineProps({
  notepad: { type: Object, required: true },
  current: { type: String },
});

const store = useStore();

const className = computed(() => {
  if (props.current == null) {
    return "btn btn-list";
  }

  return props.current == props.notepad.id ? "btn btn-list active" : "btn btn-list";
});

const onSelectNotepad = () => {
  store.dispatch("selectNotepadWithContent", props.notepad.id);
};

const onEditNotepad = async () => {
  const response = await modalInputWithDelete(
    props.notepad.name,
    "Edit Simplepad",
    "Name of the Simplepad",
    (value) => {
      if (value.length == 0) {
        return "You must enter a name.";
      }
    }
  );

  if (response.isConfirmed) {
    try {
      modalLoading();
      await store.dispatch("updateNotepad", { id: props.notepad.id, name: response.value });
      modalClose();
    } catch (error) {
      cl(error);
      modalClose();
      toastError(error);
    }
  }

  if (response.isDenied) {
    try {
      const response2 = await modalConfirm("Delete Simplepad", "Are you sure you want to delete this Simplepad?");

      if (response2.isConfirmed) {
        modalLoading();
        await store.dispatch("deleteNotepad", props.notepad.id);
        modalClose();
      }
    } catch (error) {
      cl(error);
      modalClose();
      toastError(error);
    }
  }
};
</script>

<template>
  <div class="d-flex">
    <button type="button" :class="[className, 'w-90']" v-on:click="onSelectNotepad">
      <i v-if="!notepad.saved" class="bi bi-cloud me-2"></i>
      <i v-if="notepad.saved" class="bi bi-cloud-check me-2"></i>
      {{ notepad.name }}
    </button>
    <button type="button" :class="[className, 'flex-shrink-1 text-center']" v-on:click="onEditNotepad"><i class="bi-gear-fill"></i></button>
  </div>
</template>
