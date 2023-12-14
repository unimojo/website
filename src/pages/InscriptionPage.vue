<template>
  <q-page>
    <q-banner class="text-white bg-red">
      Work In Progress. Not real data so far.
    </q-banner>
    <div class="row justify-evenly">
      <q-input
        filled
        v-model="search"
        placeholder="Search"
        clearable
        class="q-my-md"
        style="font-size: 20px; width: 50vw"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <div class="row justify-evenly">
      <q-card class="my-well col-xs-12 col-md-10 col-lg-8">
        <q-card-section>
          <q-list clearable>
            <q-item class="q-my-md text-subtitle1">
              <q-item-section></q-item-section>
              <q-item-section>Block Height</q-item-section>
              <q-item-section>Limit / Supply</q-item-section>
              <q-item-section>Mints</q-item-section>
              <q-item-section>Transactions</q-item-section>
            </q-item>
            <q-item
              v-for="(item, index) in listData"
              :key="index"
              clickable
              v-ripple
              class="bg-teal-10 rounded-borders q-my-md text-subtitle2"
            >
              <q-item-section class="synemono text-h4">{{
                item.tick
              }}</q-item-section>
              <q-item-section>{{ item.index }}</q-item-section>
              <q-item-section> {{ item.lim }} / {{ item.max }} </q-item-section>
              <q-item-section>-</q-item-section>
              <q-item-section>-</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';

interface TickInfo {
  tick: string;
  index: number;
  lim: number;
  max: number;
  info: string;
}

const search = ref('');
const listData: Ref<TickInfo[]> = ref([
  {
    tick: 'xchs',
    index: 42000000,
    lim: 1000,
    max: 21000000000,
    info: '',
  },
  {
    tick: 'meme',
    index: 40000000,
    lim: 1000,
    max: 21000,
    info: '',
  },
  {
    tick: 'doge',
    index: 40000000,
    lim: 1000,
    max: 21000000,
    info: '',
  },
  {
    tick: 'bram',
    index: 40000000,
    lim: 1000,
    max: 21000000,
    info: '',
  },
]);
</script>

<style>
.my-well {
  padding: 20px;
  background-color: #051505;
  margin-bottom: 20px;
  border-radius: 10px;
}
</style>
