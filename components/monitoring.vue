<template>
  <BoxSection
    icon='section-monitoring.svg'
    title='Status & Monitoring'
    color='#0B81B3'
    :height='expanded ? `${contentHeight + statusHeight}px` : `${statusHeight}px`'>
    <div ref='status'>
      <Status :temperature='last_temperature' :humidity='last_humidity' :timer_advancement='timer_advancement' />
    </div>
    <div ref='content'>
      <BoxSubSection 
      icon='subsection-monitoring-temperature.svg'
      title='Temperature'
      :value="last_temperature">
        <div :class='$style.body'>
          <Graphs title='Temperature' color='#3bb30b' :metrics='temperature' :loading='loading' :min=10 :max=40 suffix='°' />
        </div>
      </BoxSubSection>
      <BoxSubSection 
      icon='subsection-monitoring-humidity.svg'
      title='Humidity'
      :value="last_humidity">
        <div :class='$style.body'>
          <Graphs title='Humidity' color='#0b81b3' :metrics='humidity' :loading='loading' :min=0 :max=100 suffix='%' />
        </div>
      </BoxSubSection>
    </div>
    <BoxSectionExpander @click='toggleExpand' :expanded='expanded' ref='expander' />
  </BoxSection>
</template>

<script>

import BoxSection from '~/components/boxsection.vue'
import BoxSubSection from '~/components/boxsubsection.vue'
import BoxSectionExpander from '~/components/boxsectionexpander'
import Status from '~/components/status.vue'
import Graphs from '~/components/graphs.vue'

export default {
  components: { BoxSection, BoxSubSection, BoxSectionExpander, Status, Graphs, },
  data() {
    return {
      expanded: false,
      statusHeight: 0,
      contentHeight: 0,
    }
  },
  created() {
    const controller = this.$store.getters['controllers/getSelected'],
          boxid = this.$route.params.box,
          graph_id = `temphumi.${controller.broker_clientid.value}.${boxid}`
    this.$store.dispatch('graphs/load_graph', {id: graph_id, url: `http://metrics.supergreenlab.com?box=${boxid}&controller=${controller.broker_clientid.value}`})
  },
  mounted() {
    this.$data.statusHeight = this.$refs.status.clientHeight + 20
    this.$data.contentHeight = this.$refs.content.clientHeight + 20
  },
  methods: {
    toggleExpand() {
      this.$data.expanded = !this.$data.expanded
    }
  },
  computed: {
    loading() {
      const controller = this.$store.getters['controllers/getSelected'],
            boxid = this.$route.params.box,
            graph_id = `temphumi.${controller.broker_clientid.value}.${boxid}`,
            source = this.$store.getters['graphs/source'](graph_id)
      if (!source) {
        return true
      }
      return !source.loaded
    },
    temperature() {
      const controller = this.$store.getters['controllers/getSelected'],
            boxid = this.$route.params.box,
            graph_id = `temphumi.${controller.broker_clientid.value}.${boxid}`,
            source = this.$store.getters['graphs/source'](graph_id)
      if (!source || !source.metrics.temp) {
        return []
      }
      return source.metrics.temp.map((t) => t[1])
    },
    last_temperature() {
      const temperature = this.temperature
      if (temperature && temperature.length) {
        const v = temperature[temperature.length-1]
        return (v < -100 || v > 100) ? 'error' : `${v}°`
      }
      return "-"
    },
    humidity() {
      const controller = this.$store.getters['controllers/getSelected'],
            boxid = this.$route.params.box,
            graph_id = `temphumi.${controller.broker_clientid.value}.${boxid}`,
            source = this.$store.getters['graphs/source'](graph_id)
      if (!source || !source.metrics.humi) {
        return []
      }
      return source.metrics.humi.map((h) => h[1])
    },
    last_humidity() {
      const humidity = this.humidity
      if (humidity && humidity.length) {
        const v = humidity[humidity.length-1]
        return (v < 0 || v > 100) ? 'error' : `${v}%`
      }
      return "-"
    },
    timer_advancement() {
      const controller = this.$store.getters['controllers/getSelected'],
            boxid = this.$route.params.box,
            timer_output = controller.boxes[boxid].timer_output.value
      if (timer_output <= 0) {
        return 0
      }

      const on_sec = controller.boxes[boxid].on_hour.value * 3600 + controller.boxes[boxid].on_min.value * 60,
            off_sec = controller.boxes[boxid].off_hour.value * 3600 + controller.boxes[boxid].off_min.value * 60,
            dt = new Date(),
            cur_sec = dt.getSeconds() + (60 * dt.getMinutes()) + (60 * 60 * dt.getHours()),
            time_span = (on_sec < off_sec) ? (off_sec - on_sec) : ((off_sec + (24 * 3600)) - on_sec),
            on_since = (on_sec < cur_sec ? (cur_sec - on_sec) : ((cur_sec + (24 * 3600)) - on_sec))
      return on_since / time_span * 100
    },
  },
}

</script>

<style module lang=stylus>

.body
  display: flex
  flex: 1

</style>
