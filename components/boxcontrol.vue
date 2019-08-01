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
    <b>Control</b>
    <div :id='$style.control'>
      <div :id='$style.boxonoff'>
        Off
        <div :class='`${$style.onoff} ${(box.enabled.value ? $style.on : $style.off)}`' v-on:click='switchOff()'></div>
        On
        <Loading v-if='box.enabled.loading' />
      </div>
      <div :id='$style.leds'>
        <div v-for='(led, j) in controller.leds' v-if='led.box.value == i' :key='controller.broker_clientid.value + j' :class='$style.led'>
          <LedControl :i='i' :box='box' :controller='controller' :j='j' :led='led' />
        </div>
      </div>
      <div :id='$style.blower'>
        <img src='~/assets/img/vent-small.svg' />
        <div :id='$style.sliderw'><Slider v-model='blower' /></div>
        <img src='~/assets/img/vent-big.svg' />
        <Loading v-if='box.blower.loading' />
      </div>
    </div>
  </section>
</template>

<script>
import LedControl from '~/components/ledcontrol'
import Slider from '~/components/slider'
import Loading from '~/components/loading'

export default {
  components: { LedControl, Slider, Loading, },
  props: [ 'i', 'box', 'controller', ],
  computed: {
    blower: {
      get() {
        return this.$props.box.blower.value
      },
      set(value) {
       const { 
          i, box, controller,
        } = this.$props
        this.$store.dispatch('controllers/set_box_param', {id: controller.broker_clientid.value, i, key: 'blower', value: Math.round(value)}) 
      },
    },
  },
  methods: {
    switchOff() {
       const { 
          i, box, controller,
        } = this.$props
        this.$store.dispatch('controllers/set_box_param', {id: controller.broker_clientid.value, i, key: 'timer_type', value: 0}) 
        this.$store.dispatch('controllers/set_box_param', {id: controller.broker_clientid.value, i, key: 'enabled', value: 0}) 
    },
  },
}
</script>

<style module lang=stylus>

#container
  display: flex
  flex-direction: column
  border-radius: 2pt
  z-index: 10

#control
  background-color: #fcfcfc
  border: 1px solid #ebebeb
  margin: 10pt

#boxonoff
  position: relative
  display: flex
  align-items: center
  justify-content: center

#leds
  flex: 1
  flex-wrap: wrap
  display: flex
  background-color: #f6f6f6
  padding: 20pt 15pt

.led
  flex: 50%
  display: flex
  align-items: center
  justify-content: center

.onoff
  display: inline-block
  width: 40pt
  height: 20pt
  margin: 10pt 20pt
  background-repeat: no-repeat
  background-size: contain
  background-position: center
  cursor: pointer

.on
  background-image: url('~assets/img/on.svg')

.off
  background-image: url('~assets/img/off.svg')

#blower
  display: flex
  position: relative
  padding: 5pt 30pt
  align-items: center
  justify-content: center

#sliderw
  flex: 1
  display: inline-block
  margin: 2pt 10pt
  height: 20pt

</style>
