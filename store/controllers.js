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
import version_config from '../version_config.json'
import storage from '../utils/storage'

const controller_defaults = {
  discovery_url: '',
  loaded: false,
  found: false,
  found_try: 1,
  i2c: [],
  leds: [],
  boxes: [],
}

const new_loadable_key = function(key) {
  const def = key.integer ? (key.default || 0) : key.default || ''
  return {
    value: def,
    loaded: false,
    loading: false,
    config_key: key,
    error: null,
  }
}

const schedule_promise = (n, retries) => {
  let loading_param_promise = Promise.resolve(),
      promises = []
  return function(req_func, ret_func) {
    let resolve, reject
    const p = new Promise((res, rej) => {resolve = res; reject = rej})
    loading_param_promise.then(async () => {
      let error
      for (let i = 0; i < retries; ++i) {
        try {
          resolve(await req_func())
          return
        } catch(e) {
          error = e
          if (e.status == 404) {
            break
          }
          ret_func && ret_func(e, i + 1)
        }
      }
      reject(error)
    })
    promises.push(p)
    if (promises.length >= n) {
      loading_param_promise = Promise.all(promises).catch((e) => {
        console.log('promise.all', e)
      })
      promises = []
    }

    return p
  }
}

const controller_chains = {}
const controller_chain = (id) => {
  if (typeof controller_chains[id] == 'undefined') {
    controller_chains[id] = schedule_promise(3, 3)
  }
  return controller_chains[id]
}
const discovery_chain = schedule_promise(3, 3)

for (let i in version_config.keys) {
  const key = version_config.keys[i]
  if (key.led) {
    if (!controller_defaults.leds[key.led.index]) {
      controller_defaults.leds[key.led.index] = {}
    }
    controller_defaults.leds[key.led.index][key.led.param] = new_loadable_key(key)
  } else if (key.box) {
    if (!controller_defaults.boxes[key.box.index]) {
      controller_defaults.boxes[key.box.index] = {}
    }
    controller_defaults.boxes[key.box.index][key.box.param] = new_loadable_key(key)
  } else if (key.i2c) {
    if (!controller_defaults.i2c[key.i2c.index]) {
      controller_defaults.i2c[key.i2c.index] = {}
    }
    controller_defaults.i2c[key.i2c.index][key.i2c.param] = new_loadable_key(key)
  } else {
    controller_defaults[key.name] = new_loadable_key(key)
  }
}

const stored = async function() {
  const controllers = (await storage.get('controllers', [])).map((c) => Object.assign(c, {found: false, found_try: 1}))
  return {
    controllers,
  }
}

export const state = () => ({
  searching_new_controller: 'nope',
  new_controller_is_sta: false,
  new_controller_failed: false,
  new_controller_failed_reason: null,
  new_controller_url: '192.168.4.1',
  search_n_tries: 0,
  new_controller: null,
  controllers: [],
})

const storeState = (state) => {
  storage.set('controllers', state.controllers)
}

const getById = function(state, id) {
  const controllers = state.controllers
  return controllers.find((c) => c.broker_clientid.value == id)
}

const setById = function(state, id, controller) {
  const i = state.controllers.findIndex((c) => c.broker_clientid.value == id)
  state.controllers = Object.assign([], state.controllers, { [i]: controller }) // TODO is this useful ? i think not..
  storeState(state)
}

export const getters = {
  getById: (state) => (id) => getById(state, id),
  getSelected(state) {
    const selected = $nuxt.$route.params.controller
    return getById(state, selected)
  },
}

