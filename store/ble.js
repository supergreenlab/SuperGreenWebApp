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

const getBleById = function(state, id) {
  return state.devices.find((b) => b.id == id)
}

const setBleById = function(state, id, device) {
  const i = state.devices.findIndex((b) => b.id == id)
  state.devices = Object.assign([], state.devices, { [i]: device })
  storeState(state)
}

const bleDevice = async (context, device) => {
  const { ble } = window 
  try {
    device = await new Promise((resolve, reject) => { ble.connect(device.id, resolve, reject) })
    context.commit('addDevice', Object.assign(device, {params: {}},))

    const wifi_status = new DataView(await new Promise((resolve, reject) => {
      ble.read(device.id, '00ff', '5ca36981-9c55-74a5-5415-e16bc1c3fe17', resolve, reject)
    })).getInt8(0, true)
    context.commit('setDeviceParam', {id: device.id, key: 'wifi_status', value: wifi_status,})
    ble.startNotification(device.id, '00ff', '5ca36981-9c55-74a5-5415-e16bc1c3fe17', (wifi_status) => {
      context.commit('setDeviceParam', {id: device.id, key: 'wifi_status', value: new DataView(wifi_status).getInt8(0, true),})
    })

    const state = new DataView(await new Promise((resolve, reject) => {
      ble.read(device.id, '00ff', '8ff6dfd2-3bd6-feb4-43ec-de5663122894', resolve, reject)
    })).getInt8(0, true)
    context.commit('setDeviceParam', {id: device.id, key: 'state', value: state,})
    ble.startNotification(device.id, '00ff', '8ff6dfd2-3bd6-feb4-43ec-de5663122894', (wifi_status) => {
      context.commit('setDeviceParam', {id: device.id, key: 'wifi_status', value: new DataView(wifi_status).getInt8(0, true),})
    })

    const wifi_ip = new TextDecoder('utf-8').decode(await new Promise((resolve, reject) => {
      ble.read(device.id, '00ff', '8ca36981-9c55-74a5-5415-e16bc1c3fe17', (r) => {console.log(r);resolve(r)}, reject)
    }))
    context.commit('setDeviceParam', {id: device.id, key: 'wifi_ip', value: wifi_ip,})
    ble.startNotification(device.id, '00ff', '8ca36981-9c55-74a5-5415-e16bc1c3fe17', (wifi_ip) => {
      context.commit('setDeviceParam', {id: device.id, key: 'wifi_ip', value: new TextDecoder('utf-8').decode(wifi_ip),})
    })
  } catch(e) {
    console.log(e)
  }
}

const isAvailable = function() {
  return !!window.ble
}

const isEnabled = function() {
  const { ble } = window 
  return new Promise((resolve, reject) => {
    ble.isEnabled(() => resolve(true), () => resolve(false))
  })
}

export const state = () => ({
  devices: [],
  enabled: false,
  available: false,
})

export const mutations = {
  init(state, { available, enabled, }) {
    state.available = available
    state.enabled = enabled
  },
  enabled(state, enabled) {
    state.enabled = enabled
  },
  startScan(state) {
    state.scanning = true
  },
  stopScan(state) {
    state.scanning = false
  },
  setDeviceParam(state, { id, key, value }) {
    const device = getBleById(state, id)
    device.params = Object.assign({}, device.params, {[key]: value})
    setBleById(state, id, device)
  },
  addDevice(state, device) {
    state.devices.push(device)
  },
}

export const actions = {
  async init(context) {
    context.commit('init', {available: isAvailable(), enabled: isAvailable() && await isEnabled()})
  },
  async startScan(context) {
    if (!context.state.available) {
      return
    }

    const { ble } = window 
    if (!context.state.enabled) {
      try {
        await new Promise((resolve, reject) => ble.enable(resolve, reject))
        context.commit('enabled', true)
      } catch(e) {
        console.log(e)
        return
      }
    }
    while (true) {
      try {
        await new Promise((resolve, reject) => {
          const timeout = 5,
            timer = setTimeout(resolve, timeout * 1000)
          ble.scan([], timeout, function(device) {
            console.log(device)
            if (device.name == '🤖🍁' && !getBleById(context.state, device.id)) {
              bleDevice(context, device)
            }
          }, (e) => {
            clearTimeout(timer)
            reject(e)
          });
        })
      } catch(e) {
        console.log(e)
      }
      await new Promise((r) => setTimeout(r, 5000))
    }
  },
}

export const getters = {
  getControllers: (state) => (ip) => state.devices.filter((b) => b.params.wifi_ip == ip),
  getControllerById: (state) => (id) => state.devices.find((b) => b.id == id),
}
