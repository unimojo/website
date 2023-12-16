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
          <template v-else>
            <q-card v-if="address">
              <q-banner class="text-white bg-red">
                ATTENTION: Current holdings data is not precise even with
                invalid mints. For accurate info, await our improved indexing.
              </q-banner>
              <!-- <q-card-section>
                <div>
                  <p>{{ search }}</p>
                </div>
              </q-card-section> -->

              <div v-if="!holder" class="row justify-evenly">
                <q-circular-progress
                  indeterminate
                  rounded
                  size="50px"
                  color="lime"
                  class="q-ma-md"
                />
              </div>
              <q-card-section v-else>
                <ul>
                  <li v-for="(tick, i) in holder.ticks" :key="i">
                    {{ tick.tick }}

                    <ul>
                      <li>Total: {{ tick.sum }}</li>
                      <li>Mints: {{ tick.count }}</li>
                    </ul>
                  </li>
                </ul>
              </q-card-section>
            </q-card>
            <q-list v-else clearable>
              <q-item class="q-my-md text-subtitle1">
                <q-item-section></q-item-section>
                <q-item-section>Block Height</q-item-section>
                <q-item-section>Limit / Supply</q-item-section>
                <q-item-section>Mints</q-item-section>
                <q-item-section>Minters</q-item-section>
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
                <q-item-section>
                  {{ item.lim }} / {{ item.max }}
                </q-item-section>
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
                <q-item-section v-if="item.minters">{{
                  item.minters
                }}</q-item-section>
                <q-item-section v-else>-</q-item-section>
                <!-- <q-item-section>-</q-item-section> -->
              </q-item>
            </q-list>
          </template>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { Ref, computed, ref, watch } from 'vue';
import { bech32m } from '@scure/base';

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

interface HolderTickResponse {
  ticks: HolderTickInfo[];
  address: string;
}

interface HolderTickInfo {
  tick: string;
  count: number;
  sum: number;
}

const loading = ref(false);

const baseApiUrl = 'https://walletapi.chiabee.net/';
const search = ref('');
const listData: Ref<DisplayTickInfo[]> = ref([]);
const holder: Ref<HolderTickResponse | undefined> = ref(undefined);
const address = computed(() => {
  const s = search.value?.toLowerCase();
  if (!s) return null;
  if (!s.startsWith('xch1') || s.length != 62) return null;
  return Array.from(bech32m.decodeToBytes(s).bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
});

const filteredList = computed(() => {
  const s = search.value?.toLowerCase();
  if (!s) return listData.value;
  return listData.value.filter((_) => _.tick.toLowerCase().includes(s));
});

watch(
  () => search,
  async (newValue, _oldValue) => {
    if (!newValue.value) return;
    if (!address.value) return;
    if (address.value == holder.value?.address) return;
    holder.value = undefined;
    const resp = await fetch(
      `${baseApiUrl}inscription/holder/${address.value}`
    );
    const rawticks = (await resp.json()).ticks as HolderTickInfo[];
    holder.value = { ticks: rawticks, address: address.value };
  },
  { deep: true }
);

async function loadData() {
  loading.value = true;
  const resp = await fetch(`${baseApiUrl}inscription/ticks`);
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
