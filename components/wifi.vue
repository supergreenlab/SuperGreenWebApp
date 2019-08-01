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
    <div v-if='failed' :id='$style.failed'>
      <div>
        Looks like we couldn't find the controller, try rebooting it an click "RETRY SEARCH", if it still fails, retry the credentials.</br>
        If it still fails, reach up with @stant on <a href='https://discord.gg/V5bxAU' target='_blank'>discord</a>.
      </div>
      <div :id='$style.failedbuttons'>
        <a href='javascript:void(0)' :class='`${$style.button} ${!this.valid ? $style.invalid : ""}`' @click='retype'>RETYPE CREDENTIALS</a>
        <a href='javascript:void(0)' :class='`${$style.button} ${!this.valid ? $style.invalid : ""}`' @click='connect'>RETRY SEARCH</a>
      </div>
    </div>
    <div v-else :id='$style.form'>
      Current mode: <b>{{ controller.wifi_status.value == 3 ? 'connected to your home wifi' : 'not connected to home wifi' }}</b>
      <div :id='$style.fields'>
        <div :class='`${$style.input} ${$style.large}`'>
          <Input label='SSID' name='ssid' v-model='ssid' />
        </div>
        <div :class='`${$style.input} ${$style.large}`'>
          <Input label='password' name='password' type='password' v-model='password' />
        </div>
        <div :class='$style.input'>
          <a href='javascript:void(0)' :class='`${$style.button} ${!this.valid ? $style.invalid : ""}`' @click='connect'>CONNECT</a>
        </div>
        <Loading v-if='loading' label='settings wifi credentials' />
        <Loading v-else-if='searching' label='loading wifi config' />
      </div>
    </div>
  </section>
</template>

<script>
import Title from '~/components/settings-title.vue'
import Input from '~/components/settings-input.vue'
import Loading from '~/components/loading.vue'

export default {
  components: {Title, Input, Loading,},
  data() {
    return {
      ssid: '',
      password: '',
      loading: false,
      failed: false,
      searching: false,
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
    valid() {
      return this.$data.ssid && this.$data.password
    },
  },
  methods: {
    async connect() {
      if (!this.valid) return
      this.$data.loading = true
      const controller = this.controller
      await this.$store.dispatch('controllers/set_controller_param', {id: controller.broker_clientid.value, key: 'wifi_ssid', value: this.$data.ssid}) 
      try {
        await new Promise((r) => setTimeout(r, 1000))
        await this.$store.dispatch('controllers/set_controller_param', {id: controller.broker_clientid.value, key: 'wifi_password', value: this.$data.password, n: 1}) 
      } catch (e) {
        console.log(e)
        this.$data.failed = true
        return
      }
      this.$data.searching = true
      try {
        await this.$store.dispatch('controllers/search_controller', {id: controller.broker_clientid.value, ip: this.isvalid ? this.$data.addr : ''})
      } catch(e) {
        console.log(e)
        this.$data.failed = true
      }
      this.$data.searching = false
      this.$data.loading = false
    },
    retype() {
      this.$data.failed = false
      this.$data.searching = false
      this.$data.loading = false
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
    padding: 0 10pt

#failed
  display: flex
  flex-direction: column

#form
  color: #717171
  padding: 10pt 25pt

#fields
  display: flex
  position: relative
  align-items: flex-end
  margin: 10pt 0
  @media screen and (max-width: 600px)
    align-items: flex-start
    flex-direction: column
    font-size: 0.7em

.button
  display: flex
  align-items: center
  justify-content: center
  padding: 0 25pt
  background-color: #3BB30B
  height: 23pt
  color: white
  text-decoration: none
  border-radius: 3pt
  @media screen and (max-width: 600px)
    margin: 10pt 0

.button:hover
  background-color: #4BC30B

.button:active
  background-color: #2BA30B

.invalid
  opacity: 0.5
  
.input
  margin: 0 10pt
  @media screen and (max-width: 600px)
    margin: 10pt 0
    width: 100%

.large
  flex: 1

#failedbuttons
  display: flex
  flex-direction: column
  align-items: center

#failedbuttons > .button
  width: 200pt
  margin-top: 10pt

</style>
