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
            <div :class='$style.masterbuttons' :id='$style.plus'></div>
            <div :id='$style.separator'></div>
            <div :class='$style.masterbuttons' :id='$style.minus'></div>
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

export default {
  components: { BoxSection, BoxSubSection, LedControl, },
  computed: {
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
  }
}

</script>

<style module lang=stylus>

#body
  display: flex

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
  width: 50pt
  height: 50pt
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
