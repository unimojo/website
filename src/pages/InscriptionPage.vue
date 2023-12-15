<template>
  <q-page>
    <q-banner class="text-white bg-orange">
      The website currently cannot display the progress of Mint correctly, we
      are working diligently on this. Please stay tuned for updates on Twitter.
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
          <div v-if="loading" class="row justify-evenly">
            <q-circular-progress
              indeterminate
              rounded
              size="50px"
              color="lime"
              class="q-ma-md"
            />
          </div>
          <q-list v-else clearable>
            <q-item class="q-my-md text-subtitle1">
              <q-item-section></q-item-section>
              <q-item-section>Block Height</q-item-section>
              <q-item-section>Limit / Supply</q-item-section>
              <q-item-section>Mints</q-item-section>
              <q-item-section>Transactions</q-item-section>
            </q-item>
            <q-item
              v-for="(item, index) in filteredList"
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
import { Ref, computed, ref } from 'vue';

interface TickInfo {
  tick: string;
  index: number;
  lim: number;
  max: number;
  info: string;
}

const loading = ref(true);

const search = ref('');
const listData: Ref<TickInfo[]> = ref([]);

const filteredList = computed(() => {
  const s = search.value.toLowerCase();
  if (!s) return listData.value;
  return listData.value.filter((_) => _.tick.toLowerCase().includes(s));
});

async function loadData() {
  loading.value = true;
  const resp = await fetch('https://walletapi.chiabee.net/inscription/ticks');
  listData.value = (await resp.json()).ticks as TickInfo[];
  loading.value = false;
  console.log(listData.value);
}

loadData();
</script>

<style>
.my-well {
  padding: 20px;
  background-color: #051505;
  margin-bottom: 20px;
  border-radius: 10px;
}
</style>
