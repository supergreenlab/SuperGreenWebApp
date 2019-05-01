<template>
  <BoxSection
    icon='section-nightday.svg'
    title='Night and day schedules'
    gradientfrom='#3F44B9'
    gradientto='#CEC946'>
    <section :id='$style.current'>
      Current timer settings: &nbsp;<span :id='$style.currenthours'>{{ on_hour }}:{{ pad(on_min) }} - {{ off_hour }}:{{ pad(off_min) }}</span>
    </section>
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
          <ScheduleButtons :title='`${schedule_for(timespan, true).on_hour}h - ${this.schedule_for(timespan, true).off_hour}h`' icon='button-nightday-dayshift.svg' subtitle='Day' color='#CEC946' :selected='on_hour < off_hour' @click='day' />
          <ScheduleButtons :title='`${schedule_for(timespan, false).on_hour}h - ${this.schedule_for(timespan, false).off_hour}h`' icon='button-nightday-nightshift.svg' subtitle='Night' color='#3F44B9' :selected='on_hour > off_hour' @click='night' />
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
    on_min() {
      const controller = this.controller,
            boxid = this.$route.params.box
      return controller.boxes[boxid].on_min.value
    },
    off_hour() {
      const controller = this.controller,
            boxid = this.$route.params.box
      return controller.boxes[boxid].off_hour.value
    },
    off_min() {
      const controller = this.controller,
            boxid = this.$route.params.box
      return controller.boxes[boxid].off_min.value
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
    schedule_for(v,day) {
      const controller = this.controller,
            boxid = this.$route.params.box,
            on_hour = controller.boxes[boxid].on_hour.value,
            off_hour = controller.boxes[boxid].off_hour.value

      v = typeof v !== 'undefined' ? v : this.timespan
      day = typeof day !== 'undefined' ? day : on_hour < off_hour
      return {
        on_hour: day ? 12 - v/2 : 24 - v/2,
        off_hour: day ? 12 + v/2 : v/2,
      }
    },
    schedule(v, day) {
      const controller = this.controller,
            boxid = this.$route.params.box,
            sc = this.schedule_for(v, day)
      this.$store.dispatch('controllers/set_box_param', {id: controller.broker_clientid.value, i: boxid, key: 'on_hour', value: sc.on_hour}) 
      this.$store.dispatch('controllers/set_box_param', {id: controller.broker_clientid.value, i: boxid, key: 'on_min', value: 0}) 
      this.$store.dispatch('controllers/set_box_param', {id: controller.broker_clientid.value, i: boxid, key: 'off_hour', value: sc.off_hour}) 
      this.$store.dispatch('controllers/set_box_param', {id: controller.broker_clientid.value, i: boxid, key: 'off_min', value: 0}) 
    },
    veg() {
      const controller = this.controller,
            boxid = this.$route.params.box,
            on_hour = controller.boxes[boxid].on_hour.value,
            off_hour = controller.boxes[boxid].off_hour.value
      this.schedule(18)
    },
    bloom() {
      const controller = this.controller,
            boxid = this.$route.params.box,
            on_hour = controller.boxes[boxid].on_hour.value,
            off_hour = controller.boxes[boxid].off_hour.value
      this.schedule(12)
    },
    day() {
      this.schedule(this.timespan, true)
    },
    night() {
      this.schedule(this.timespan, false)
    },
    pad(v) {
      return ('0' + v).substr(-2)
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

#current
  display: flex
  flex: 1
  width: 100%
  padding: 20pt 0 0pt 10pt
  color: #777777
  font-weight: 400

#currenthours
  color: #47B71A
  font-weight: 600

.body
  display: flex
  flex: 1
  width: 100%
  font-weight: 600

</style>
