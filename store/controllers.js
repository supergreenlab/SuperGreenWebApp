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

const new_loadable_key = function(key) {
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

const controller_chains = {}
const controller_chain = (id, n) => {
  n = n || 3
  id = `${id}-${n}`
  if (typeof controller_chains[id] == 'undefined') {
    controller_chains[id] = schedule_promise(3, n)
  }
  return controller_chains[id]
}
const discovery_chain = schedule_promise(3, 3)

const controller_from_config = (config) => {
  const controller_defaults = {
    discovery_url: '',
    loaded: false,
    found: false,
    found_try: 1,
    i2c: [],
    leds: [],
    boxes: [],
  }
  for (let i in config.keys) {
    const key = config.keys[i]
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
  ble: [],
  ble_enabled: false,
  has_ble: false,
  has_mobile_zeroconf: false,
})

const storeState = (state) => {
  storage.set('controllers', state.controllers)
}

const getById = function(state, id) {
  const controllers = state.controllers
  return controllers.find((c) => c.broker_clientid.value == id)
}

const getBleById = function(state, id) {
  const ble = state.ble
  return ble.find((b) => b.id == id)
}

const setById = function(state, id, controller) {
  const i = state.controllers.findIndex((c) => c.broker_clientid.value == id)
  state.controllers = Object.assign([], state.controllers, { [i]: controller }) // TODO is this useful ? i think not..
  storeState(state)
}

const setBleById = function(state, id, device) {
  const i = state.ble.findIndex((b) => b.id == id)
  state.ble = Object.assign([], state.ble, { [i]: device }) // TODO is this useful ? i think not..
  storeState(state)
}

export const getters = {
  getById: (state) => (id) => getById(state, id),
  getSelected(state) {
    const selected = $nuxt.$route.params.controller
    return getById(state, selected)
  },
  getBLEControllers: (state) => (ip) => state.ble.filter((b) => b.params.wifi_ip == ip),
  getBLEControllerById: (state) => (id) => state.ble.find((b) => b.id == id),
}

export const mutations = {
  init(state, { controllers }) {
    state.controllers = controllers
  },
  cordova_caps(state, { has_ble, has_mobile_zeroconf, }) {
    state.has_ble = has_ble
    state.has_mobile_zeroconf = has_mobile_zeroconf
  },
  ble_enabled(state, enabled) {
    state.ble_enabled = enabled
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
  delete_controller(state, id) {
    stop_controller_daemon(id)
    state.controllers = state.controllers.filter((c) => c.broker_clientid.value != id)
    storeState(state)
  },
  set_found(state, id) {
    let controller = getById(state, id)
    controller.found = true
    setById(state, id, controller)
  },
  set_notfound(state, id) {
    let controller = getById(state, id)
    controller.found = false
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
  start_ble_scan(state) {
    state.ble_scan = true
  },
  stop_ble_scan(state) {
    state.ble_scan = false
  },
  set_ble_device_param(state, { id, key, value }) {
    console.log('set_ble_device_param', id, key, value)
    const device = getBleById(state, id)
    console.log(device.params)
    device.params = Object.assign({}, device.params, {[key]: value})
    console.log(device.params)
    setBleById(state, id, device)
  },
  add_ble_device(state, device) {
    state.ble.push(device)
  },
}

const wait_for_controller = async function (url, onTry) {
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

const zeroconf_discovery = async function (name) {
  return new Promise((resolve, reject) => {
    const cancel = setTimeout(() => {
      window.cordova.plugins.zeroconf.unwatch('_http._tcp.', 'local.')
      reject()
    }, 20000)
    window.cordova.plugins.zeroconf.watch('_http._tcp.', 'local.', function({action, service}) {
      console.log('zeroconf', action, service, name)
      if (action == 'resolved' && service.name.toLowerCase() == name.replace('.local', '').toLowerCase()) {
        resolve(service.ipv4Addresses[0])
        window.cordova.plugins.zeroconf.unwatch('_http._tcp.', 'local.')
        clearTimeout(cancel)
      }
    })
  })
}

const running_daemons = {}
const start_controller_daemon = (context, controller) => {
  if (running_daemons[controller.broker_clientid.value]) return
  running_daemons[controller.broker_clientid.value] = {
    controller,
  }
  const start = async function() {
    while (true) {
      try {
        await context.dispatch('search_controller', {id: controller.broker_clientid.value})
        break
      } catch(e) {
        console.log(e)
        await new Promise((r) => setTimeout(r, 5000))
      }
    }

    context.dispatch('set_controller_param', {id: controller.broker_clientid.value, key: 'time', value: parseInt(new Date().getTime() / 1000)}) 

    const load_all = async function (name, items) {
      for (let i in items) {
        for (let j in items[i]) {
          if (typeof items[i][j].value !== 'undefined') {
            try {
              await context.dispatch(`load_${name}_param`, {id: controller.broker_clientid.value, i, key: j}) 
            } catch(e) {
              console.log(e)
            }
          }
        }
      }
    }

    await Promise.all([
      load_all('led', controller.leds),
      load_all('box', controller.boxes),
      load_all('controller', [controller]),
      load_all('i2c', controller.i2c),
    ])

    running_daemons[controller.broker_clientid.value].search_interval = setInterval(async () => {
      try {
        await context.dispatch('search_controller', {id: controller.broker_clientid.value})
      } catch(e) {
        console.log(e)
      }
    }, 60 * 1000)
    running_daemons[controller.broker_clientid.value].reload_interval = setInterval(() => {
      if (controller.found == false) return
      context.dispatch('load_controller_param', {id: controller.broker_clientid.value, key: 'time'}) 
      for (let i in controller.boxes) {
        (async function () {
          await context.dispatch('load_box_param', {id: controller.broker_clientid.value, i, key: 'timer_output'}) 
          await context.dispatch('load_box_param', {id: controller.broker_clientid.value, i, key: 'sht21_temp_f'}) 
          await context.dispatch('load_box_param', {id: controller.broker_clientid.value, i, key: 'sht21_temp_c'}) 
          await context.dispatch('load_box_param', {id: controller.broker_clientid.value, i, key: 'sht21_humi'}) 
        })()
      }
    }, 5 * 60 * 1000)
  }
  start()
}

const stop_controller_daemon = (controllerId) => {
  clearInterval(running_daemons[controllerId].search_interval)
  clearInterval(running_daemons[controllerId].reload_interval)
  delete running_daemons[controllerId]
}

const ble_device = async (context, device) => {
  try {
    device = await new Promise((resolve, reject) => { ble.connect(device.id, resolve, reject) })
    context.commit('add_ble_device', Object.assign(device, {params: {}},))
    const wifi_status = new DataView(await new Promise((resolve, reject) => {
      ble.read(device.id, '00ff', '5ca36981-9c55-74a5-5415-e16bc1c3fe17', resolve, reject)
    })).getInt32(0, true)
    context.commit('set_ble_device_param', {id: device.id, key: 'wifi_status', value: wifi_status,})
    ble.startNotification(device.id, '00ff', '5ca36981-9c55-74a5-5415-e16bc1c3fe17', (wifi_status) => {
      context.commit('set_ble_device_param', {id: device.id, key: 'wifi_status', value: new DataView(wifi_status).getInt32(0, true),})
    })

    const state = new DataView(await new Promise((resolve, reject) => {
      ble.read(device.id, '00ff', '8ff6dfd2-3bd6-feb4-43ec-de5663122894', resolve, reject)
    })).getInt32(0, true)
    context.commit('set_ble_device_param', {id: device.id, key: 'state', value: state,})
    ble.startNotification(device.id, '00ff', '8ff6dfd2-3bd6-feb4-43ec-de5663122894', (wifi_status) => {
      context.commit('set_ble_device_param', {id: device.id, key: 'wifi_status', value: new DataView(wifi_status).getInt32(0, true),})
    })

    const wifi_ip = new TextDecoder('utf-8').decode(await new Promise((resolve, reject) => {
      ble.read(device.id, '00ff', '8ca36981-9c55-74a5-5415-e16bc1c3fe17', (r) => {console.log(r);resolve(r)}, reject)
    }))
    context.commit('set_ble_device_param', {id: device.id, key: 'wifi_ip', value: wifi_ip,})
    ble.startNotification(device.id, '00ff', '8ca36981-9c55-74a5-5415-e16bc1c3fe17', (wifi_ip) => {
      context.commit('set_ble_device_param', {id: device.id, key: 'wifi_ip', value: new TextDecoder('utf-8').decode(wifi_ip),})
    })
  } catch(e) {
    console.log(e)
  }
}

const has_mobile_zeroconf = function() {
  console.log(window, window.cordova)
  return !!window.cordova && !!window.cordova.plugins && !!window.cordova.plugins.zeroconf
}

const has_ble = function() {
  return !!window.ble
}

const is_ble_enabled = function() {
  const { ble } = window 
  return new Promise((resolve, reject) => {
    ble.isEnabled(() => resolve(true), () => resolve(false))
  })
}

const is_ip = (url) => {
  return url.match(/\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/)
}

let init_done = false
export const actions = {
  async init(context) {
    if (init_done == false) {
      context.commit('init', await stored())
      for (let i in context.state.controllers) {
        start_controller_daemon(context, context.state.controllers[i])
      }
      init_done = true
    }
  },
  async init_cordova(context) {
    context.commit('cordova_caps', {has_ble: has_ble(), has_mobile_zeroconf: has_mobile_zeroconf()})
    if (has_ble()) {
      const { ble } = window 
      context.commit('ble_enabled', await is_ble_enabled())
    }
  },
  async start_ble_scan(context) {
    if (!has_ble()) {
      return
    }

    const { ble } = window 
    if (!await is_ble_enabled()) {
      try {
        await new Promise((resolve, reject) => ble.enable(resolve, reject))
        context.commit('ble_enabled', true)
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
            if (device.name == '🤖🍁' && !getBleById(context.state, device.id)) {
              ble_device(context, device)
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
  async search_new_controller(context) {
    const discovery_url = context.state.new_controller_url
    let url = context.state.new_controller_url
    context.commit('start_search_new_controller')

    if (!is_ip(url) && context.state.has_mobile_zeroconf) {
      url = await zeroconf_discovery(url)
    } else {
      if ((url = await wait_for_controller(url, () => context.commit('search_try'))) == false) {
        context.commit('end_search_new_controller', {controller: null, error: 'No controller found'})
        return
      }
    }

    const { data: config } = await discovery_chain(async () => axios.get(`http://${url}/fs/config.json`, {timeout: 5000})),
          controller_defaults = controller_from_config(config)

    const { data: name } = await discovery_chain(async () => axios.get(`http://${url}/s?k=DEVICE_NAME`, {timeout: 5000}))
    let controller = Object.assign({}, controller_defaults, {
      discovery_url,
      device_name: Object.assign({}, controller_defaults.device_name, {value: name, loaded: true}),
    })
    context.commit('found_new_controller', {controller})
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
    start_controller_daemon(context, controller)
  },
  async search_controller(context, { id, ip }) {
    context.commit('set_found_try', {id, n: 1})
    const controller = getById(context.state, id),
          url = controller.mdns_domain.value
    let found_by_ip = false
    const addr = ip || controller.wifi_ip.value
    if (addr) {
      console.log('searching by ip', ip)
      try {
        await controller_chain(id)(() => axios.get(`http://${addr}/s?k=MDNS_DOMAIN`, {timeout: 5000}), (e, n) => context.commit('set_found_try', {id, n}))
        if (ip) {
          context.commit('loaded_controller_param', {id, key: 'wifi_ip', value: addr})
        }
        context.commit('set_found', id)
        return
      } catch(e) {
        console.log(e)
        context.commit('set_notfound', id)
      }
    }
    console.log('IP not found, trying zeroconf')
    try {
      if (context.state.has_mobile_zeroconf) {
        const ip = await zeroconf_discovery(url)
        context.commit('loaded_controller_param', {id, key: 'wifi_ip', value: ip})
      } else {
        const { data: ip } = await controller_chain(id)(() => axios.get(`http://${url}.local/s?k=WIFI_IP`, {timeout: 5000}), (e, n) => context.commit('set_found_try', {id, n}))
        context.commit('loaded_controller_param', {id, key: 'wifi_ip', value: ip})
      }
      context.commit('set_found', id)
    } catch(e) {
      console.log('Zeroconf failed', e)
      context.commit('set_notfound', id)
      throw (e)
      return
    }
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
      throw(e)
    }
  },
  async load_box_param(context, { id, i, key }) {
    const controller = getById(context.state, id),
          config = controller.boxes[i][key].config_key
    context.commit('loading_box_param', {id, i, key})
    try {
      let { data: value } = await controller_chain(id)(async () => axios.get(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=BOX_${i}_${key.toUpperCase()}`, {timeout: 5000}))
      if (key.indexOf('hour') !== -1) {
        value = (value - new Date().getTimezoneOffset()/60) % 24
        value = value < 0 ? value + 24 : value
      }
      context.commit('loaded_box_param', {id, i, key, value: config.integer ? parseInt(value) : value})
    } catch(e) {
      context.commit('loaded_box_param', {id, i, key, error: e})
      throw(e)
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
      throw(e)
    }
  },
  async load_i2c_param(context, { id, i, key }) {
    let controller = getById(context.state, id),
      config = controller.i2c[i][key].config_key
    context.commit('loading_i2c_param', {id, i, key})
    try {
      const { data: value } = await controller_chain(id)(async () => axios.get(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=I2C_${i}_${key.toUpperCase()}`, {timeout: 5000}))
      context.commit('loaded_i2c_param', {id, i, key, value: config.integer ? parseInt(value) : value})
    } catch(e) {
      context.commit('loaded_i2c_param', {id, i, key, error: e})
      throw(e)
    }
  },
  async set_controller_param(context, { id, key, value, n, }) {
    const controller = getById(context.state, id),
          config = controller[key].config_key
    context.commit('loading_controller_param', {id, key})
    try {
      await controller_chain(id, n || 3)(async () => await axios.post(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=${key.toUpperCase()}&v=${value}`, '', {timeout: 5000}))
      await context.dispatch('load_controller_param', {id, key})
    } catch(e) {
      context.commit('loaded_controller_param', {id, key, error: e})
      throw(e)
    }
  },
  async set_box_param(context, { id, i, key, value }) {
    const controller = getById(context.state, id),
          config = controller.boxes[i][key].config_key
    context.commit('loading_box_param', {id, i, key})
    try {
      if (key.indexOf('hour') !== -1) {
        value = (value + new Date().getTimezoneOffset()/60) % 24
        value = value < 0 ? value + 24 : value
      }

      await controller_chain(id)(async () => await axios.post(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=BOX_${i}_${key.toUpperCase()}&v=${value}`, '', {timeout: 5000}))
      await context.dispatch('load_box_param', {id, i, key})
    } catch(e) {
      context.commit('loaded_box_param', {id, i, key, error: e})
      throw(e)
    }
  },
  async set_led_param(context, { id, i, key, value }) {
    const controller = getById(context.state, id),
          config = controller.leds[i][key].config_key
    context.commit('loading_led_param', {id, i, key})
    try {
      await controller_chain(id)(async () => await axios.post(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=LED_${i}_${key.toUpperCase()}&v=${value}`, '', {timeout: 5000}))
      await context.dispatch('load_led_param', {id, i, key})
    } catch(e) {
      context.commit('loaded_led_param', {id, i, key, error: e})
      throw(e)
    }
  },
  async set_i2c_param(context, { id, i, key }) {
    let controller = getById(context.state, id),
        config = controller.i2c[i][key].config_key
    context.commit('loading_i2c_param', id, i, key)
    try {
      await controller_chain(id)(async () => await axios.post(`http://${controller.wifi_ip.value}/${config.integer ? 'i' : 's'}?k=I2C_${i}_${key.toUpperCase()}&v=${value}`, '', {timeout: 5000}))
      await context.dispatch('load_i2c_param', {id, i, key})
    } catch(e) {
      context.commit('loaded_i2c_param', {id, i, key, error: e})
      throw(e)
    }
  },
}
