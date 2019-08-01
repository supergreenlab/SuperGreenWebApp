/*
 * Copyright (C) 2019  SuperGreenLab <towelie@supergreenlab.com>
 * Author: Constantin Clauzel <constantin.clauzel@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import axios from 'axios'
import storage from '../utils/storage'

const stored = async function() {
  return {
    sources: await storage.get('graphs', {}),
  }
}

export const state = () => ({
  sources: {}, // will move to flatten state later if needed performance wise
})

const storeState = (state) => {
  storage.set('graphs', state.sources)
}

export const mutations = {
  init(state, { sources }) {
    state.sources = sources
  },
  add_source(state, { id, url }) {
    if (state.sources[id]) return
    state.sources = Object.assign({}, state.sources, {
      [id]: Object.assign({metrics: []}, state.sources[id] || {}, {
        url,
        loaded: false,
      })
    })
    storeState(state)
  },
  set_metrics(state, { id, metrics }) {
    state.sources = Object.assign({}, state.sources, {
      [id]: Object.assign({}, state.sources[id], {
        loaded: true,
        metrics,
      })
    })
    storeState(state)
  },
}

const start_source_daemon = (context, id, url) => {
  setInterval(() => {
    context.dispatch('reload_graph', {id, url})
  }, 30 * 1000)
  context.dispatch('reload_graph', {id, url})
}

let init_done = false
export const actions = {
  async init(context) {
    if (init_done == false) {
      context.commit('init', await stored())
      for (let i in context.state.sources) {
        start_source_daemon(context, i, context.state.sources[i].url)
      }
      init_done = true
    }
  },
  async load_graph(context, { id, url}) {
    context.commit('add_source', { id, url })
    start_source_daemon(context, id, url)
  },
  async reload_graph(context, { id, url }) {
    const { data: { metrics } } = await axios.get(url)
    context.commit('set_metrics', {id, metrics})
  },
}

export const getters = {
  source: (state) => (id) => state.sources[id]
}
