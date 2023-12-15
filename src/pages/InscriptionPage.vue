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
              <q-item-section v-if="item.progress">
                <q-linear-progress
                  size="25px"
                  :value="item.progress"
                  color="teal-5"
                  rounded
                >
                  <div class="absolute-full flex flex-center">
                    <q-badge
                      color="white"
                      text-color="teal-10"
                      :label="(item.progress * 100).toFixed(1) + '%'"
                    />
                  </div> </q-linear-progress
              ></q-item-section>
              <q-item-section v-else>-</q-item-section>
              <!-- <q-item-section v-if="item.minters">{{
                item.minters
              }}</q-item-section>
              <q-item-section v-else>-</q-item-section> -->
              <q-item-section v-if="item.mints">{{
                item.mints
              }}</q-item-section>
              <q-item-section v-else>-</q-item-section>
              <!-- <q-item-section>-</q-item-section> -->
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
  info: string | DetailTickInfo;
}
interface DetailTickInfo {
  mints?: number;
  tick?: string;
  total?: number;
  minters?: number;
}
interface DisplayTickInfo {
  tick: string;
  index: number;
  lim: number;
  max: number;
  mints?: number;
  total?: number;
  progress?: number;
  minters?: number;
}

const loading = ref(false);

const search = ref('');
const listData: Ref<DisplayTickInfo[]> = ref([]);

const filteredList = computed(() => {
  const s = search.value.toLowerCase();
  if (!s) return listData.value;
  return listData.value.filter((_) => _.tick.toLowerCase().includes(s));
});

async function loadData() {
  loading.value = true;
  const resp = await fetch('https://walletapi.chiabee.net/inscription/ticks');
  const rawticks = (await resp.json()).ticks as TickInfo[];
  listData.value = rawticks.map((item) => {
    if (typeof item.info === 'string') {
      const info = JSON.parse(item.info) as DetailTickInfo;
      let progress = !info.total ? undefined : info.total / item.max;
      progress = !progress ? undefined : progress > 1 ? 1 : progress;
      return {
        tick: item.tick,
        index: item.index,
        lim: item.lim,
        max: item.max,
        mints: info.mints,
        minters: info.minters,
        total: info.total,
        progress,
      };
    } else {
      return {
        tick: item.tick,
        index: item.index,
        lim: item.lim,
        max: item.max,
      };
    }
  });

  loading.value = false;
  // console.log(listData.value);
}

if (!loading.value) loadData();
</script>

<style>
.my-well {
  padding: 20px;
  background-color: #051505;
  margin-bottom: 20px;
  border-radius: 10px;
}
</style>
