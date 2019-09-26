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
    <section :id='$style.menu'>
      <h1 :id='$style.title'>Settings {{ controller.device_name.value }}</h1>
      <nuxt-link :id='$style.close' :to='`/controller/${controller.broker_clientid.value}/0`'></nuxt-link>
    </section>
    <Wifi />
    <Leds />
    <Motors v-if='controller.motors && controller.motors.length' />
    <Blowers v-else />
    <ConfigUploader />
    <Advanced />
  </section>
</template>

<script>
import Wifi from '~/components/wifi.vue'
import Leds from '~/components/leds.vue'
import Motors from '~/components/motors.vue'
import Blowers from '~/components/blowers.vue'
import Advanced from '~/components/advanced.vue'
import ConfigUploader from '~/components/configuploader.vue'
import Timer from '~/components/timer.vue'

export default {
  components: {Wifi, Leds, Motors, Blowers, ConfigUploader, Advanced, Timer,},
  computed: {
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
  }
}
</script>

<style module lang=stylus>

#container
  display: flex
  position: relative
  flex-direction: column
  width: 100%
  max-width: 700pt
  background-color: white
  @media screen and (max-width: 600px)
    padding-top: 60pt

#menu
  display: flex
  align-items: center
  padding-right: 10pt
  z-index: 1000
  background-color: white
  @media screen and (max-width: 600px)
    font-size: 0.7em
    top: 0
    left: 0
    width: 100vw
    position: fixed
    padding-top: 15pt

#title
  flex: 1
  margin-left: 20pt
  color: #717171

#close
  display: block
  justify-self: flex-end
  width: 19pt
  height: 19pt
  margin: 5pt
  background-image: url('~assets/img/close-black.svg')
  background-position: center
  background-size: contain
  background-repeat: no-repeat
  cursor: pointer
  z-index: 1001

</style>
