<!--
      Copyright (C) 2019  SuperGreenLab <towelie@supergreenlab.com>
      Author: Constantin Clauzel <constantin.clauzel@gmail.com>

      This program is free software: you can redistribute it and/or modify
      it under the terms of the GNU General Public License as published by
      the Free Software Foundation, either version 3 of the License, or
      (at your option) any later version.

      This program is distributed in the hope that it will be useful,
      but WITHOUT ANY WARRANTY; without even the implied warranty of
      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
      GNU General Public License for more details.

      You should have received a copy of the GNU General Public License
      along with this program.  If not, see <http://www.gnu.org/licenses/>.
 -->

<template>
  <section :id='$style.container'>
    <Title title='WIFI CONFIG' icon='wifi-black.svg' />
    <div :id='$style.body'>
      <WifiForm v-if='page == "FORM"' :ssid.sync='ssid' :password.sync='password' :connect='connect' />
      <WifiEnableBle v-else-if='page == "ENABLE_BLE"' :connect='connect' />
      <Loading width='150pt' height='50pt' v-else-if='page == "WAIT_BLE"' label='Waiting for bluetooth device' />
      <Loading width='150pt' v-else-if='page == "SET_WIFI"' label='Settings wifi credentials' />
      <Loading width='150pt' v-else-if='page == "SEARCHING"' label='Searching' />
      <Loading width='150pt' v-else-if='page == "WAIT_BLE_WIFI_STATUS"' label='Detecting config change' />
      <Loading width='150pt' v-else-if='page == "WAIT_BLE_WIFI_STATUS_BACK_ON"' label='Change detected' />
      <Loading width='150pt' v-else-if='page == "WAIT_WIFI_SWITCH"' label='Waiting 10s for you mobile to go back to its wifi' />
      <WifiFailed v-else-if='page == "PARAM_FAILED"' :retype='retype' :connect='retype'  />
      <WifiFailed v-else-if='page == "FAILED"' :retype='retype' :connect='search'  />
      <WifiSuccess v-else-if='page == "SUCCESS"' :retype='retype' />
    </div>
  </section>
</template>

<script>
import Title from '~/components/settings/common/settings-title.vue'
import WifiForm from '~/components/settings/wifi/wifi-form.vue'
import WifiEnableBle from '~/components/settings/wifi/wifi-enable-ble.vue'
import WifiFailed from '~/components/settings/wifi/wifi-failed.vue'
import WifiSuccess from '~/components/settings/wifi/wifi-success.vue'
import Loading from '~/components/common/loading.vue'

export default {
  components: {Title, WifiForm, WifiEnableBle, WifiFailed, WifiSuccess, Loading,},
  data() {
    return {
      ssid: '',
      password: '',
      page: 'FORM',
      bleId: '',
      blePrompted: false
    }
  },
  mounted() {
    this.$data.ssid = this.controller.wifi_ssid.value
    this.$data.password = this.controller.wifi_password.value
  },
  computed: {
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
    bleDevices() {
      return this.$store.getters['ble/getControllers'](this.controller.wifi_ip.value)
    },
    bleController() {
      return this.$store.getters['ble/getControllerById'](this.$data.bleId)
    }
  },
  methods: {
    async connect() {
      const controller = this.controller
      console.log('this.$store.state.ble.available', this.$store.state.ble.available, 'this.$store.state.ble.enabled', this.$store.state.ble.enabled)
      if (this.$store.state.ble.available && !this.$store.state.ble.enabled && !this.bleDevices.length && !this.$data.blePrompted) {
        this.$data.page = 'ENABLE_BLE'
        this.$data.blePrompted = true
      } else if (this.$store.state.ble.available && this.$store.state.ble.enabled && !this.bleDevices.length) {
        try {
          await this.$store.dispatch('controllers/setControllerParam', {id: controller.broker_clientid.value, key: 'ble_enabled', value: 1}) 
        } catch(e) {
          console.log('set_ble_enabled', e)
        }
        this.$store.dispatch('ble/startBleScan')
        this.$data.page = 'WAIT_BLE'
        return
      } else {
        let wait_ble = false
        if (this.$store.state.ble.available && this.$store.state.ble.enabled && this.bleDevices.length) {
          console.log('using ble device')
          this.$data.bleId = this.bleDevices[0].id
          wait_ble = true
        }
        this.$data.page = 'SET_WIFI'
        try {
          await this.$store.dispatch('controllers/setControllerParam', {id: controller.broker_clientid.value, key: 'wifi_ssid', value: this.$data.ssid}) 
        } catch(e) {
          this.$data.page = 'PARAM_FAILED'
          console.log('set_wifi_ssid', e)
          return
        }
        try {
          await new Promise((r) => setTimeout(r, 1000))
          if (wait_ble) {
            this.$data.page = 'WAIT_BLE_WIFI_STATUS'
          }
          await this.$store.dispatch('controllers/setControllerParam', {id: controller.broker_clientid.value, key: 'wifi_password', value: this.$data.password, n: 1}) 
        } catch (e) {
          console.log(e)
        }
        if (!wait_ble) {
          this.search()
        }
        return
      }
    },
    async search() {
      const controller = this.controller
      let ip = ''
      this.$data.page = 'SEARCHING'
      console.log('search', this.bleController)
      if (this.bleController) {
        console.log('using ble device')
        ip = this.bleController.params.wifi_ip
        try {
          await this.$store.dispatch('controllers/setControllerParam', {id: controller.broker_clientid.value, key: 'ble_enabled', value: 1}) 
        } catch(e) {
          console.log('set_ble_enabled', e)
        }
      }
      try {
        await this.$store.dispatch('controllers/searchController', {id: controller.broker_clientid.value, ip})
        this.$data.page = 'SUCCESS'
      } catch(e) {
        console.log(e)
        this.$data.page = 'FAILED'
      }
      await this.$store.dispatch('controllers/loadControllerParam', {id: controller.broker_clientid.value, key: 'wifi_status'})
    },
    retype() {
      this.$data.page = 'FORM'
    }
  },
  watch: {
    bleDevices: {
      handler() {
        console.log('watch bleDevices')
        if (this.bleDevices.length == 1) {
          const bleDevice = this.bleDevices[0]
          if (this.$data.page == 'WAIT_BLE' && bleDevice.params.wifi_status && bleDevice.params.wifi_ip) {
            
            this.connect()
          }
        }
      },
    },
    bleController: {
      handler() {
        console.log('watch bleController')
        if (this.$data.page == 'WAIT_BLE_WIFI_STATUS') {
          if (this.bleController.params.wifi_status == 2) {
            this.$data.page = 'WAIT_BLE_WIFI_STATUS_BACK_ON'
          }
        } else if (this.$data.page == 'WAIT_BLE_WIFI_STATUS_BACK_ON') {
          if (this.bleController.params.wifi_status == 3) {
            this.$data.page = 'WAIT_WIFI_SWITCH'
            setTimeout(() => {
              this.search()
            }, 10000)
          } else if (this.bleController.params.wifi_status == 4 && this.bleController.params.wifi_status == 5) {
            this.$data.page = 'FAILED'
          }
        }
      },
    },
  },
}
</script>

<style module lang=stylus>

#container
  display: flex
  flex-direction: column
  padding: 0 10pt
  @media screen and (max-width: 600px)
    width: 100vw

#body
  position: relative
  min-height: 50pt
  padding: 15pt 0

#failed
  display: flex
  flex-direction: column

.large
  flex: 1

</style>
