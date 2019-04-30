<template>
  <BoxSection
    icon='section-nightday.svg'
    title='Night and day schedules'
    gradientfrom='#3F44B9'
    gradientto='#CEC946'>
    <section :id='$style.container'>
      <BoxSubSection 
        icon='subsection-nightday-sun.svg'
        title='Day schedule'>
        <div :class='$style.body'>
          <ScheduleButtons title='18h' icon='button-nightday-veg.svg' subtitle='Veg' color='#3BB30B' :selected='timespan > 12' @click='veg' />
          <ScheduleButtons title='12h' icon='button-nightday-bloom.svg' subtitle='Bloom' color='#E561A0' :selected='timespan <= 12' @click='bloom' />
          <Loading v-if='loading' width='50pt' height='30pt' />
        </div>
      </BoxSubSection>
      <BoxSubSection 
        icon='subsection-nightday-shift.svg'
        title='Night/Day shift'>
        <div :class='$style.body'>
          <ScheduleButtons title='18h' icon='button-nightday-dayshift.svg' subtitle='Day' color='#CEC946' :selected='on_hour < off_hour' @click='day' />
          <ScheduleButtons title='12h' icon='button-nightday-nightshift.svg' subtitle='Night' color='#3F44B9' :selected='on_hour > off_hour' @click='night' />
          <Loading v-if='loading' width='50pt' height='30pt' />
        </div>
      </BoxSubSection>
    </section>
  </BoxSection>
</template>

<script>

import BoxSection from '~/components/boxsection.vue'
import BoxSubSection from '~/components/boxsubsection.vue'
import ScheduleButtons from '~/components/schedulebuttons.vue'
import Loading from '~/components/loading'

export default {
  components: { BoxSection, BoxSubSection, ScheduleButtons, Loading, },
  computed: {
    timespan() {
      const controller = this.controller,
            boxid = this.$route.params.box,
            on_hour = controller.boxes[boxid].on_hour.value,
            off_hour = controller.boxes[boxid].off_hour.value
      return (on_hour < off_hour) ? (off_hour - on_hour) : ((off_hour + 24) - on_hour)
    },
    on_hour() {
      const controller = this.controller,
            boxid = this.$route.params.box
      return controller.boxes[boxid].on_hour.value
    },
    off_hour() {
      const controller = this.controller,
            boxid = this.$route.params.box
      return controller.boxes[boxid].off_hour.value
    },
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
    loading() {
      const controller = this.controller,
            boxid = this.$route.params.box
      return controller.boxes[boxid].on_hour.loading || controller.boxes[boxid].off_hour.loading
    },
  },
  methods: {
    schedule(v, day) {
      const controller = this.controller,
            boxid = this.$route.params.box
      this.$store.dispatch('controllers/set_box_param', {id: controller.broker_clientid.value, i: boxid, key: 'on_hour', value: day ? 12 - v/2 : 24 - v/2}) 
      this.$store.dispatch('controllers/set_box_param', {id: controller.broker_clientid.value, i: boxid, key: 'off_hour', value: day ? 12 + v/2 : v/2}) 
    },
    veg() {
      const controller = this.controller,
            boxid = this.$route.params.box,
            on_hour = controller.boxes[boxid].on_hour.value,
            off_hour = controller.boxes[boxid].off_hour.value
      this.schedule(18, on_hour < off_hour)
    },
    bloom() {
      const controller = this.controller,
            boxid = this.$route.params.box,
            on_hour = controller.boxes[boxid].on_hour.value,
            off_hour = controller.boxes[boxid].off_hour.value
      this.schedule(12, on_hour < off_hour)
    },
    day() {
      this.schedule(this.timespan, true)
    },
    night() {
      this.schedule(this.timespan, false)
    },
  },
  mounted() {
    const controller = this.controller,
      boxid = this.$route.params.box
    this.$store.dispatch('controllers/load_box_param', {id: controller.broker_clientid.value, i: boxid, key: 'on_hour'}) 
    this.$store.dispatch('controllers/load_box_param', {id: controller.broker_clientid.value, i: boxid, key: 'off_hour'}) 
  },
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
