<template>
  <BoxSection
    icon='section-monitoring.svg'
    title='Status & Monitoring'
    color='#0B81B3'>
    <BoxSubSection 
    icon='subsection-monitoring-status.svg'
    title='Box status'>
      <div :class='$style.body'>
        lol
      </div>
    </BoxSubSection>
    <BoxSubSection 
    icon='subsection-monitoring-temperature.svg'
    title='Temperature'
    value='25°'>
      <div :class='$style.body'>
        <Graphs title='Temperature' color='#3bb30b' :value='last_temperature' :metrics='temperature' :loading='loading' :min=10 :max=40 />
      </div>
    </BoxSubSection>
    <BoxSubSection 
    icon='subsection-monitoring-humidity.svg'
    title='Humidity'
    value='51%'>
      <div :class='$style.body'>
        <Graphs title='Humidity' color='#0b81b3' :value='last_humidity' :metrics='humidity' :loading='loading' :min=0 :max=100 />
      </div>
    </BoxSubSection>
  </BoxSection>
</template>

<script>

import BoxSection from '~/components/boxsection.vue'
import BoxSubSection from '~/components/boxsubsection.vue'
import Graphs from '~/components/graphs.vue'

export default {
  components: { BoxSection, BoxSubSection, Graphs, },
}

</script>

<style module lang=stylus>

#body
  display: flex
  flex: 1
  width: 100%

</style>
