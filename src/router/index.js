import { createRouter, createWebHistory } from 'vue-router'
import ProposicoesList from '@/views/ProposicoesList.vue'
import ProposicaoDetail from '@/views/ProposicaoDetail.vue'
import VotacaoDetail from '@/views/VotacaoDetail.vue'

const routes = [
  { path: '/', redirect: '/proposicoes' },
  { path: '/proposicoes', component: ProposicoesList, name: 'proposicoes' },
  { path: '/proposicoes/:id', component: ProposicaoDetail, name: 'proposicao' },
  { path: '/votacoes/:id', component: VotacaoDetail, name: 'votacao' },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
