<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <img style="width: 100px" class="q-mr-md" src="../assets/logo.svg" />
        <q-separator dark vertical inset />
        <q-btn to="/" stretch flat label="Home" :icon="mdiHome" />
        <q-separator dark vertical inset />
        <q-btn
          to="/inscription"
          stretch
          flat
          label="Inscriptions"
          :icon="mdiCodeJson"
        />
        <q-separator dark vertical inset />
        <q-space />
        <q-tabs>
          <q-route-tab
            href="https://github.com/unimojo"
            target="_blank"
            :icon="mdiGithub"
          />
          <q-route-tab href="" target="_blank" :icon="mdiTwitter" />
          <q-route-tab
            href="https://docs.unimojo.io"
            target="_blank"
            :icon="mdiBookOpenOutline"
          />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {
  mdiGithub,
  mdiTwitter,
  mdiBookOpenOutline,
  mdiHome,
  mdiCodeJson,
} from '@quasar/extras/mdi-v6';
</script>
