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
            <q-card
              v-for="(block, i) in blocks"
              :key="i"
              bordered
              class="q-ma-md q-pa-md"
            >
              <q-card-section>
                <div class="text-h5 q-mb-sm">
                  <!-- <q-btn
                    color="primary"
                    outline
                    @click="loadPeekBlock()"
                    icon-right="refresh"
                    size="xs"
                  >
                  </q-btn> -->
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
              <div class="q-pa-md">
                <q-card
                  v-if="block.txSummaries.length ?? 0 > 0"
                  bordered
                  class="q-ma-md q-pa-md"
                >
                  <q-card-section>
                    <q-table
                      :rows="block.txSummaries"
                      :columns="columns"
                      row-key="name"
                    />
                  </q-card-section>
                </q-card>
              </div>
            </q-card>
          </template>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { Ref, computed, ref, watch } from 'vue';
import { bech32m } from '@scure/base';
import { onBeforeRouteLeave } from 'vue-router';
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

interface TxSummary {
  rawText: string;
  from: string;
  to: string;
  // coinName: string;
  status: number;
  // baseWorldState: string;
  // postWorldState: string;
  // hash: string;
}

interface Block {
  header: BlockHeader;
  txSummaries: TxSummary[];
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

const blocks: Ref<Block[]> = ref([]);
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
  // {
  //   name: 'hash',
  //   label: 'Hash',
  //   field: 'hash',
  // },
  {
    name: 'raw',
    label: 'Raw Memo',
    field: 'rawText',
  },
];

// async function loadPeekBlock() {
//   loading.value = true;
//   const resp = await fetch(`${baseApiUrl}block/peek`);
//   const header = (await resp.json()) as BlockHeader;
//   block.value = { header, txs: [] };
//   // const resp2 = await fetch(
//   //   `${baseApiUrl}block/height/${header.foliageBlockHeight}`
//   // );
//   // block.value = (await resp2.json()) as Block;
//   loading.value = false;
// }

// loadPeekBlock();

class WebSocketClient {
  private websocket: WebSocket;
  private url: string;

  constructor(url: string) {
    this.url = url;
    this.websocket = new WebSocket(this.url);
  }

  public connect() {
    this.websocket.onopen = (event) => {
      console.log('WebSocket opened.');
    };

    this.websocket.onmessage = (event) => {
      this.onMessageReceived(event.data);
    };

    this.websocket.onerror = (error) => {
      console.error(`Error: ${error}`);
    };

    this.websocket.onclose = (event) => {
      console.log(`WebSocket closed with code: ${event.code}`);
    };
  }

  public send(data: string) {
    if (this.websocket && this.websocket.readyState == WebSocket.OPEN) {
      this.websocket.send(data);
      console.log(`Message sent: ${data}`);
    } else {
      console.error('WebSocket is not open. Open url: ' + this.url);
    }
  }

  public close() {
    if (this.websocket) {
      this.websocket.close();
    }
  }

  private onMessageReceived(data: string) {
    // console.log(`Received: ${data}`);

    const block = JSON.parse(data) as Block;
    blocks.value.unshift(block);
    const MaxBlockNumber = 10;
    blocks.value =
      blocks.value.length > MaxBlockNumber
        ? blocks.value.slice(0, MaxBlockNumber)
        : blocks.value;
  }
}

let client = new WebSocketClient('wss://api.unimojo.io/ws/block');
client.connect();

onBeforeRouteLeave((to, from, next) => {
  client.close();
  next();
});
</script>

<style scoped lang="scss">
::v-deep .q-markdown--link-external {
  color: $secondary;
}
</style>
