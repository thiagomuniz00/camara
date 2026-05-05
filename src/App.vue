<template>
  <v-app>
    <v-app-bar color="primary" elevation="3">
      <v-app-bar-nav-icon
        variant="text"
        @click="drawer = !drawer"
      />
      <v-app-bar-title>
        <router-link to="/proposicoes" style="color:white;text-decoration:none;font-weight:600;">
          🏛️ Câmara dos Deputados
        </router-link>
      </v-app-bar-title>
      <template #append>
        <v-chip color="secondary" size="small" class="mr-3">
          Projetos & Votações
        </v-chip>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list-item
        prepend-icon="mdi-bank"
        title="Câmara dos Deputados"
        subtitle="Dados Abertos"
        nav
      />
      <v-divider />
      <v-list nav>
        <v-list-item
          prepend-icon="mdi-file-document-multiple"
          title="Projetos de Lei"
          to="/proposicoes"
          @click="drawer = false"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

    <v-footer color="primary" class="text-center d-flex justify-center">
      <span style="color:rgba(255,255,255,0.8);font-size:12px;">
        Dados provenientes da
        <a href="https://dadosabertos.camara.leg.br" target="_blank" style="color:#F9A825;">
          API de Dados Abertos
        </a>
        da Câmara dos Deputados
      </span>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
const drawer = ref(false)
</script>
