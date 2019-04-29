<!--
      Copyright (C) 2019  SuperGreenLab <towelie@supergreenlab.com>
      Author: Constantin Clauzel <constantin.clauzel@gmail.com>

      This program is free software: you can redistribute it and/or modify
      it under the terms of the GNU General Public License as published by
      the Free Software Foundation, either version 3 of the License, or
      (at your option) any later version.

      This program is distributed in the hope that it will be useful,
      but WITHOUT ANY WARRANTY; without even the implied warranty of
      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
      GNU General Public License for more details.

      You should have received a copy of the GNU General Public License
      along with this program.  If not, see <http://www.gnu.org/licenses/>.
 -->

<template>
  <section :id='$style.container'>
    <b>Monitoring</b>
    <div :id='$style.graphs'>
      <Graphs title='Temperature' color='#3bb30b' :value='last_temperature' :metrics='temperature' :loading='loading' :min=10 :max=40 />
      <Graphs title='Humidity' color='#0b81b3' :value='last_humidity' :metrics='humidity' :loading='loading' :min=0 :max=100 />
    </div>
  </section>
</template>

<script>
import Graphs from './graphs'

export default {
  components: { Graphs },
  props: [ 'i', 'box', 'controller' ],
  created() {
    const { i, controller } = this.$props,
      graph_id = `temphumi.${controller.broker_clientid.value}.${i}`
    this.$store.dispatch('graphs/load_graph', {id: graph_id, url: `http://metrics.supergreenlab.com?box=${i}&controller=${controller.broker_clientid.value}`})
  },
  computed: {
    loading() {
      const {i, controller} = this.$props,
            graph_id = `temphumi.${controller.broker_clientid.value}.${i}`,
            source = this.$store.getters['graphs/source'](graph_id)
      if (!source) {
        return true
      }
      return !source.loaded
    },
    temperature() {
      const {i, controller} = this.$props,
            graph_id = `temphumi.${controller.broker_clientid.value}.${i}`,
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
      const {i, controller} = this.$props,
            graph_id = `temphumi.${controller.broker_clientid.value}.${i}`,
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

#container
  flex: 1

#graphs
  display: flex
  flex-direction: column

</style>
