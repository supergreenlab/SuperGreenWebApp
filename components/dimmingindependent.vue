<template>
  <BoxSubSection 
  icon='subsection-dimming-independent.svg'
  title='Independent light dimming'>
    <div :id='$style.timer'>Current timer desired power:&nbsp;<span :id='$style.timerpower'>{{ timerpower }}%</span></div>
    <div :id='$style.independentbody'>
      <div v-for='(led, j) in controller.leds' v-if='led.box.value == $route.params.box' :key='controller.broker_clientid.value + j' :class='$style.led'>
        <LedControl :j='j' :led='led' />
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
  props: ['expanded', 'loading', 'controller', ],
  computed: {
    timerpower() {
      const controller = this.controller,
            boxid = this.$route.params.box
      return this.controller.boxes[boxid].timer_output.value
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
  flex: 25%
  display: flex
  align-items: center
  justify-content: center

</style>
