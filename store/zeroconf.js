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

const zeroconfDiscovery = (context) => {
  window.cordova.plugins.zeroconf.watch('_http._tcp.', 'local.', ({action, service}) => {
    if (action == 'resolved') {
      context.commit('addDevice', service)
    }
  })
}

export const state = () => ({
  devices: [],
  available: false,
})

export const mutations = {
  init(state, { available }) {
    state.available = available
  },
  addDevice(state, device) {
    if (state.devices.findIndex((d) => d.ipv4Addresses[0] == device.ipv4Addresses[0]) != -1) {
      state.devices.push(device)
    }
  },
}

export const actions = {
  async init(context) {
    const available = isAvailable()
    context.commit('init', {available})
    if (available) {
      zeroconfDiscovery(context)
    }
  },
}

export const getters = {
  getDeviceByName: (state) => (name) => state.devices.find(d => d.name.toLowerCase() == name.replace('.local', '').toLowerCase()),
}
