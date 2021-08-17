<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { modalInput, modalLoading, modalClose } from "../libs/modal";
import NotepadListItem from './NotepadListItem.vue';

const store = useStore();
const filter = ref("");

const notepads = computed(() => {
  return store.getters.notepads;
});

const notepadsFilter = computed(() => {
  let _query = filter.value == null ? '' : filter.value.replace(/\s+/g, ' ').toUpperCase();
  let _notepads = notepads.value == null ? null : notepads.value.filter(item => {
    return _query.length == 0 || item.name.toUpperCase().indexOf(_query) > -1;
  });

  return _notepads;
});

const notepadsLoaded = computed(() => {
  return notepads.value != null;
});

const notepad = computed(() => store.getters.notepad);

const onNewNotepad = async () => {
  const response = await modalInput(
    "",
    "New Simplepad",
    "Name of the new Simplepad",
    (value) => {
      if (value.length == 0) {
        return "You must enter a name.";
      }
    }
  );

  if (!response.isConfirmed) {
    return;
  }

  try {
    modalLoading("Saving new simplepad...");

    const res = await newNotepad({
      name: response.value,
      language: "plaintext",
    });

    modalClose();
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <!-- <div class="d-flex flex-column full-height-navbar justify-content-center align-items-center w-25 container-list"> -->
  <div class="d-flex flex-column full-height-navbar w-25 container-list">
    <div v-if="!notepadsLoaded" class="spinner-border text-light align-self-center my-auto" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>

    <div v-if="notepadsLoaded" class="d-flex position-sticky">
      <input type="text" class="form-control rounded-0 input-search w-90" v-model.trim="filter" placeholder="Search..." aria-label="Search..." />
      <button class="btn btn-outline-secondary rounded-0 button-new-simplepad border-start-0 flex-shrink-1" v-on:click="onNewNotepad" type="button"><i class="bi bi-plus-square-fill"></i></button>
    </div>

    <div v-if="notepadsLoaded" class="border-left-grey overflow-auto">
      <div class="border-0 rounded-0">
        <NotepadListItem v-for="n in notepadsFilter" :key="n.id" :notepad="n" :current="notepad" />
      </div>
    </div>
  </div>
</template>