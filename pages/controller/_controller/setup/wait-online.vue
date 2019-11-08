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
    <section v-if='!loading && !failed' :id='$style.top'>
      <CloseButton />
    </section>
    <h1 :id='$style.title'>Search for the controller on home wifi.</h1>
    <section :id='$style.body'>
      <div v-if='!started' :id='$style.first_step'>
        <div>
          <h1>1</h1>
          <div>
            Make sure the controller <b>stopped it's wifi</b>, if not, press the <b>Wifi reconfig</b> button below.
          </div>
          <button :id='$style.button' :class='$style.cancel' @click='goBack'>Wifi reconfig</button>
        </div>
        <div>
          <h1>2</h1>
          <div>
            If it did, you can connect back to <b>your home wifi</b><br />
          </div>
          <button :id='$style.button' @click='waitOnline'>Search</button>
        </div>
      </div>
      <div v-if='loading'>
        <Loading :label='`Searching controller.. ${controller.found_try}/3`' width='115pt' height='80pt' />
      </div>
      <div v-if='started && !loading && failed && !try_ip' :id='$style.failed_step'>
        <p>
          <b>Controller not found</b><br />
          - Try turning it <b>on and off again</b><br />
          - Make sure the controller's wifi is <b>not back on</b>, if it is, press the <b>Wifi reconfig</b> button below.<br />
          - You can also directly enter the IP address<br/>
        </p>
        <div>
          <button :id='$style.button' :class='$style.cancel' @click='goBack'>Wifi reconfig</button>
          <button :id='$style.button' @click='waitOnline'>Retry</button>
          <button :id='$style.button' @click='toggleIPForm'>Try with IP</button>
        </div>
      </div>
      <div v-if='started && !loading && failed && try_ip' :id='$style.failed_step'>
        <p>
          <b>Controller not found</b><br />
          - Enter the IP address below<br />
          - Click <b>Search by IP</b>
        </p>
        <input v-model='addr' type='text' @keydown='enter' placeholder='192.168.x.x' @click='waitOnline' />
        <div>
          <button :id='$style.button' :class='$style.cancel' @click='toggleIPForm'>Cancel</button>
          <button :disabled='!isvalid' :id='$style.button' @click='waitOnline'>Search by IP</button>
        </div>
      </div>
      <div v-if='started && !loading && !failed'>
        <h3>Now we're talking:)</h3>
        <small>Click the Go! button on the bottom right</small>
      </div>
    </section>
    <section v-if='started && !loading && !failed' :id='$style.nav'>
      <NextButton label='Go !' :to='`/controller/${controller.broker_clientid.value}/0`' />
    </section>
  </section>
</template>

<script>
import CloseButton from '~/components/common/closebutton.vue'
import NextButton from '~/components/common/nextbutton.vue'
import Loading from '~/components/common/loading.vue'

export default {
  data() {
    return {
      started: false,
      loading: false,
      failed: false,
      try_ip: false,
      addr: '',
    }
  },
  layout: 'fullscreen',
  components: { CloseButton, NextButton, Loading, },
  computed: {
    isvalid() {
      return /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/.test(this.$data.addr)
    },
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
  },
  methods: {
    async waitOnline() {
      this.$data.started = true
      this.$data.failed = false
      this.$data.loading = true
      const controller = this.$store.getters['controllers/getSelected']
      try {
        await this.$store.dispatch('controllers/search_controller', {id: controller.broker_clientid.value, ip: this.isvalid ? this.$data.addr : ''})
      } catch(e) {
        console.log(e)
        this.$data.failed = true
      }
      this.$data.loading = false
    },
    goBack() {
      this.$router.replace(`/controller/${this.controller.broker_clientid.value}/setup/wifi-sta`)
    },
    enter(e) {
      if (e.key == 'Enter' && this.isvalid) {
        this.waitOnline()
      }
    },
    toggleIPForm() {
      this.$data.try_ip = !this.$data.try_ip
    }
  }
}
</script>

<style module lang=stylus>

#container
  display: flex
  align-items: center
  justify-content: center
  flex: 1
  flex-direction: column
  min-height: 100vh
  background-color: white
  padding: 5pt

#title
  margin: 0
  text-align: center
  font-size: 1em

#top
  display: flex
  justify-content: flex-end
  align-self: flex-end
  margin-bottom: 10pt

#body
  display: flex
  position: relative
  flex-direction: column
  flex: 1
  padding: 20pt
  width: 100%
  height: 200pt

#body > div
  max-width: 300pt

#first_step > small
  text-align: center
  color: #e84a4a

#body > input
  width: 100%
  margin-bottom: 10pt

#nav
  display: flex
  justify-content: flex-end
  width: 100%

#ssid
  display: inline-block
  height: 20pt
  width: 30pt
  background-repeat: no-repeat
  background-size: contain
  background-position: left
  background-image: url('~assets/img/wifi-ssid.png')

#first_step
  display: flex
  flex-direction: column

#failed_step
  display: flex
  align-items: center
  justify-content: center
  flex-direction: column

#failed_step > h2
  margin: 20pt

#failed_step > input
  margin: 10pt

#button
  background-color: #3bb30b
  border: none
  padding: 5pt 20pt
  margin: 10pt
  border-radius: 3pt
  color: white
  cursor: pointer

#button:disabled
  background-color: #c4c4c4
  opacity: 0.7

#button.cancel
  background-color: #c4c4c4

</style>