export const mutations = {
  init(state, { controllers }) {
    state.controllers = controllers
  },
  configure_search_new_controller(state, { url, is_sta }) {
    state.new_controller_url = url
    state.new_controller_is_sta = is_sta
  },
  start_search_new_controller(state) {
    state.searching_new_controller = 'searching'
    state.search_n_tries = 0
  },
  found_new_controller(state, { controller, }) {
    state.searching_new_controller = 'loading'
    state.new_controller = controller
  },
  end_search_new_controller(state, { controller, error }) {
    state.searching_new_controller = 'nope'
    state.new_controller = controller
    state.new_controller_failed = !!error 
    state.new_controller_failed_reason = error 
  },
  search_try(state) {
    state.search_n_tries++
  },
  add_controller(state, controller) {
    state.controllers.push(controller)
    storeState(state)
  },
  set_found(state, id) {
    let controller = getById(state, id)
    controller.found = true
    setById(state, id, controller)
  },
  set_found_try(state, { id, n }) {
    let controller = getById(state, id)
    controller.found_try = n
    setById(state, id, controller)
  },
  loading_controller_param(state, { id, key }) {
    let controller = getById(state, id)
    controller[key] = Object.assign({}, controller[key], {loading: true})
    setById(state, id, controller)
  },
  loading_box_param(state, { id, i, key }) {
    let controller = getById(state, id)
    controller.boxes[i][key] = Object.assign({}, controller.boxes[i][key], {loading: true})
    setById(state, id, controller)
  },
  loading_led_param(state, { id, i, key }) {
    let controller = getById(state, id)
    controller.leds[i][key] = Object.assign({}, controller.leds[i][key], {loading: true})
    setById(state, id, controller)
  },
  loading_i2c_param(state, { id, i, key }) {
    let controller = getById(state, id)
    controller.i2c[i][key] = Object.assign({}, controller.i2c[i][key], {loading: true})
    setById(state, id, controller)
  },
  loaded_controller_param(state, { id, key, value, error }) {
    let controller = getById(state, id)
    controller[key] = Object.assign({}, controller[key], {error, value, loaded: true, loading: false})
    setById(state, id, controller)
  },
  loaded_box_param(state, { id, i, key, value, error }) {
    let controller = getById(state, id)
    controller.boxes[i][key] = Object.assign({}, controller.boxes[i][key], {error, value, loaded: true, loading: false})
    setById(state, id, controller)
  },
  loaded_led_param(state, { id, i, key, value, error }) {
    let controller = getById(state, id)
    controller.leds[i][key] = Object.assign({}, controller.leds[i][key], {error, value, loaded: true, loading: false})
    setById(state, id, controller)
  },
  loaded_i2c_param(state, { id, i, key, value, error }) {
    let controller = getById(state, id)
    controller.i2c[i][key] = Object.assign({}, controller.i2c[i][key], {error, value, loaded: true, loading: false})
    setById(state, id, controller)
  },
}

const wait_for_controller = async function (url, onTry) {
  for (let i = 0; i < 5; ++i) {
    onTry()
    try {
      const { data: name } = await axios.get(`http://${url}/s?k=DEVICE_NAME`, {timeout: 5000})
      return name
    } catch(e) {
      console.log(e)
    }
  }
  return false
}

