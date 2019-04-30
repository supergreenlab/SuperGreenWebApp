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
          <div :id='$style.masterbody'>
            <div :class='$style.masterbuttons' :id='$style.plus' @click='masterplus'></div>
            <div :id='$style.separator'></div>
            <div :class='$style.masterbuttons' :id='$style.minus' @click='masterminus'></div>
            <Loading v-if='loading' />
          </div>
        </BoxSubSection>
      </div>
      <div :id='$style.right'>
        <BoxSubSection 
        icon='subsection-dimming-independent.svg'
        title='Independent light dimming'>
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
      for (let i in controller.leds.filter((l) => l.box.value == boxid)) {
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

#body
  display: flex
  position: relative

#left
  flex: 0.6

#right
  flex: 1

#masterbody
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center

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
  width: 35pt
  height: 35pt
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
  height: 1pt
  width: 50pt
  background-color: #C4C4C4
  margin: 10pt 0 0pt 0

#minus
  background-image: url('~assets/img/button-light-dimming-master-minus.svg')

</style>
