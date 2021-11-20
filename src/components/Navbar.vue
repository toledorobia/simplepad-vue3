<script setup>
import { computed } from 'vue';
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { toastError } from "@toledorobia/helpers";

const store = useStore();
const router = useRouter();
const user = store.getters.user;
const saved = computed(() => store.getters.saved);

const signOut = async () => {
  try {
    await store.dispatch("signOut");
    router.replace("/sign-in");
  } catch (e) {
    toastError(e);
  }
};
</script>

<template>
  <nav class="navbar navbar-dark bg-dark navbar-expand-lg sticky-top shadow">
    <div class="container-fluid">
      <a class="navbar-brand" href="!#">
        <small class="text-muted">Vue</small> Simplepad
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <span v-if="saved" class="badge rounded-pill bg-success" title="All simplepads saved!"><i class="bi bi-cloud-check-fill"></i></span>
            <span v-if="!saved" className="badge rounded-pill bg-secondary" title="Some simplepads have not been saved..."><i className="bi bi-cloud-fill"></i></span>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle"
              href="!#"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false">{{ user.email }}</a>
            <ul class="dropdown-menu shadow" aria-labelledby="navbarDropdown">
              <li>
                <button class="dropdown-item" v-on:click="signOut">
                  Sign Out
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
