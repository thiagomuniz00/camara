<template>
  <v-container>
    <!-- Voltar -->
    <v-btn
      variant="text"
      color="primary"
      prepend-icon="mdi-arrow-left"
      class="mb-4"
      @click="$router.back()"
    >
      Voltar
    </v-btn>

    <!-- Loading / erro -->
    <v-alert v-if="erro" type="error" class="mb-4">{{ erro }}</v-alert>

    <template v-if="carregando">
      <v-skeleton-loader type="article" />
    </template>

    <template v-else-if="proposicao">
      <!-- Cabeçalho -->
      <v-card class="mb-4" elevation="2">
        <v-card-title class="d-flex align-center flex-wrap gap-2">
          <v-chip color="primary" variant="flat" class="mr-2">
            {{ proposicao.siglaTipo }}
          </v-chip>
          <span>
            {{ proposicao.siglaTipo }} {{ proposicao.numero }}/{{ proposicao.ano }}
          </span>
        </v-card-title>

        <v-card-subtitle v-if="proposicao.statusProposicao?.descricaoSituacao">
          Situação: {{ proposicao.statusProposicao.descricaoSituacao }}
        </v-card-subtitle>

        <v-card-text>
          <p class="text-body-1 mb-4">{{ proposicao.ementa }}</p>

          <v-row dense>
            <v-col v-if="proposicao.dataApresentacao" cols="12" sm="4">
              <v-list-item density="compact" prepend-icon="mdi-calendar">
                <v-list-item-title>Apresentação</v-list-item-title>
                <v-list-item-subtitle>{{ formatarData(proposicao.dataApresentacao) }}</v-list-item-subtitle>
              </v-list-item>
            </v-col>
            <v-col v-if="proposicao.statusProposicao?.regime" cols="12" sm="4">
              <v-list-item density="compact" prepend-icon="mdi-gavel">
                <v-list-item-title>Regime</v-list-item-title>
                <v-list-item-subtitle>{{ proposicao.statusProposicao.regime }}</v-list-item-subtitle>
              </v-list-item>
            </v-col>
            <v-col v-if="proposicao.statusProposicao?.siglaOrgao" cols="12" sm="4">
              <v-list-item density="compact" prepend-icon="mdi-domain">
                <v-list-item-title>Órgão</v-list-item-title>
                <v-list-item-subtitle>{{ proposicao.statusProposicao.siglaOrgao }}</v-list-item-subtitle>
              </v-list-item>
            </v-col>
          </v-row>

          <div v-if="proposicao.urlInteiroTeor" class="mt-3">
            <v-btn
              color="secondary"
              variant="tonal"
              prepend-icon="mdi-file-pdf-box"
              :href="proposicao.urlInteiroTeor"
              target="_blank"
              size="small"
            >
              Inteiro Teor
            </v-btn>
          </div>
        </v-card-text>
      </v-card>

      <!-- Votações -->
      <v-card elevation="1">
        <v-card-title prepend-icon="mdi-vote">
          <v-icon class="mr-2">mdi-vote</v-icon>
          Votações
        </v-card-title>

        <v-card-text v-if="carregandoVotacoes">
          <v-progress-linear indeterminate color="primary" />
        </v-card-text>

        <v-card-text v-else-if="votacoes.length === 0">
          <v-empty-state
            icon="mdi-vote-outline"
            title="Nenhuma votação registrada"
            text="Esta proposição não possui votações registradas na API da Câmara."
          />
        </v-card-text>

        <v-list v-else lines="two">
          <v-list-item
            v-for="v in votacoes"
            :key="v.id"
            :subtitle="formatarData(v.dataHoraInicio)"
            :to="{ name: 'votacao', params: { id: v.id } }"
          >
            <template #title>
              <span class="font-weight-medium">{{ v.descricao || 'Votação' }}</span>
            </template>
            <template #prepend>
              <v-avatar :color="corResultado(v.aprovacao)" size="36">
                <v-icon size="18" color="white">
                  {{ iconResultado(v.aprovacao) }}
                </v-icon>
              </v-avatar>
            </template>
            <template #append>
              <v-chip
                :color="corResultado(v.aprovacao)"
                size="small"
                variant="tonal"
              >
                {{ labelResultado(v.aprovacao) }}
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </template>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { obterProposicao, listarVotacoesProposicao } from '@/services/camara.js'

const route = useRoute()
const proposicao = ref(null)
const votacoes = ref([])
const carregando = ref(false)
const carregandoVotacoes = ref(false)
const erro = ref(null)

function formatarData(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function corResultado(aprovacao) {
  if (aprovacao === 1) return 'success'
  if (aprovacao === 0) return 'error'
  return 'grey'
}
function iconResultado(aprovacao) {
  if (aprovacao === 1) return 'mdi-check'
  if (aprovacao === 0) return 'mdi-close'
  return 'mdi-minus'
}
function labelResultado(aprovacao) {
  if (aprovacao === 1) return 'Aprovada'
  if (aprovacao === 0) return 'Rejeitada'
  return 'Sem resultado'
}

async function carregar() {
  carregando.value = true
  erro.value = null
  try {
    const { data } = await obterProposicao(route.params.id)
    proposicao.value = data.dados

    carregandoVotacoes.value = true
    const resp = await listarVotacoesProposicao(route.params.id)
    votacoes.value = resp.data.dados ?? []
  } catch {
    erro.value = 'Não foi possível carregar os dados desta proposição.'
  } finally {
    carregando.value = false
    carregandoVotacoes.value = false
  }
}

onMounted(carregar)
</script>
