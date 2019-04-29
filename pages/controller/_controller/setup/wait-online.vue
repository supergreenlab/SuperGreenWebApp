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
    <h1>Connect your computer back to the wifi network</h1>
    <small v-if='!(started && !loading && !failed)'>Check that the <div :id='$style.ssid'></div> is not back, if you can still connect to it, it means wifi configuration failed. If it is back on, please connect to it, and <a href='javascript:void(0)' v-on:click='goBack'>go back to previous step</a>. (macosx might still show it for some time, check that it fails to connect befor going back)</small>
    <section :id='$style.body'>
      <a v-if='!started' href='javascript:void(0)' v-on:click='waitOnline'>I switched wifi, and the box stopped it's wifi. Search it !</a>
      <Loading v-if='loading' :label='`Searching controller.. ${controller.found_try}/3`' />
      <a v-if='started && !loading && failed' href='javascript:void(0)' v-on:click='waitOnline'>Oups, did you try turning it off and back on again ? then click here to retry.</a>
      <div v-if='started && !loading && !failed'>
        <h3>Now we're talking:)</h3>
        <small>Click the Go! button on the bottom right</small>
      </div>
    </section>
    <section v-if='started && !loading && !failed' :id='$style.nav'>
      <NextButton label='Go !' to='/' />
    </section>
  </section>
</template>

<script>
import CloseButton from '~/components/closebutton'
import NextButton from '~/components/nextbutton'
import Loading from '~/components/loading'

export default {
  data() {
    return {
      started: false,
      loading: false,
      failed: false,
    }
  },
  components: { CloseButton, NextButton, Loading, },
  computed: {
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
        await this.$store.dispatch('controllers/search_controller', {id: controller.broker_clientid.value})
      } catch(e) {
        console.log(e)
        this.$data.failed = true
      }
      this.$data.loading = false
    },
    goBack() {
      this.$router.back()
    },
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
  align-items: center
  justify-content: center

#body > img
  margin: 10pt

#container > small
  text-align: center
  color: #e84a4a
  padding: 10pt 50pt

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

</style>
