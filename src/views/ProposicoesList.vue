<template>
  <v-container>
    <v-row class="mb-4">
      <v-col>
        <h1 class="text-h5 font-weight-bold">Projetos de Lei</h1>
        <p class="text-body-2 text-medium-emphasis">
          Pesquise e consulte projetos de lei e proposições da Câmara dos Deputados.
        </p>
      </v-col>
    </v-row>

    <!-- Filtros -->
    <v-card class="mb-4" elevation="1">
      <v-card-text>
        <v-row dense>
          <v-col cols="12" sm="3">
            <v-select
              v-model="filtros.siglaTipo"
              :items="tiposProposicao"
              item-title="sigla"
              item-value="sigla"
              label="Tipo"
              clearable
              density="compact"
            />
          </v-col>
          <v-col cols="12" sm="2">
            <v-select
              v-model="filtros.ano"
              :items="anos"
              label="Ano"
              clearable
              density="compact"
            />
          </v-col>
          <v-col cols="12" sm="5">
            <v-text-field
              v-model="filtros.keywords"
              label="Palavras-chave"
              clearable
              density="compact"
              append-inner-icon="mdi-magnify"
              @keyup.enter="buscar"
            />
          </v-col>
          <v-col cols="12" sm="2" class="d-flex align-center">
            <v-btn
              color="primary"
              block
              :loading="carregando"
              @click="buscar"
            >
              Buscar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Erro -->
    <v-alert v-if="erro" type="error" class="mb-4" closable @click:close="erro = null">
      {{ erro }}
    </v-alert>

    <!-- Lista -->
    <v-card elevation="1">
      <v-data-table-server
        v-model:items-per-page="itensPorPagina"
        :headers="colunas"
        :items="proposicoes"
        :items-length="totalItens"
        :loading="carregando"
        :page="pagina"
        loading-text="Carregando proposições..."
        no-data-text="Nenhuma proposição encontrada."
        @update:page="mudarPagina"
        @update:items-per-page="mudarItensPorPagina"
      >
        <template #item.siglaTipo="{ item }">
          <v-chip color="primary" size="small" variant="tonal">
            {{ item.siglaTipo }}
          </v-chip>
        </template>

        <template #item.numero="{ item }">
          {{ item.numero }}/{{ item.ano }}
        </template>

        <template #item.ementa="{ item }">
          <span class="text-truncate d-block" style="max-width:400px;" :title="item.ementa">
            {{ item.ementa }}
          </span>
        </template>

        <template #item.acoes="{ item }">
          <v-btn
            size="small"
            variant="tonal"
            color="primary"
            :to="{ name: 'proposicao', params: { id: item.id } }"
          >
            Detalhes
          </v-btn>
        </template>
      </v-data-table-server>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listarProposicoes, listarTiposProposicao } from '@/services/camara.js'

const proposicoes = ref([])
const tiposProposicao = ref([])
const totalItens = ref(0)
const carregando = ref(false)
const erro = ref(null)
const pagina = ref(1)
const itensPorPagina = ref(15)

const filtros = ref({
  siglaTipo: 'PL',
  ano: new Date().getFullYear(),
  keywords: '',
})

const colunas = [
  { title: 'Tipo', key: 'siglaTipo', width: '80px', sortable: false },
  { title: 'Número/Ano', key: 'numero', width: '110px', sortable: false },
  { title: 'Ementa', key: 'ementa', sortable: false },
  { title: '', key: 'acoes', width: '100px', sortable: false, align: 'center' },
]

const anoAtual = new Date().getFullYear()
const anos = Array.from({ length: 20 }, (_, i) => anoAtual - i)

async function carregarTipos() {
  try {
    const { data } = await listarTiposProposicao()
    tiposProposicao.value = data.dados ?? []
  } catch {
    // silently ignore – user can type manually
  }
}

async function carregarProposicoes() {
  carregando.value = true
  erro.value = null
  try {
    const params = {
      ordem: 'DESC',
      ordenarPor: 'id',
      itens: itensPorPagina.value,
      pagina: pagina.value,
    }
    if (filtros.value.siglaTipo) params.siglaTipo = filtros.value.siglaTipo
    if (filtros.value.ano) params.ano = filtros.value.ano
    if (filtros.value.keywords) params.keywords = filtros.value.keywords

    const { data } = await listarProposicoes(params)
    proposicoes.value = data.dados ?? []

    const linkHeader = data.links?.find(l => l.rel === 'last')
    if (linkHeader) {
      const match = linkHeader.href.match(/pagina=(\d+)/)
      if (match) {
        totalItens.value = parseInt(match[1]) * itensPorPagina.value
      } else {
        totalItens.value = proposicoes.value.length
      }
    } else {
      totalItens.value = proposicoes.value.length
    }
  } catch (e) {
    erro.value = 'Não foi possível carregar as proposições. Verifique sua conexão e tente novamente.'
    proposicoes.value = []
    totalItens.value = 0
  } finally {
    carregando.value = false
  }
}

function buscar() {
  pagina.value = 1
  carregarProposicoes()
}

function mudarPagina(p) {
  pagina.value = p
  carregarProposicoes()
}

function mudarItensPorPagina(n) {
  itensPorPagina.value = n
  pagina.value = 1
  carregarProposicoes()
}

onMounted(() => {
  carregarTipos()
  carregarProposicoes()
})
</script>
