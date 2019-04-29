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
  <section v-if='controller' :id='$style.container'>
    <section :id='$style.top'>
      <CloseButton />
    </section>
    <h1>New box detected.</h1>
    <h3>Connect it</h3>
    <section :id='$style.body'>
      <img src='~/assets/img/wifi-robot-icon.png' />
      <h2>Wifi configuration:</h2>
      <small>Has to be connected at least once for a fresh upgrade !</small>
      <input type='text' v-model='ssid' placeholder='Enter SSID' />
      <input type='text' v-model='password' placeholder='Enter wpa-passkey' />
    </section>
    <section :id='$style.nav'>
      <NextButton  :onClick='saveWifi' label='Connect wifi' />
    </section>
    <Loading v-if='loading' label='Setting up wifi..' />
  </section>
</template>

<script>
import CloseButton from '~/components/closebutton'
import NextButton from '~/components/nextbutton'
import Loading from '~/components/loading'

export default {
  data() {
    return {
      ssid: '',
      password: '',
      loading: false
    }
  },
  components: { CloseButton, NextButton, Loading, },
  computed: {
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
  },
  methods: {
    async saveWifi() {
      this.$data.loading = true
      const controller = this.controller
      await this.$store.dispatch('controllers/set_controller_param', {id: controller.broker_clientid.value, key: 'wifi_ssid', value: this.$data.ssid}) 
      try {
        await new Promise((r) => setTimeout(r, 1000))
        await this.$store.dispatch('controllers/set_controller_param', {id: controller.broker_clientid.value, key: 'wifi_password', value: this.$data.password}) 
      } catch (e) {
        console.log(e)
      }
      this.$router.push('/setup/wait-online')
    },
  },
}
</script>

<style module lang=stylus>

#container
  display: flex
  position: relative
  align-items: center
  justify-content: center
  flex: 1
  flex-direction: column
  min-height: 100vh

#top
  display: flex
  justify-content: flex-end
  align-self: flex-end
  margin-bottom: 10pt

#body
  display: flex
  flex-direction: column
  flex: 1
  padding: 20pt
  align-items: center
  justify-content: center

#body > img
  margin: 10pt

#body > small
  color: #e84a4a
  padding: 5pt 0 20pt 0

#body > input
  width: 100%
  margin-bottom: 10pt

#nav
  display: flex
  justify-content: flex-end
  width: 100%

</style>
