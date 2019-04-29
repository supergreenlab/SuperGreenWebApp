<template>
  <BoxSection
    icon='section-nightday.svg'
    title='Night and day schedules'
    gradientfrom='#3F44B9'
    gradientto='#CEC946'>
    <section :id='$style.container'>
      <BoxSubSection 
        icon='subsection-nightday-sun.svg'
        title='Day duration'>
        <div :class='$style.body'>
          <ScheduleButtons title='18h' icon='button-nightday-veg.svg' subtitle='Veg' color='#3BB30B' selected='true' />
          <ScheduleButtons title='12h' icon='button-nightday-bloom.svg' subtitle='Bloom' color='#E561A0' />
        </div>
      </BoxSubSection>
      <BoxSubSection 
        icon='subsection-nightday-shift.svg'
        title='Night/Day shift'>
        <div :class='$style.body'>
          <ScheduleButtons title='18h' icon='button-nightday-dayshift.svg' subtitle='Veg' color='#CEC946' />
          <ScheduleButtons title='12h' icon='button-nightday-nightshift.svg' subtitle='Bloom' color='#3F44B9' />
        </div>
      </BoxSubSection>
    </section>
  </BoxSection>
</template>

<script>

import BoxSection from '~/components/boxsection.vue'
import BoxSubSection from '~/components/boxsubsection.vue'
import ScheduleButtons from '~/components/schedulebuttons.vue'

export default {
  components: { BoxSection, BoxSubSection, ScheduleButtons, },
}

</script>

<style module lang=stylus>

#container
  display: flex

.body
  display: flex
  flex: 1
  width: 100%
  font-weight: 600

</style>
