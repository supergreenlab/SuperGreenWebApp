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
    <b>{{ j + 1 }}</b>
    <div :id='$style.box'>
      <div :id='$style.onoff' :class='led.dim.value > 75 ? $style.on : (led.dim.value > 25 ? $style.mid : $style.off)' @click='toggleOnOff'></div>
      <b>{{ led.dim.value }}%</b>
    </div>
    <div :id='$style.slider'>
      <Slider v-model='dim' />
    </div>
    <Loading v-if='loading' />
  </section>
</template>

<script>
import Slider from '~/components/slider'
import Loading from '~/components/loading'

export default {
  components: { Slider, Loading, },
  props: [ 'j', 'led' ],
  computed: {
    loading() {
      const { led } = this.$props
      return led.enabled.loading || led.dim.loading || led.box.loading
    },
    dim: {
      get() {
        return this.$props.led.dim.value
      },
      set(value) {
        const { 
          i, box, controller, j, led
        } = this.$props
        this.$store.dispatch('controllers/set_led_param', {id: controller.broker_clientid.value, i: j, key: 'dim', value: Math.round(value)}) 
      },
    },
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
  },
  methods: {
    toggleOnOff() {
      const { 
        j, led
      } = this.$props,
        controller = this.controller
      this.$store.dispatch('controllers/set_led_param', {id: controller.broker_clientid.value, i: j, key: 'dim', value: led.dim.value == 0 ? 100 : 0}) 
    },
  },
  mounted() {
    const { 
      j, led
    } = this.$props,
        controller = this.controller
    this.$store.dispatch('controllers/load_led_param', {id: controller.broker_clientid.value, i: j, key: 'enabled'})
    this.$store.dispatch('controllers/load_led_param', {id: controller.broker_clientid.value, i: j, key: 'dim'})
    this.$store.dispatch('controllers/load_led_param', {id: controller.broker_clientid.value, i: j, key: 'box'})
  },
}
</script>

<style module lang=stylus>

#container
  display: flex
  position: relative
  flex-direction: column
  align-items: center
  justify-content: center
  margin: 4pt

#container > b
  align-self: flex-start
  margin-left: 2pt
  margin-bottom: -6pt
  z-index: 2
  text-shadow: -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 2px 2px 0 #fff

#box
  display: flex
  flex-direction: column
  background-color: white
  border: 1px solid #ebebeb
  border-radius: 3pt
  color: #8b8b8b
  align-items: center
  justify-content: center
  width: 45pt
  height: 45pt

#onoff
  width: 25pt
  height: 25pt
  align-self: flex-end 
  margin: 2pt
  background-repeat: no-repeat
  background-size: contain
  background-position: center
  cursor: pointer

.on
  background-image: url('~assets/img/lighton.svg')

.mid
  background-image: url('~assets/img/lightmid.svg')

.off
  background-image: url('~assets/img/lightoff.svg')

#slider
  width: 100%

</style>
