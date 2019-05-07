<template>
  <BoxSection
    icon='section-light-dimming.svg'
    title='Light dimming'
    color='#F4F4E7'
    :dark=true>
    <div :id='$style.body'>
      <div :id='$style.left'>
        <BoxSubSection 
        icon='subsection-dimming-master.svg'
        title='Master switch'
        value='50w'>
          <small :id='$style.masterhint'>Dims all leds +25% or -25% at once.</small>
          <div :id='$style.masterbody'>
            <div :class='$style.masterbuttons' :id='$style.plus' @click='masterplus'></div>
            <div :id='$style.separator'></div>
            <div :class='$style.masterbuttons' :id='$style.minus' @click='masterminus'></div>
            <Loading v-if='loading' width='50pt' height='30pt' />
          </div>
        </BoxSubSection>
      </div>
      <div :id='$style.right'>
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
      </div>
    </div>
  </BoxSection>
</template>

<script>

import BoxSection from '~/components/boxsection'
import BoxSubSection from '~/components/boxsubsection'
import LedControl from '../components/ledcontrol'
import Loading from '~/components/loading'

export default {
  components: { BoxSection, BoxSubSection, LedControl, Loading, },
  computed: {
    timerpower() {
      const controller = this.controller,
            boxid = this.$route.params.box
      return this.controller.boxes[boxid].timer_output.value
    },
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
    loading() {
      const controller = this.controller
      return controller.leds.findIndex((l) => l.dim.loading) != -1
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
  mounted() {
    const controller = this.controller,
      boxid = this.$route.params.box
    for (let i in controller.leds) {
      const l = controller.leds[i]
      if (l.box.value != boxid) continue
      this.$store.dispatch('controllers/load_led_param', {id: controller.broker_clientid.value, i, key: 'dim'}) 
    }
    this.$store.dispatch('controllers/load_box_param', {id: controller.broker_clientid.value, i: boxid, key: 'timer_output'}) 
  },
}

</script>

<style module lang=stylus>

#body
  display: flex
  position: relative

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

#left
  flex: 0.6

#right
  flex: 1

#masterbody
  display: flex
  align-items: center
  justify-content: center

#masterhint
  align-self: flex-start
  color: #777777
  margin: 0 0 10pt 0

#independentbody
  flex: 1
  display: flex
  flex-wrap: wrap

.led
  flex: 25%
  display: flex
  align-items: center
  justify-content: center

.masterbuttons
  width: 40pt
  height: 40pt
  background-position: center
  background-size: contain
  background-repeat: no-repeat
  cursor: pointer

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

</style>
