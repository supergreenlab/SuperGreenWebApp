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
  <BoxSection
    icon='section-monitoring.svg'
    title='Status & Monitoring'
    color='#0B81B3'
    :height='expanded ? `${contentHeight + statusHeight}px` : `${statusHeight}px`'>
    <div ref='status'>
      <Status :temperature='last_temperature' :humidity='last_humidity' :timer_advancement='timer_advancement' />
    </div>
    <div ref='content'>
      <GraphSubSection
        icon='subsection-monitoring-temperature.svg'
        title='Temperature'
        :graphid='`temp.${controller.broker_clientid.value}.${boxid}`'
        :url='`http://metrics.supergreenlab.com?cid=${controller.broker_clientid.value}&q=BOX_${boxid}_SHT21_TEMP_C&t=72`'
        color='#3bb30b'
        :min=10
        :max=40
        suffix='°'/>
      <GraphSubSection
        icon='subsection-monitoring-humidity.svg'
        title='Humidity'
        :graphid='`humi.${controller.broker_clientid.value}.${boxid}`'
        :url='`http://metrics.supergreenlab.com?cid=${controller.broker_clientid.value}&q=BOX_${boxid}_SHT21_TEMP_C&t=72`'
        color='#0b81b3'
        :min=0
        :max=100
        suffix='%'/>
    </div>
    <BoxSectionExpander @click='toggleExpand' :expanded='expanded' ref='expander' />
  </BoxSection>
</template>

<script>

import BoxSection from '~/components/boxsection.vue'
import BoxSubSection from '~/components/boxsubsection.vue'
import BoxSectionExpander from '~/components/boxsectionexpander'
import GraphSubSection from '~/components/graphsubsection'
import Status from '~/components/status.vue'

export default {
  components: { BoxSection, BoxSubSection, BoxSectionExpander, Status, GraphSubSection, },
  data() {
    return {
      expanded: false,
      statusHeight: 0,
      contentHeight: 0,
    }
  },
  mounted() {
    this.$data.statusHeight = this.$refs.status.clientHeight
    this.$data.contentHeight = this.$refs.content.clientHeight
  },
  methods: {
    toggleExpand() {
      this.$data.expanded = !this.$data.expanded
    }
  },
  computed: {
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
    boxid() {
      return this.$route.params.box
    },
    last_temperature() {
      const temperature = this.temperature
      if (temperature && temperature.length) {
        const v = temperature[temperature.length-1]
        return (v < -100 || v > 100) ? 'error' : `${v}°`
      }
      return "-"
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

</style>