let init_done = false
export const actions = {
  async init(context) {
    if (init_done == false) {
      context.commit('init', await stored())
      init_done = true
    }
  },
  async search_new_controller(context) {
    let name, url = context.state.new_controller_url
    context.commit('start_search_new_controller')
    if ((name = await wait_for_controller(url, () => context.commit('search_try'))) == false) {
      context.commit('end_search_new_controller', {controller: null, error: 'No controller found'})
      return
    }
    let controller = Object.assign({}, controller_defaults, {
      discovery_url: url,
      device_name: Object.assign({}, controller_defaults.device_name, {value: name, loaded: true}),
    })
    context.commit('found_new_controller', {controller})
    setTimeout(async () => {
      const { data: broker_clientid } = await discovery_chain(async () => axios.get(`http://${url}/s?k=BROKER_CLIENTID`, {timeout: 5000})),
            { data: state } = await discovery_chain(async () => axios.get(`http://${url}/i?k=STATE`, {timeout: 5000})),
            { data: wifi_ip } = await discovery_chain(async () => axios.get(`http://${url}/s?k=WIFI_IP`, {timeout: 5000})),
            { data: mdns_domain } = await discovery_chain(async () => axios.get(`http://${url}/s?k=MDNS_DOMAIN`, {timeout: 5000}))
      controller = Object.assign({}, controller, {
        loaded: true,
        broker_clientid: Object.assign({}, controller.broker_clientid, {
          value: broker_clientid, loaded: true
        }),
        state: Object.assign({}, controller.state, {
          value: state, loaded: true
        }),
        wifi_ip: Object.assign({}, controller.wifi_ip, {
          value: wifi_ip, loaded: true
        }),
        mdns_domain: Object.assign({}, controller.mdns_domain, {
          value: mdns_domain, loaded: true
        }),
      })
      context.commit('add_controller', controller)
      context.commit('end_search_new_controller', {controller, error: null})
    }, 500)
  },
  async search_controller(context, { id }) {
    context.commit('set_found_try', {id, n: 1})
    const controller = getById(context.state, id),
          url = controller.mdns_domain.value,
          { data: wifi_ip } = await controller_chain(id)(() => axios.get(`http://${url}.local/s?k=WIFI_IP`, {timeout: 5000}), (e, n) => context.commit('set_found_try', {id, n}))
    context.commit('loaded_controller_param', {id, key: 'wifi_ip', value: wifi_ip})
    context.commit('set_found', id)
  },
  async load_controller_param(context, { id, key }) {
    const controller = getById(context.state, id),
          config = controller[key].config_key
    context.commit('loading_controller_param', {id, key})
    try {
      const { data: value } = await controller_chain(id)(async () => axios.get(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=${key.toUpperCase()}`, {timeout: 5000}))
      context.commit('loaded_controller_param', {id, key, value: config.integer ? parseInt(value) : value})
    } catch(e) {
      context.commit('loaded_controller_param', {id, key, error: e})
    }
  },
  async load_box_param(context, { id, i, key }) {
    const controller = getById(context.state, id),
          config = controller.boxes[i][key].config_key
    context.commit('loading_box_param', {id, i, key})
    try {
      const { data: value } = await controller_chain(id)(async () => axios.get(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=BOX_${i}_${key.toUpperCase()}`, {timeout: 5000}))
      context.commit('loaded_box_param', {id, i, key, value: config.integer ? parseInt(value) : value})
    } catch(e) {
      context.commit('loaded_box_param', {id, i, key, error: e})
    }
  },
  async load_led_param(context, { id, i, key }) {
    const controller = getById(context.state, id),
          config = controller.leds[i][key].config_key
    context.commit('loading_led_param', {id, i, key})
    try {
      const { data: value } = await controller_chain(id)(async () => axios.get(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=LED_${i}_${key.toUpperCase()}`, {timeout: 5000}))
      context.commit('loaded_led_param', {id, i, key, value: config.integer ? parseInt(value) : value})
    } catch(e) {
      context.commit('loaded_led_param', {id, i, key, error: e})
    }
  },
  async load_i2c_param(context, { id, i, key }) {
    let controller = getById(context.state, id),
      config = controller.i2c[i][key].config_key
    context.commit('loading_i2c_param', id, i, key)
    try {
      const { data: value } = await controller_chain(id)(async () => axios.get(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=I2C_${i}_${key.toUpperCase()}`, {timeout: 5000}))
      context.commit('loaded_i2c_param', {id, i, key, value: config.integer ? parseInt(value) : value})
    } catch(e) {
      context.commit('loaded_i2c_param', {id, i, key, error: e})
    }
  },
  async set_controller_param(context, { id, key, value }) {
    const controller = getById(context.state, id),
          config = controller[key].config_key
    context.commit('loading_controller_param', {id, key})
    try {
      await controller_chain(id)(async () => await axios.post(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=${key.toUpperCase()}&v=${value}`, {timeout: 5000}))
      await context.dispatch('load_controller_param', {id, key})
    } catch(e) {
      context.commit('loaded_controller_param', {id, key, error: e})
    }
  },
  async set_box_param(context, { id, i, key, value }) {
    const controller = getById(context.state, id),
          config = controller.boxes[i][key].config_key
    context.commit('loading_box_param', {id, i, key})
    try {
      await controller_chain(id)(async () => await axios.post(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=BOX_${i}_${key.toUpperCase()}&v=${value}`, {timeout: 5000}))
      await context.dispatch('load_box_param', {id, i, key})
    } catch(e) {
      context.commit('loaded_box_param', {id, i, key, error: e})
    }
  },
  async set_led_param(context, { id, i, key, value }) {
    const controller = getById(context.state, id),
          config = controller.leds[i][key].config_key
    context.commit('loading_led_param', {id, i, key})
    try {
      await controller_chain(id)(async () => await axios.post(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=LED_${i}_${key.toUpperCase()}&v=${value}`, {timeout: 5000}))
      await context.dispatch('load_led_param', {id, i, key})
    } catch(e) {
      context.commit('loaded_led_param', {id, i, key, error: e})
    }
  },
  async set_i2c_param(context, { id, i, key }) {
    let controller = getById(context.state, id),
        config = controller.i2c[i][key].config_key
    context.commit('loading_i2c_param', id, i, key)
    try {
      await controller_chain(id)(async () => await axios.post(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=I2C_${i}_${key.toUpperCase()}&v=${value}`, {timeout: 5000}))
      await context.dispatch('load_i2c_param', {id, i, key})
    } catch(e) {
      context.commit('loaded_i2c_param', {id, i, key, error: e})
    }
  },
}
