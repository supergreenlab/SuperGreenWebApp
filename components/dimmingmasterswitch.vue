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
  <BoxSubSection 
  icon='subsection-dimming-master.svg'
  title='Master switch'
  :value='`${average}%`'
  :height='expanded ? `${contentHeight}px` : "0"'>
    <div :id='$style.body' ref='content' :class='!expanded ? $style.hidden : ""'>
      <small :id='$style.masterhint'>Dims all leds +25% or -25% at once.</small>
      <div :id='$style.masterbody'>
        <div :class='$style.masterbuttons' :id='$style.plus' @click='masterplus'></div>
        <div :id='$style.separator'></div>
        <div :class='$style.masterbuttons' :id='$style.minus' @click='masterminus'></div>
        <Loading v-if='loading' width='50pt' height='30pt' />
      </div>
    </div>
  </BoxSubSection>
</template>

<script>

import BoxSubSection from '~/components/boxsubsection'
import Loading from '~/components/loading'

export default {
  components: {BoxSubSection, Loading, },
  data() {
    return {
      contentHeight: 0,
    }
  },
  props: ['expanded', 'loading', 'controller', ],
  mounted() {
    this.$data.contentHeight = this.$refs.content.clientHeight + 25
  },
  computed: {
    average() {
      const controller = this.controller,
            boxid = this.$route.params.box
      let avg = 0, n = 0
      for (let i in controller.leds) {
        const l = controller.leds[i]
        if (l.box.value != boxid) continue
        avg += l.dim.value
        ++n
      }
      return Math.floor(avg / n)
    },
  },
  methods: {
    master(v) {
      const controller = this.controller,
            boxid = this.$route.params.box
      for (let i in controller.leds) {
        const l = controller.leds[i]
        if (l.box.value != boxid) continue
        const value = controller.leds[i].dim.value + v
        this.$store.dispatch('controllers/set_led_param', {id: controller.broker_clientid.value, i, key: 'dim', value: Math.round(value)}) 
      }
    },
    masterplus() {
      this.master(25)
    },
    masterminus() {
      this.master(-25)
    },
  },
}
</script>

<style module lang=stylus>
#masterbody
  display: flex
  align-items: center
  justify-content: center

#masterhint
  align-self: flex-start
  color: #777777
  margin: 0 0 10pt 0

.masterbuttons
  width: 50pt
  height: 50pt
  background-position: center
  background-size: contain
  background-repeat: no-repeat
  cursor: pointer
  border: 1px solid #ebebeb
  border-radius: 3pt
  margin: 20pt 0pt

.masterbuttons:hover
  opacity: 0.8

.masterbuttons:active
  opacity: 0.5

#plus
  background-image: url('~assets/img/button-light-dimming-master-plus.svg')

#separator
  width: 1pt
  height: 40pt
  background-color: #C4C4C4
  margin: 10pt 10pt 10pt 10pt

#minus
  background-image: url('~assets/img/button-light-dimming-master-minus.svg')

#body
  transition: opacity 0.5s

.hidden
  opacity: 0

</style>
