<template>
  <q-layout view="hHh lpR fFf">
    <q-header bordered class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <img style="width: 100px" class="q-mr-md" src="../assets/logo.svg" />
        <q-separator dark vertical inset />
        <q-btn to="/" stretch flat label="Home" :icon="mdiHome" />
        <q-separator dark vertical inset />
        <q-btn
          to="/xchs"
          stretch
          flat
          :class="{ active: $route.path == '/xchs' }"
          label="Xchs"
          :icon="mdiCodeJson"
        />
        <q-separator dark vertical inset />
        <q-btn
          to="/inscribe"
          stretch
          flat
          :class="{ active: $route.path == '/inscribe' }"
          label="Inscribe"
          :icon="mdiLeadPencil"
        />
        <q-separator dark vertical inset />
        <q-btn
          to="/market"
          stretch
          flat
          :class="{ active: $route.path == '/market' }"
          label="Market"
          :icon="mdiShopping"
        />
        <q-separator dark vertical inset />
        <q-space />
        <q-tabs>
          <!-- <q-route-tab
            href="https://github.com/unimojo"
            target="_blank"
            :icon="mdiGithub"
          /> -->
          <q-route-tab
            href="https://twitter.com/xchscriptions"
            target="_blank"
            :icon="mdiTwitter"
          />
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
  mdiShopping,
  mdiLeadPencil,
} from '@quasar/extras/mdi-v6';
</script>

<style lang="scss">
.active {
  background-color: $green-8 !important;
}
</style>
