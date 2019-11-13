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
import storage from '~/utils/storage'

const newLoadableKey = function(key) {
  const def = key.integer ? (key.default || 0) : (key.default || '')
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

const controllerChains = {}
const controllerChain = (id, n) => {
  n = n || 3
  id = `${id}-${n}`
  if (typeof controllerChains[id] == 'undefined') {
    controllerChains[id] = schedule_promise(3, n)
  }
  return controllerChains[id]
}
const discoveryChain = schedule_promise(3, 3)

const controllerFromconfig = (config) => {
  const controller_defaults = {
    discovery_url: '',
    loaded: false,
    found: false,
    found_try: 1,
    i2c: [],
    leds: [],
    boxes: [],
    motors: [],
  }
  for (let i in config.keys) {
    const key = config.keys[i]
    if (key.led) {
      if (!controller_defaults.leds[key.led.index]) {
        controller_defaults.leds[key.led.index] = {}
      }
      controller_defaults.leds[key.led.index][key.led.param] = newLoadableKey(key)
    } else if (key.box) {
      if (!controller_defaults.boxes[key.box.index]) {
        controller_defaults.boxes[key.box.index] = {}
      }
      controller_defaults.boxes[key.box.index][key.box.param] = newLoadableKey(key)
    } else if (key.motor) {
      if (!controller_defaults.motors[key.motor.index]) {
        controller_defaults.motors[key.motor.index] = {}
      }
      controller_defaults.motors[key.motor.index][key.motor.param] = newLoadableKey(key)
    } else if (key.i2c) {
      if (!controller_defaults.i2c[key.i2c.index]) {
        controller_defaults.i2c[key.i2c.index] = {}
      }
      controller_defaults.i2c[key.i2c.index][key.i2c.param] = newLoadableKey(key)
    } else {
      controller_defaults[key.name] = newLoadableKey(key)
    }
  }
  return controller_defaults
}

const stored = async function() {
  const controllers = (await storage.get('controllers', [])).map((c) => Object.assign(c, {found: false, found_try: 1,}))
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

const waitForController = async function (url, onTry) {
  for (let i = 0; i < 5; ++i) {
    onTry()
    try {
      const { data: ip } = await axios.get(`http://${url}/s?k=WIFI_IP`, {timeout: 5000})
      return ip
    } catch(e) {
      console.log(e)
    }
  }
  return false
}

const running_daemons = {}
const startControllerDaemon = (context, controller) => {
  if (running_daemons[controller.broker_clientid.value]) return
  running_daemons[controller.broker_clientid.value] = {
    controller,
  }
  const start = async function() {
    while (true) {
      try {
        await context.dispatch('searchController', {id: controller.broker_clientid.value})
        break
      } catch(e) {
        console.log(e)
        await new Promise((r) => setTimeout(r, 5000))
      }
    }

    context.dispatch('setControllerParam', {id: controller.broker_clientid.value, key: 'time', value: parseInt(new Date().getTime() / 1000)}) 

    const loadAll = async function (name, items) {
      for (let i in items) {
        for (let j in items[i]) {
          if (typeof items[i][j].config_key !== 'undefined') {
            try {
              await context.dispatch(`load${name[0].toUpperCase() + name.slice(1)}Param`, {id: controller.broker_clientid.value, i, key: j}) 
            } catch(e) {
              console.log(e)
            }
          }
        }
      }
    }

    await Promise.all([
      loadAll('led', controller.leds),
      loadAll('box', controller.boxes),
      loadAll('motor', controller.motors),
      loadAll('controller', [controller]),
      loadAll('i2c', controller.i2c),
    ])

    running_daemons[controller.broker_clientid.value].search_interval = setInterval(async () => {
      try {
        await context.dispatch('searchController', {id: controller.broker_clientid.value})
      } catch(e) {
        console.log(e)
      }
    }, 60 * 1000)
    running_daemons[controller.broker_clientid.value].reload_interval = setInterval(() => {
      if (controller.found == false) return
      context.dispatch('loadControllerParam', {id: controller.broker_clientid.value, key: 'time'}) 
      for (let i in controller.boxes) {
        (async function () {
          await context.dispatch('loadBoxParam', {id: controller.broker_clientid.value, i, key: 'timer_output'}) 
          if (controller.sht21_temp_c) {
            await context.dispatch('loadBoxParam', {id: controller.broker_clientid.value, i, key: 'sht21_temp_f'}) 
            await context.dispatch('loadBoxParam', {id: controller.broker_clientid.value, i, key: 'sht21_temp_c'}) 
            await context.dispatch('loadBoxParam', {id: controller.broker_clientid.value, i, key: 'sht21_humi'}) 
          } else {
            await context.dispatch('loadBoxParam', {id: controller.broker_clientid.value, i, key: 'temp'}) 
            await context.dispatch('loadBoxParam', {id: controller.broker_clientid.value, i, key: 'humi'}) 
          }
        })()
      }
    }, 5 * 60 * 1000)
  }
  start()
}

const stopControllerDaemon = (controllerId) => {
  running_daemons[controllerId].search_interval && clearInterval(running_daemons[controllerId].search_interval)
  running_daemons[controllerId].reload_interval && clearInterval(running_daemons[controllerId].reload_interval)
  delete running_daemons[controllerId]
}

const is_ip = (url) => {
  return url.match(/\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/)
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
  configureSearchNewController(state, { url, is_sta }) {
    state.new_controller_url = url
    state.new_controller_is_sta = is_sta
  },
  startSearchNewController(state) {
    state.searching_new_controller = 'searching'
    state.search_n_tries = 0
  },
  foundNewController(state, { controller, }) {
    state.searching_new_controller = 'loading'
    state.new_controller = controller
  },
  endSearchNewController(state, { controller, error }) {
    state.searching_new_controller = 'nope'
    state.new_controller = controller
    state.new_controller_failed = !!error 
    state.new_controller_failed_reason = error 
  },
  searchTry(state) {
    state.search_n_tries++
  },
  addController(state, controller) {
    state.controllers.push(controller)
    storeState(state)
  },
  deleteController(state, id) {
    stopControllerDaemon(id)
    state.controllers = state.controllers.filter((c) => c.broker_clientid.value != id)
    storeState(state)
  },
  setFound(state, id) {
    let controller = getById(state, id)
    controller.found = true
    setById(state, id, controller)
  },
  setNotFound(state, id) {
    let controller = getById(state, id)
    controller.found = false
    setById(state, id, controller)
  },
  setFoundTry(state, { id, n }) {
    let controller = getById(state, id)
    controller.found_try = n
    setById(state, id, controller)
  },
  loadingControllerParam(state, { id, key }) {
    let controller = getById(state, id)
    controller[key] = Object.assign({}, controller[key], {loading: true})
    setById(state, id, controller)
  },
  loadingBoxParam(state, { id, i, key }) {
    let controller = getById(state, id)
    controller.boxes[i][key] = Object.assign({}, controller.boxes[i][key], {loading: true})
    setById(state, id, controller)
  },
  loadingMotorParam(state, { id, i, key }) {
    let controller = getById(state, id)
    controller.motors[i][key] = Object.assign({}, controller.motors[i][key], {loading: true})
    setById(state, id, controller)
  },
  loadingLedParam(state, { id, i, key }) {
    let controller = getById(state, id)
    controller.leds[i][key] = Object.assign({}, controller.leds[i][key], {loading: true})
    setById(state, id, controller)
  },
  loadingI2cParam(state, { id, i, key }) {
    let controller = getById(state, id)
    controller.i2c[i][key] = Object.assign({}, controller.i2c[i][key], {loading: true})
    setById(state, id, controller)
  },
  loadedControllerParam(state, { id, key, value, error }) {
    let controller = getById(state, id)
    controller[key] = Object.assign({}, controller[key], {error, value, loaded: true, loading: false})
    setById(state, id, controller)
  },
  loadedBoxParam(state, { id, i, key, value, error }) {
    let controller = getById(state, id)
    controller.boxes[i][key] = Object.assign({}, controller.boxes[i][key], {error, value, loaded: true, loading: false})
    setById(state, id, controller)
  },
  loadedMotorParam(state, { id, i, key, value, error }) {
    let controller = getById(state, id)
    controller.motors[i][key] = Object.assign({}, controller.motors[i][key], {error, value, loaded: true, loading: false})
    setById(state, id, controller)
  },
  loadedLedParam(state, { id, i, key, value, error }) {
    let controller = getById(state, id)
    controller.leds[i][key] = Object.assign({}, controller.leds[i][key], {error, value, loaded: true, loading: false})
    setById(state, id, controller)
  },
  loadedI2cParam(state, { id, i, key, value, error }) {
    let controller = getById(state, id)
    controller.i2c[i][key] = Object.assign({}, controller.i2c[i][key], {error, value, loaded: true, loading: false})
    setById(state, id, controller)
  },
}

let init_done = false
export const actions = {
  async init(context) {
    if (init_done == false) {
      context.commit('init', await stored())
      for (let i in context.state.controllers) {
        startControllerDaemon(context, context.state.controllers[i])
      }
      init_done = true
    }
  },
  async searchNewController(context) {
    const discovery_url = context.state.new_controller_url
    let url = context.state.new_controller_url
    context.commit('startSearchNewController')

    if (!is_ip(url) && context.state.has_mobile_zeroconf) {
      try {
        url = await zeroconf_discovery(url)
      } catch(e) {
        context.commit('endSearchNewController', {controller: null, error: 'No controller found'})
        return
      }
    } else {
      if ((url = await waitForController(url, () => context.commit('searchTry'))) == false) {
        context.commit('endSearchNewController', {controller: null, error: 'No controller found'})
        return
      }
    }

    const { data: config } = await discoveryChain(async () => axios.get(`http://${url}/fs/config.json`, {timeout: 5000})),
          controller_defaults = controllerFromconfig(config)

    const { data: name } = await discoveryChain(async () => axios.get(`http://${url}/s?k=DEVICE_NAME`, {timeout: 5000}))
    let controller = Object.assign({}, controller_defaults, {
      discovery_url,
      device_name: Object.assign({}, controller_defaults.device_name, {value: name, loaded: true}),
    })
    context.commit('foundNewController', {controller})
    const { data: broker_clientid } = await discoveryChain(async () => axios.get(`http://${url}/s?k=BROKER_CLIENTID`, {timeout: 5000})),
      { data: state } = await discoveryChain(async () => axios.get(`http://${url}/i?k=STATE`, {timeout: 5000})),
      { data: wifi_ip } = await discoveryChain(async () => axios.get(`http://${url}/s?k=WIFI_IP`, {timeout: 5000})),
      { data: mdns_domain } = await discoveryChain(async () => axios.get(`http://${url}/s?k=MDNS_DOMAIN`, {timeout: 5000}))
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
    context.commit('addController', controller)
    context.commit('endSearchNewController', {controller, error: null})
    startControllerDaemon(context, controller)
  },
  async searchController(context, { id, ip }) {
    context.commit('setFoundTry', {id, n: 1})
    const controller = getById(context.state, id),
          url = controller.mdns_domain.value
    let found_by_ip = false
    const addr = ip || controller.wifi_ip.value
    if (addr) {
      console.log('searching by ip', ip)
      try {
        await controllerChain(id)(() => axios.get(`http://${addr}/s?k=MDNS_DOMAIN`, {timeout: 5000}), (e, n) => context.commit('setFoundTry', {id, n}))
        if (ip) {
          context.commit('loadedControllerParam', {id, key: 'wifi_ip', value: addr})
        }
        context.commit('setFound', id)
        return
      } catch(e) {
        console.log(e)
        context.commit('setNotFound', id)
      }
    }
    console.log('IP not found, trying zeroconf')
    try {
      if (context.state.has_mobile_zeroconf) {
        const ip = await zeroconf_discovery(url)
        context.commit('loadedControllerParam', {id, key: 'wifi_ip', value: ip})
      } else {
        const { data: ip } = await controllerChain(id)(() => axios.get(`http://${url}.local/s?k=WIFI_IP`, {timeout: 5000}), (e, n) => context.commit('setFoundTry', {id, n}))
        context.commit('loadedControllerParam', {id, key: 'wifi_ip', value: ip})
      }
      context.commit('setFound', id)
    } catch(e) {
      console.log('Zeroconf failed', e)
      context.commit('setNotFound', id)
      throw (e)
      return
    }
  },
  async loadControllerParam(context, { id, key }) {
    const controller = getById(context.state, id),
          config = controller[key].config_key
    context.commit('loadingControllerParam', {id, key})
    try {
      const { data: value } = await controllerChain(id)(async () => axios.get(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=${key.toUpperCase()}`, {timeout: 5000}))
      context.commit('loadedControllerParam', {id, key, value: config.integer ? parseInt(value) : value})
    } catch(e) {
      context.commit('loadedControllerParam', {id, key, error: e})
      throw(e)
    }
  },
  async loadBoxParam(context, { id, i, key }) {
    const controller = getById(context.state, id),
          config = controller.boxes[i][key].config_key
    context.commit('loadingBoxParam', {id, i, key})
    try {
      let { data: value } = await controllerChain(id)(async () => axios.get(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=BOX_${i}_${key.toUpperCase()}`, {timeout: 5000}))
      if (key.indexOf('hour') !== -1) {
        value = (value - new Date().getTimezoneOffset()/60) % 24
        value = value < 0 ? value + 24 : value
      }
      context.commit('loadedBoxParam', {id, i, key, value: config.integer ? parseInt(value) : value})
    } catch(e) {
      context.commit('loadedBoxParam', {id, i, key, error: e})
      throw(e)
    }
  },
  async loadMotorParam(context, { id, i, key }) {
    const controller = getById(context.state, id),
          config = controller.motors[i][key].config_key
    context.commit('loadingMotorParam', {id, i, key})
    try {
      let { data: value } = await controllerChain(id)(async () => axios.get(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=MOTOR_${i}_${key.toUpperCase()}`, {timeout: 5000}))
      context.commit('loadedMotorParam', {id, i, key, value: config.integer ? parseInt(value) : value})
    } catch(e) {
      context.commit('loadedMotorParam', {id, i, key, error: e})
      throw(e)
    }
  },
  async loadLedParam(context, { id, i, key }) {
    const controller = getById(context.state, id),
          config = controller.leds[i][key].config_key
    context.commit('loadingLedParam', {id, i, key})
    try {
      const { data: value } = await controllerChain(id)(async () => axios.get(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=LED_${i}_${key.toUpperCase()}`, {timeout: 5000}))
      context.commit('loadedLedParam', {id, i, key, value: config.integer ? parseInt(value) : value})
    } catch(e) {
      context.commit('loadedLedParam', {id, i, key, error: e})
      throw(e)
    }
  },
  async loadI2cParam(context, { id, i, key }) {
    let controller = getById(context.state, id),
      config = controller.i2c[i][key].config_key
    context.commit('loadingI2cParam', {id, i, key})
    try {
      const { data: value } = await controllerChain(id)(async () => axios.get(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=I2C_${i}_${key.toUpperCase()}`, {timeout: 5000}))
      context.commit('loadedI2cParam', {id, i, key, value: config.integer ? parseInt(value) : value})
    } catch(e) {
      context.commit('loadedI2cParam', {id, i, key, error: e})
      throw(e)
    }
  },
  async setControllerParam(context, { id, key, value, n, }) {
    const controller = getById(context.state, id),
          config = controller[key].config_key
    context.commit('loadingControllerParam', {id, key})
    try {
      await controllerChain(id, n || 3)(async () => await axios.post(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=${key.toUpperCase()}&v=${encodeURIComponent(value)}`, '', {timeout: 5000}))
      await context.dispatch('loadControllerParam', {id, key})
    } catch(e) {
      context.commit('loadedControllerParam', {id, key, error: e})
      throw(e)
    }
  },
  async set_box_param(context, { id, i, key, value }) {
    const controller = getById(context.state, id),
          config = controller.boxes[i][key].config_key
    context.commit('loadingBoxParam', {id, i, key})
    try {
      if (key.indexOf('hour') !== -1) {
        value = (value + new Date().getTimezoneOffset()/60) % 24
        value = value < 0 ? value + 24 : value
      }

      await controllerChain(id)(async () => await axios.post(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=BOX_${i}_${key.toUpperCase()}&v=${encodeURIComponent(value)}`, '', {timeout: 5000}))
      await context.dispatch('loadBoxParam', {id, i, key})
    } catch(e) {
      context.commit('loadedBoxParam', {id, i, key, error: e})
      throw(e)
    }
  },
  async setMotorParam(context, { id, i, key, value }) {
    const controller = getById(context.state, id),
          config = controller.motors[i][key].config_key
    context.commit('loadingMotorParam', {id, i, key})
    try {
      if (key.indexOf('hour') !== -1) {
        value = (value + new Date().getTimezoneOffset()/60) % 24
        value = value < 0 ? value + 24 : value
      }

      await controllerChain(id)(async () => await axios.post(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=MOTOR_${i}_${key.toUpperCase()}&v=${value}`, '', {timeout: 5000}))
      await context.dispatch('loadMotorParam', {id, i, key})
    } catch(e) {
      context.commit('loadedMotorParam', {id, i, key, error: e})
      throw(e)
    }
  },
  async setLedParam(context, { id, i, key, value }) {
    const controller = getById(context.state, id),
          config = controller.leds[i][key].config_key
    context.commit('loadingLedParam', {id, i, key})
    try {
      await controllerChain(id)(async () => await axios.post(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=LED_${i}_${key.toUpperCase()}&v=${value}`, '', {timeout: 5000}))
      await context.dispatch('loadLedParam', {id, i, key})
    } catch(e) {
      context.commit('loadedLedParam', {id, i, key, error: e})
      throw(e)
    }
  },
  async setI2cParam(context, { id, i, key }) {
    let controller = getById(context.state, id),
        config = controller.i2c[i][key].config_key
    context.commit('loadingI2cParam', id, i, key)
    try {
      await controllerChain(id)(async () => await axios.post(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=I2C_${i}_${key.toUpperCase()}&v=${value}`, '', {timeout: 5000}))
      await context.dispatch('loadI2cParam', {id, i, key})
    } catch(e) {
      context.commit('loadedI2cParam', {id, i, key, error: e})
      throw(e)
    }
  },
}
