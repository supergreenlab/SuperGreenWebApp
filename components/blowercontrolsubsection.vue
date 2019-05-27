<template>
  <BoxSubSection 
    :icon='`subsection-blower-${schedule}.svg`'
    title='Blower power'
    :subtitle='`(when the lights are ${schedule}.)`'
    :value='`${blower}%`'
    :height='expanded ? `${bodyHeight}pt` : 0'>
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
    this.$data.bodyHeight = this.$refs.body.clientHeight
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
  width: 100%

#slider > *
  display: block

#slider > span:nth-of-type(1)
  margin-right: 10pt

#slider > span:nth-of-type(2)
  margin-left: 10pt

</style>
