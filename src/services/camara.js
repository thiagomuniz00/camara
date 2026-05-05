import axios from 'axios'

const api = axios.create({
  baseURL: 'https://dadosabertos.camara.leg.br/api/v2',
  headers: { Accept: 'application/json' },
})

export function listarProposicoes(params = {}) {
  return api.get('/proposicoes', { params })
}

export function obterProposicao(id) {
  return api.get(`/proposicoes/${id}`)
}

export function listarVotacoesProposicao(id) {
  return api.get(`/proposicoes/${id}/votacoes`)
}

export function listarTiposProposicao() {
  return api.get('/referencias/proposicoes/siglaTipo')
}

export function obterVotacao(votacaoId) {
  return api.get(`/votacoes/${votacaoId}`)
}

export function listarVotosVotacao(votacaoId, params = {}) {
  return api.get(`/votacoes/${votacaoId}/votos`, { params })
}

export default api
