<template>
  <q-page class="column items-center q-pa-lg">
    <div class="flex-start">
      <div class="text-h3 q-mb-md">
        <img style="width: 200px" class="q-mr-md" src="../assets/logo.svg" />
      </div>

      <q-card class="q-mb-md" style="max-width: 800px">
        <q-card-section>
          Unimojo is the first inscription and transaction platform on the XCHS
          protocol.
        </q-card-section>

        <q-card-section>
          XCHS is an inscription protocol on the Chia blockchain. It introduces
          a novel format by incorporating an account model into the UTXO-based
          Chia ecosystem. Diverging from inscription protocols on other
          blockchains, such as Bitcoin and Ethereum, XCHS leverages a unique
          feature in Chia - memos.
        </q-card-section>
      </q-card>

      <div class="row q-gutter-md">
        <q-btn color="primary" to="/xchs" label="Xchs List" />
        <q-btn color="secondary" to="/inscribe" label="Inscribe" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts"></script>

<style></style>
