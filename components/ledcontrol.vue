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
    <div :id='$style.box'>
      <h2 :id='$style.n'>{{ j + 1 }}</h2>
      <div :id='$style.onoff' :class='led.dim.value > 75 ? $style.on : (led.dim.value > 25 ? $style.mid : $style.off)' @click='toggleOnOff'></div>
      <b :id='$style.value'>{{ led.dim.value }}%</b>
    </div>
    <div :id='$style.slider'>
      <Slider v-model='dim' />
    </div>
    <Loading v-if='loading' width='30pt' height='20pt' />
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
      return led.dim.loading || led.box.loading
    },
    dim: {
      get() {
        return this.$props.led.dim.value
      },
      set(value) {
        const { 
          j, led
        } = this.$props,
          controller = this.controller
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
  width: 100%

#box
  display: flex
  position: relative
  align-items: center
  justify-content: center
  flex-direction: column
  background-color: white
  border: 1px solid #ebebeb
  border-radius: 3pt
  color: #8b8b8b
  width: 100%
  height: 90pt

#n
  align-self: flex-start
  margin-left: 2pt
  margin-bottom: -6pt
  z-index: 2
  text-shadow: -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 2px 2px 0 #fff

#onoff
  width: 50pt
  height: 50pt
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

#disabled
  position: absolute
  display: flex
  align-items: center
  justify-content: center
  width: 100%
  height: 100%
  left: 0
  top: 0
  background-color: rgba(255, 255, 255, 0.8)
  color: #D04949
  z-index: 1000

#value
  font-weight: 600
  font-size: 1.2em

</style>
