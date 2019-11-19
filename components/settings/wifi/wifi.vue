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
      <Loading width='150pt' v-else-if='page == "SET_WIFI"' label='Settings wifi credentials' />
      <Loading width='150pt' v-else-if='page == "SEARCHING"' label='Searching' />
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
import WifiFailed from '~/components/settings/wifi/wifi-failed.vue'
import WifiSuccess from '~/components/settings/wifi/wifi-success.vue'
import Loading from '~/components/common/loading.vue'

export default {
  components: {Title, WifiForm, WifiFailed, WifiSuccess, Loading,},
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
  },
  methods: {
    async connect() {
      const controller = this.controller
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
        await this.$store.dispatch('controllers/setControllerParam', {id: controller.broker_clientid.value, key: 'wifi_password', value: this.$data.password, n: 1}) 
      } catch (e) {
        console.log(e)
      }
      this.$data.page = 'WAIT_WIFI_SWITCH'
      setTimeout(() => {
        this.search()
      }, 10000)
    },
    async search() {
      const controller = this.controller
      let ip = ''
      this.$data.page = 'SEARCHING'
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
