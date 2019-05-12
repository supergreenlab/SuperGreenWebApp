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
    <h3>Give it a name:</h3>
    <section :id='$style.body'>
      <h2>Hi <img src='~/assets/img/robot.png' /> ! My name is:</h2>
      <small>We’ll need that to find it once it’s on your wifi network.</small>
      <input type='text' v-model='name' placeholder='Ex: officebox, Daryl... whatnot' @keydown='enter' />
    </section>
    <section :id='$style.nav'>
      <NextButton :onClick='saveName' label='Save name' />
    </section>
    <Loading v-if='loading' label='Setting name..' width='115pt' height='80pt' />
  </section>
</template>

<script>
import CloseButton from '~/components/closebutton'
import NextButton from '~/components/nextbutton'
import Loading from '~/components/loading'

export default {
  data() {
    return {
      name: this.$store.getters['controllers/getSelected'].device_name.value,
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
    async saveName() {
      this.$data.loading = true
      const controller = this.controller,
            mdns_domain = this.$data.name.toLowerCase().replace(/([^A-Za-z0-9.-])+/g, '-')
      await this.$store.dispatch('controllers/set_controller_param', {id: controller.broker_clientid.value, key: 'device_name', value: this.$data.name}) 
      await this.$store.dispatch('controllers/set_controller_param', {id: controller.broker_clientid.value, key: 'mdns_domain', value: mdns_domain}) 
      this.$router.push(`/controller/${controller.broker_clientid.value}/0`)
    },
    enter(e) {
      if (e.key == 'Enter') {
        this.saveName()
      }
    }
  },
}
</script>

<style module lang=stylus>

#container
  display: flex
  position: relative
  align-items: center
  flex: 1
  flex-direction: column
  min-height: 100vh
  background-color: white

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

#body > small
  color: #3bb30b
  padding: 5pt 0 20pt 0

#body > input
  width: 100%

#nav
  display: flex
  justify-content: flex-end
  width: 100%

</style>
