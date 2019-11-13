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

import storage from '../utils/storage'

const stored = async function () {
  return {
    first_start: await storage.get('first_start', true)
  }
}

export const state = () => ({
  first_start: true
})

const storeState = (state) => {
  storage.set('first_start', state.first_start)
}

export const mutations = {
  init(state, { first_start }) {
    state.first_start = first_start
  },
  firstStart(state) {
    state.first_start = false
    storeState(state)
  },
}

let init_done = false
export const actions = {
  async init(context) {
    if (init_done == false) {
      context.commit('init', await stored())
      init_done = true
    }
  },
}
