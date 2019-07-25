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
    :icon='`subsection-blower-${schedule}.svg`'
    title='Blower power'
    :subtitle='`(when the lights are ${schedule}.)`'
    :value='`${blower}%`'
    :height='expanded ? `${bodyHeight}px` : 0'>
    <div :id='$style.body' ref='body' :class='!expanded ? $style.hidden : ""'>
      <div :id='$style.slider'>
        <span>0%</span><Slider v-model='blower' /><span>100%</span>
      </div>
      <Loading v-if='loading' height='20pt' width='40pt' />
    </div>
  </BoxSubSection>
</template>

<script>

import BoxSubSection from '~/components/boxsubsection'
import Slider from '~/components/slider'
import Loading from '~/components/loading'

export default {
  props: ['schedule', 'param', 'expanded', ],
  data() {
    return {
      bodyHeight: 0,
    }
  },
  mounted() {
    this.$data.bodyHeight = this.$refs.body.clientHeight + 25
  },
  components: { BoxSubSection, Slider, Loading, },
  computed: {
    blower: {
      get() {
        const controller = this.controller,
              boxid = this.$route.params.box,
              { param } = this.$props
        return controller.boxes[boxid][param].value
      },
      set(value) {
        const controller = this.controller,
              boxid = this.$route.params.box,
              { param } = this.$props
        this.$store.dispatch('controllers/set_box_param', {id: controller.broker_clientid.value, i: boxid, key: param, value: Math.round(value)}) 
      },
    },
    loading() {
      const controller = this.controller,
            boxid = this.$route.params.box,
            { param } = this.$props
      return controller.boxes[boxid][param].loading
    },
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
  },
}

</script>

<style module lang=stylus>

#body
  flex: 1
  position: relative
  display: flex
  color: #777777
  font-weight: 400
  transition: opacity 0.5s

.hidden
  opacity: 0

#slider
  display: flex
  align-items: center
  width: 100%

#slider > *
  display: block

#slider > span:nth-of-type(1)
  margin-right: 10pt

#slider > span:nth-of-type(2)
  margin-left: 10pt

</style>
