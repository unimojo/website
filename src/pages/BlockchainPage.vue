<template>
  <q-page>
    <q-banner class="text-white bg-orange">
      Our indexer is currently in beta testing. Occasionally, synchronization
      may pause, leading to inaccuracies in balance display. Please stay tuned
      for updates on Twitter.
    </q-banner>

    <div class="row justify-evenly">
      <q-card class="col-xs-12 col-md-10 col-lg-8">
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
            <q-card v-if="block" bordered class="q-ma-md q-pa-md">
              <q-card-section>
                <div class="text-h5 q-mb-sm">
                  <q-btn
                    color="primary"
                    outline
                    @click="loadPeekBlock()"
                    icon-right="refresh"
                    size="xs"
                  >
                  </q-btn>
                  {{ block.header.foliageBlockHeight }}
                  <q-badge align="top">Block Height</q-badge>
                </div>
                <div class="text-subtitle2 q-mb-xs">
                  Prev Block Hash: {{ block.header.prevBlockHash }}
                </div>
                <div class="text-subtitle2 q-mb-xs">
                  Foliage Block Hash: {{ block.header.foliageBlockHash }}
                </div>
                <div class="text-subtitle2 q-mb-xs">
                  World State Root: {{ block.header.worldStateRoot }}
                </div>
                <div class="text-subtitle2 q-mb-xs">
                  Tx Root: {{ block.header.transactionRoot }}
                </div>
                <div class="text-subtitle2 q-mb-xs">
                  Hash: {{ block.header.hash }}
                </div>
              </q-card-section>
            </q-card>
            <div class="q-pa-md">
              <q-card
                v-if="block?.txs.length ?? 0 > 0"
                bordered
                class="q-ma-md q-pa-md"
              >
                <q-card-section>
                  <q-table
                    :rows="block?.txs"
                    :columns="columns"
                    row-key="name"
                  />
                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { Ref, computed, ref, watch } from 'vue';
import { bech32m } from '@scure/base';

const baseApiUrl = 'https://api.unimojo.io/';
const loading = ref(false);

interface BlockHeader {
  version: number;
  prevBlockHash: string;
  foliageBlockHash: string;
  foliageBlockHeight: number;
  worldStateRoot: string;
  transactionRoot: string;
  hash: string;
}

interface Tx {
  rawText: string;
  from: string;
  to: string;
  coinName: string;
  status: number;
  baseWorldState: string;
  postWorldState: string;
  hash: string;
}

interface Block {
  header: BlockHeader;
  txs: Tx[];
}
function hexToUint8Array(hexString: string) {
  const length = hexString.length;
  const uint8array = new Uint8Array(length / 2);

  for (let i = 0; i < length; i += 2) {
    uint8array[i / 2] = parseInt(hexString.slice(i, i + 2), 16);
  }
  return uint8array;
}
function encode(val: string) {
  return bech32m.encode('xch', bech32m.toWords(hexToUint8Array(val)));
}

const block: Ref<Block | undefined> = ref(undefined);
const columns = [
  {
    name: 'sender',
    label: 'Sender',
    field: 'from',
    format: encode,
  },
  {
    name: 'receiver',
    label: 'Receiver',
    field: 'to',
    format: encode,
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
  },
  {
    name: 'hash',
    label: 'Hash',
    field: 'hash',
  },
  {
    name: 'raw',
    label: 'Raw Memo',
    field: 'rawText',
  },
];

async function loadPeekBlock() {
  loading.value = true;
  const resp = await fetch(`${baseApiUrl}block/peek`);
  const header = (await resp.json()) as BlockHeader;
  block.value = { header, txs: [] };
  // const resp2 = await fetch(
  //   `${baseApiUrl}block/height/${header.foliageBlockHeight}`
  // );
  // block.value = (await resp2.json()) as Block;
  loading.value = false;
}

loadPeekBlock();
</script>

<style scoped lang="scss">
::v-deep .q-markdown--link-external {
  color: $secondary;
}
</style>
