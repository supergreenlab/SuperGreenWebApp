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
      <WifiEnableBle v-else-if='page == "ENABLE_BLE"' />
      <Loading v-else-if='page == "WAIT_BLE"' label='Waiting for bluetooth device' />
      <Loading v-else-if='page == "SET_WIFI"' label='Settings wifi credentials' />
      <Loading v-else-if='page == "SEARCHING"' label='Loading wifi config' />
      <WifiFailed v-else-if='page == "FAILED"' :retype='retype' :connect='connect'  />
      <WifiSuccess v-else-if='page == "SUCCESS"' :retype='retype' />
    </div>
  </section>
</template>

<script>
import Title from '~/components/settings-title.vue'
import WifiForm from '~/components/wifi-form.vue'
import WifiEnableBle from '~/components/wifi-enable-ble.vue'
import WifiFailed from '~/components/wifi-failed.vue'
import WifiSuccess from '~/components/wifi-success.vue'
import Loading from '~/components/loading.vue'

export default {
  components: {Title, WifiForm, WifiEnableBle, WifiFailed, WifiSuccess, Loading,},
  data() {
    return {
      ssid: '',
      password: '',
      page: 'FORM',
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
      return this.$store.getters['controllers/getBLEControllers'](this.controller.wifi_ip.value)
    }
  },
  methods: {
    async connect() {
      if (this.$store.state.controllers.has_ble && !this.$store.state.controllers.ble_enabled) {
        this.$data.page = 'ENABLE_BLE'
        return
      } else if (this.bleDevices.length) {
        this.$data.page = 'WAIT_BLE'
        return
      } else {
        this.$data.page = 'SET_WIFI'
        const controller = this.controller
        await this.$store.dispatch('controllers/set_controller_param', {id: controller.broker_clientid.value, key: 'wifi_ssid', value: this.$data.ssid}) 
        try {
          await new Promise((r) => setTimeout(r, 1000))
          await this.$store.dispatch('controllers/set_controller_param', {id: controller.broker_clientid.value, key: 'wifi_password', value: this.$data.password, n: 1}) 
        } catch (e) {
          console.log(e)
        }
        this.search()
        return
      }
    },
    async search() {
      const controller = this.controller
      this.$data.page = 'SEARCH'
      try {
        await this.$store.dispatch('controllers/search_controller', {id: controller.broker_clientid.value, ip: ''})
        this.$data.page = 'SUCCESS'
      } catch(e) {
        console.log(e)
        this.$data.page = 'FAILED'
      }
    },
    retype() {
      this.$data.page = 'FORM'
    }
  },
  watch: {
    bleDevices: {
      handler() {
        if (this.$data.page == 'WAIT_BLE') {
          controle.log(this.bleDevices)
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
    padding: 0 10pt

#body
  position: relative
  min-height: 50pt

#failed
  display: flex
  flex-direction: column

.large
  flex: 1

</style>
