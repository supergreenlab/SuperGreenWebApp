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

const isAvailable = function() {
  return !!window.cordova && !!window.cordova.plugins && !!window.cordova.plugins.zeroconf
}

const zeroconf_cache = []
const zeroconfDiscovery = async function (name) {
  return new Promise((resolve, reject) => {
    const cache = zeroconf_cache.find(z => z.name.toLowerCase() == name.replace('.local', '').toLowerCase())
    if (cache) {
      resolve(cache.ipv4Addresses[0])
      return
    }
    const cancel = setTimeout(() => {
      window.cordova.plugins.zeroconf.unwatch('_http._tcp.', 'local.')
      reject()
    }, 30000)
    window.cordova.plugins.zeroconf.watch('_http._tcp.', 'local.', function({action, service}) {
      if (action == 'resolved') {
        zeroconf_cache.push(service);
      }
      if (action == 'resolved' && service.name.toLowerCase() == name.replace('.local', '').toLowerCase()) {
        resolve(service.ipv4Addresses[0])
        window.cordova.plugins.zeroconf.unwatch('_http._tcp.', 'local.')
        clearTimeout(cancel)
      }
    })
  })
}

export const state = () => ({
  available: false,
})

export const mutations = {
  init(state, { available }) {
    state.available = available
  }
}

export const actions = {
  async init(context) {
    context.commit('init', {available: isAvailable()})
  },
}
