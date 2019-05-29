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
    :height='expanded ? `${contentHeight + statusHeight + 27}px` : `${statusHeight}px`'>
    <div ref='status'>
      <Status />
    </div>
    <div ref='content'>
      <GraphSubSection
        icon='subsection-monitoring-light.svg'
        title='Light'
        :graphid='`light.${controller.broker_clientid.value}.${boxid}`'
        :url='`http://metrics.supergreenlab.com?cid=${controller.broker_clientid.value}&q=BOX_${boxid}_TIMER_OUTPUT&t=72&n=50`'
        color='#D4CF5D'
        :min=10
        :max=40
        suffix='%'
        expander='expander-yellow.svg'
        :sizeChanged='sizeChanged'
        :mounted='updateHeights'/>
      <GraphSubSection
        icon='subsection-monitoring-temperature.svg'
        title='Temperature'
        :graphid='`temp.${controller.broker_clientid.value}.${boxid}`'
        :url='`http://metrics.supergreenlab.com?cid=${controller.broker_clientid.value}&q=BOX_${boxid}_SHT21_TEMP_C&t=72&n=50`'
        color='#3bb30b'
        :min=10
        :max=40
        suffix='°'
        expander='expander-green.svg'
        :sizeChanged='sizeChanged'
        :mounted='updateHeights'/>
      <GraphSubSection
        icon='subsection-monitoring-humidity.svg'
        title='Humidity'
        :graphid='`humi.${controller.broker_clientid.value}.${boxid}`'
        :url='`http://metrics.supergreenlab.com?cid=${controller.broker_clientid.value}&q=BOX_${boxid}_SHT21_HUMI&t=72&n=50`'
        color='#0b81b3'
        :min=0
        :max=100
        suffix='%'
        expander='expander-blue.svg'
        :sizeChanged='sizeChanged'
        :mounted='updateHeights'/>
      <GraphSubSection
        icon='subsection-monitoring-co2.svg'
        title='CO2'
        :graphid='`co2.${controller.broker_clientid.value}.${boxid}`'
        :url='`http://metrics.supergreenlab.com?cid=${controller.broker_clientid.value}&q=BOX_${boxid}_ARDUINO_CO2&t=72&n=50`'
        color='#DDB31C'
        :min=300
        :max=2500
        suffix='ppm'
        expander='expander-yellow.svg'
        :sizeChanged='sizeChanged'
        :mounted='updateHeights'/>
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
      this.$data.contentHeight = this.$refs.content.clientHeight
      this.$data.expanded = !this.$data.expanded
    },
    sizeChanged(v) {
      this.$data.contentHeight += v
    },
    updateHeights() {
      setTimeout(() => this.$data.contentHeight = this.$refs.content.clientHeight, 1000)
    },
  },
  computed: {
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
    boxid() {
      return this.$route.params.box
    },
  },
}

</script>

<style module lang=stylus>

</style>
