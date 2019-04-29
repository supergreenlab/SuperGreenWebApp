<template>
  <BoxSubSection 
    :icon='`subsection-blower-${schedule}.svg`'
    title='Blower power'
    :subtitle='`(when the lights are ${schedule}.)`'
    value='35%'>
    <div :id='$style.body'>
      <span>0%</span><Slider /><span>100%</span>
    </div>
  </BoxSubSection>
</template>

<script>

import BoxSubSection from '~/components/boxsubsection'
import Slider from '~/components/slider'

export default {
  props: ['schedule'],
  components: { BoxSubSection, Slider, },
}

</script>

<style module lang=stylus>

#body
  flex: 1
  display: flex

#body > *
  display: block

#body > span:nth-of-type(1)
  margin-right: 10pt

#body > span:nth-of-type(2)
  margin-left: 10pt

</style>
