<template>
  <v-container>
    <v-btn
      variant="text"
      color="primary"
      prepend-icon="mdi-arrow-left"
      class="mb-4"
      @click="$router.back()"
    >
      Voltar
    </v-btn>

    <v-alert v-if="erro" type="error" class="mb-4">{{ erro }}</v-alert>

    <template v-if="carregando">
      <v-skeleton-loader type="article" />
    </template>

    <template v-else-if="votacao">
      <!-- Cabeçalho da Votação -->
      <v-card class="mb-4" elevation="2">
        <v-card-title>
          <v-icon class="mr-2">mdi-vote</v-icon>
          Votação
        </v-card-title>
        <v-card-subtitle>
          {{ formatarDataHora(votacao.dataHoraInicio) }}
          <span v-if="votacao.siglaOrgao"> — {{ votacao.siglaOrgao }}</span>
        </v-card-subtitle>
        <v-card-text>
          <p v-if="votacao.descricao" class="text-body-1 mb-3">{{ votacao.descricao }}</p>

          <!-- Placar -->
          <v-row dense class="mb-2">
            <v-col cols="4">
              <v-card color="success" variant="tonal" class="text-center pa-2">
                <div class="text-h4 font-weight-bold">{{ votacao.placar?.votosSim ?? '—' }}</div>
                <div class="text-caption">Sim</div>
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card color="error" variant="tonal" class="text-center pa-2">
                <div class="text-h4 font-weight-bold">{{ votacao.placar?.votosNao ?? '—' }}</div>
                <div class="text-caption">Não</div>
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card color="grey" variant="tonal" class="text-center pa-2">
                <div class="text-h4 font-weight-bold">{{ votacao.placar?.votosAbstencao ?? '—' }}</div>
                <div class="text-caption">Abstenção</div>
              </v-card>
            </v-col>
          </v-row>

          <v-chip
            v-if="votacao.aprovacao !== undefined"
            :color="votacao.aprovacao === 1 ? 'success' : 'error'"
            size="large"
            variant="flat"
            class="mt-2"
          >
            <v-icon start>{{ votacao.aprovacao === 1 ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
            {{ votacao.aprovacao === 1 ? 'Aprovada' : 'Rejeitada' }}
          </v-chip>
        </v-card-text>
      </v-card>

      <!-- Votos dos Deputados -->
      <v-card elevation="1">
        <v-card-title>
          <v-icon class="mr-2">mdi-account-group</v-icon>
          Votos dos Deputados
        </v-card-title>

        <!-- Filtro por voto -->
        <v-card-text class="pb-0">
          <v-btn-toggle v-model="filtroVoto" color="primary" variant="outlined" density="compact">
            <v-btn value="todos">Todos</v-btn>
            <v-btn value="Sim">Sim</v-btn>
            <v-btn value="Não">Não</v-btn>
            <v-btn value="Abstenção">Abstenção</v-btn>
          </v-btn-toggle>
        </v-card-text>

        <v-card-text v-if="carregandoVotos">
          <v-progress-linear indeterminate color="primary" />
        </v-card-text>

        <v-card-text v-else-if="votosFiltrados.length === 0">
          <v-empty-state
            icon="mdi-account-question"
            title="Nenhum voto encontrado"
          />
        </v-card-text>

        <v-list v-else density="compact">
          <v-list-item
            v-for="voto in votosFiltrados"
            :key="voto.deputado_.id"
          >
            <template #prepend>
              <v-avatar size="36" color="grey-lighten-3">
                <v-img
                  v-if="voto.deputado_?.urlFoto"
                  :src="voto.deputado_.urlFoto"
                  :alt="voto.deputado_?.nome"
                />
                <v-icon v-else>mdi-account</v-icon>
              </v-avatar>
            </template>
            <v-list-item-title>{{ voto.deputado_?.nome }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ voto.deputado_?.siglaPartido }} – {{ voto.deputado_?.siglaUf }}
            </v-list-item-subtitle>
            <template #append>
              <v-chip
                :color="corVoto(voto.voto)"
                size="small"
                variant="flat"
              >
                {{ voto.voto }}
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </template>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { obterVotacao, listarVotosVotacao } from '@/services/camara.js'

const route = useRoute()
const votacao = ref(null)
const votos = ref([])
const carregando = ref(false)
const carregandoVotos = ref(false)
const erro = ref(null)
const filtroVoto = ref('todos')

function formatarDataHora(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function corVoto(voto) {
  if (voto === 'Sim') return 'success'
  if (voto === 'Não') return 'error'
  if (voto === 'Abstenção') return 'warning'
  return 'grey'
}

const votosFiltrados = computed(() => {
  if (filtroVoto.value === 'todos') return votos.value
  return votos.value.filter(v => v.voto === filtroVoto.value)
})

async function carregar() {
  carregando.value = true
  erro.value = null
  try {
    const { data } = await obterVotacao(route.params.id)
    votacao.value = data.dados

    carregandoVotos.value = true
    const resp = await listarVotosVotacao(route.params.id)
    votos.value = resp.data.dados ?? []
  } catch {
    erro.value = 'Não foi possível carregar os dados desta votação.'
  } finally {
    carregando.value = false
    carregandoVotos.value = false
  }
}

onMounted(carregar)
</script>
