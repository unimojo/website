<template>
  <q-page>
    <div class="row justify-evenly">
      <div class="col col-xs-11 col-md-10 col-lg-8">
        <!-- prettier-ignore -->
        <q-markdown :src="how"/>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import how from '../assets/inscribe.md';
</script>

<style scoped lang="scss">
::v-deep .q-markdown--link-external {
  color: $secondary;
}
</style>
