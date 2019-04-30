<template>
  <BoxSection
    icon='section-monitoring.svg'
    title='Status & Monitoring'
    color='#0B81B3'>
    <BoxSubSection 
    icon='subsection-monitoring-status.svg'
    title='Box status'>
      <div :class='$style.body'>
        <h1 :id='$style.status'>OK</h1>
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
  created() {
    const controller = this.$store.getters['controllers/getSelected'],
          boxid = this.$route.params.box,
          graph_id = `temphumi.${controller.broker_clientid.value}.${boxid}`
    this.$store.dispatch('graphs/load_graph', {id: graph_id, url: `http://metrics.supergreenlab.com?box=${boxid}&controller=${controller.broker_clientid.value}`})
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
  }
}

</script>

<style module lang=stylus>

.body
  display: flex
  flex: 1

#status
  color: #3BB30B

</style>
