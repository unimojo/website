<template>
  <q-page>
    <q-banner class="text-white bg-orange">
      Our indexer is currently in beta testing. Occasionally, synchronization
      may pause, leading to inaccuracies in balance display. Please stay tuned
      for updates on Twitter.
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
                  <li
                    v-for="(tick, i) in holder.ticks"
                    :key="i"
                    class="q-my-sm"
                  >
                    <template v-if="typeof tick === 'string'">
                      <span class="synemono q-mr-sm">
                        {{ tick }}
                      </span>
                      <q-btn
                        color="secondary"
                        size="sm"
                        label="Load Balance"
                        @click="loadBalance(tick)"
                      />
                    </template>
                    <template v-else-if="tick.loading">
                      <span class="synemono q-mr-sm">
                        {{ tick.tick }}
                      </span>

                      <q-spinner-grid color="primary" size="2em" />
                    </template>
                    <template v-else>
                      <span class="synemono q-mr-sm">
                        {{ tick.tick }}
                      </span>

                      <ul>
                        <li>Balance: {{ tick.balance }}</li>
                      </ul>
                    </template>
                  </li>
                </ul>
              </q-card-section>
            </q-card>
            <q-list v-else clearable>
              <q-item class="q-my-md text-subtitle1">
                <q-item-section side>#</q-item-section>
                <q-item-section>Tick</q-item-section>
                <!-- <q-item-section>Block Height</q-item-section> -->
                <q-item-section>Limit / Supply</q-item-section>
                <q-item-section>Mints</q-item-section>
                <!-- <q-item-section>Minters</q-item-section> -->
              </q-item>
              <q-item
                v-for="(item, index) in filteredList"
                :key="index"
                clickable
                v-ripple
                class="bg-teal-10 rounded-borders q-my-md text-subtitle2"
              >
                <q-item-section side class="right">
                  {{ item.id < 9 ? '&nbsp;&nbsp;' : '' }}{{ item.id + 1 }}
                </q-item-section>
                <q-item-section class="synemono text-h4">
                  {{ item.tick }}
                </q-item-section>
                <!-- <q-item-section>{{ item.index }}</q-item-section> -->
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
                <!-- <q-item-section v-if="item.minters">{{
                  item.minters
                }}</q-item-section>
                <q-item-section v-else>-</q-item-section> -->
                <!-- <q-item-section>-</q-item-section> -->
              </q-item>
              <q-pagination
                v-model="page"
                :max="maxPage"
                direction-links
                push
                color="teal"
                active-design="push"
                active-color="orange"
                :max-pages="6"
                boundary-numbers
              />
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
  // index: number;
  limit: number;
  max: number;
  total: number;
  // info: string | DetailTickInfo;
}
interface DisplayTickInfo {
  tick: string;
  // index?: number;
  id: number;
  lim: number;
  max: number;
  // mints?: number;
  total?: number;
  progress?: number;
  // minters?: number;
}

interface HolderTickResponse {
  ticks: (HolderTickInfo | string)[];
  address: string;
}

interface HolderTickInfo {
  tick: string;
  balance?: number;
  loading?: boolean;
}

const loading = ref(false);

const baseApiUrl = 'https://api.unimojo.io/';
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
const page = ref(1);
const maxPage = ref(1);
const PerPage = 10;

const filteredList = computed(() => {
  const s = search.value?.toLowerCase() ?? '';
  let lst;
  if (!s) lst = listData.value;
  lst = listData.value.filter((_) => _.tick.toLowerCase().includes(s));
  return lst.slice((page.value - 1) * PerPage, page.value * PerPage);
});

watch(
  () => search,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (newValue, _oldValue) => {
    if (!newValue.value) return;
    if (!address.value) return;
    if (address.value == holder.value?.address) return;
    holder.value = undefined;
    const resp = await fetch(
      `${baseApiUrl}inscription/holder/${address.value}`
    );
    const rawticks = (await resp.json()).ticks as string[];
    holder.value = { ticks: rawticks, address: address.value };
  },
  { deep: true }
);

async function loadBalance(tick: string) {
  if (!holder.value) return;
  const i = holder.value.ticks.findIndex((_) => _ == tick);
  if (i == -1) return;
  holder.value.ticks[i] = {
    tick,
    loading: true,
  };
  const resp = await fetch(
    `${baseApiUrl}inscription/holder/${address.value}/${tick}`
  );
  const data = await resp.json();
  holder.value.ticks[i] = {
    tick,
    loading: false,
    balance: data.balance,
  };
}

async function loadData() {
  loading.value = true;
  const resp = await fetch(`${baseApiUrl}inscription/ticks`);
  const rawticks = (await resp.json()).ticks as TickInfo[];
  listData.value = rawticks.map((item, i) => {
    let progress = !item.total ? undefined : item.total / item.max;
    progress = !progress ? undefined : progress > 1 ? 1 : progress;
    return {
      tick: item.tick,
      // index: item.index,
      id: i,
      lim: item.limit,
      max: item.max,
      // mints: info.mints,
      // minters: info.minters,
      total: item.total,
      progress,
    };
  });

  maxPage.value = Math.ceil(listData.value.length / PerPage);
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
