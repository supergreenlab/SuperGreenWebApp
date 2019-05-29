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
  icon='subsection-dimming-independent.svg'
  title='Independent light dimming'
  :value='independentValue'
  :height='expanded ? `${contentHeight}px` : "0"'>
    <div ref='content'>
      <div :id='$style.timer'>Current timer desired power:&nbsp;<span :id='$style.timerpower'>{{ timerpower }}%</span></div>
      <div :id='$style.independentbody'>
        <div v-for='(led, j) in controller.leds' v-if='led.box.value == $route.params.box' :key='controller.broker_clientid.value + j' :class='$style.led'>
          <LedControl :j='j' :led='led' />
        </div>
      </div>
    </div>
  </BoxSubSection>
</template>

<script>

import BoxSubSection from '~/components/boxsubsection'
import LedControl from '../components/ledcontrol'
import Loading from '~/components/loading'

export default {
  components: {BoxSubSection, LedControl, Loading, },
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
    timerpower() {
      const controller = this.controller,
            boxid = this.$route.params.box
      return this.controller.boxes[boxid].timer_output.value
    },
    independentValue() {
      const controller = this.controller,
            boxid = this.$route.params.box
      return this.controller.leds.filter((l) => l.enabled.value && l.box.value == boxid).reduce((acc, l, i) => `${acc}${acc ? "-":""}${l.dim.value}%`, '')
    },
  }
}
</script>

<style module lang=stylus>

#timer
  display: flex
  flex: 1
  width: 100%
  padding: 0pt 0 5pt 15pt
  color: #777777
  font-weight: 400

#timerpower
  color: #47B71A
  font-weight: 600

#independentbody
  flex: 1
  display: flex
  flex-wrap: wrap

.led
  flex-basis: 25%
  display: flex
  align-items: center
  justify-content: center
  @media screen and (max-width: 600px)
    flex-basis: 50%

</style>
