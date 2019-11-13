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
  <BoxSubSection 
  :icon='icon'
  :title='title'
  :value='lastValue'
  :color='color'
  :height='expanded ? `${headerHeight + bodyHeight}px` : `${headerHeight}px`'>
    <div :id='$style.header' ref='header'>
      <div :class='$style.minmax'>
        <span :class='$style.label'>Low:</span>
        <span :class='$style.value' :style='{color}'>{{ minValue }}{{ suffix }}</span>
      </div>
      <div :class='$style.minmax'>
        <span :class='$style.label'>High:</span>
        <span :class='$style.value' :style='{color}'>{{ maxValue }}{{ suffix }}</span>
      </div>
      <div :id='$style.spacer'></div>
      <a href='javascript:void(0)' @click='expand' :id='$style.expander' :class='expanded ? $style.expanded : ""'>
        {{ expanded ? "Hide graph" : "View graph" }} <img :src='require(`~/assets/img/${expander}`)' />
      </a>
    </div>
    <div :id='$style.body' ref='body'>
      <Graphs
      :title='title'
      :color='color'
      :metrics='metrics'
      :loading='loading'
      :min='min'
      :max='max'
      :suffix='suffix' />
    </div>
    <Loading v-if='loading' width='80pt' height='50pt' />
  </BoxSubSection>
</template>

<script>

import BoxSubSection from '~/components/controls/common/boxsubsection.vue'
import Graphs from '~/components/controls/monitoring/graphs.vue'
import Loading from '~/components/common/loading.vue'

export default {
  data() {
    return {
      expanded: false,
      headerHeight: 0,
      bodyHeight: 0,
    }
  },
  mounted() {
    this.$data.headerHeight = this.$refs.header.clientHeight
    this.$data.bodyHeight = this.$refs.body.clientHeight
    this.$props.mounted()
  },
  components: {BoxSubSection, Graphs, Loading, },
  props: ['icon', 'title', 'graphid', 'url', 'color', 'min', 'max', 'suffix', 'expander', 'sizeChanged', 'mounted', 'convertFn'],
  computed: {
    lastValue() {
      const { graphid, suffix, convertFn } = this.$props,
            source = this.$store.getters['graphs/source'](graphid)
      if (!source || !source.metrics || !source.metrics.length) {
        return '-'
      }
      const v = source.metrics[source.metrics.length-1][1]
      return `${convertFn(v)}${suffix}`
    },
    minValue() {
      const { graphid, suffix, convertFn } = this.$props,
            source = this.$store.getters['graphs/source'](graphid)
      if (!source || !source.metrics || !source.metrics.length) {
        return '-'
      }
      const v = Object.assign([], source.metrics).sort((m1, m2) => m1[1] - m2[1])[0][1]
      return convertFn(v)
    },
    maxValue() {
      const { graphid, suffix, convertFn } = this.$props,
            source = this.$store.getters['graphs/source'](graphid)
      if (!source || !source.metrics || !source.metrics.length) {
        return '-'
      }
      const v = Object.assign([], source.metrics).sort((m1, m2) => m2[1] - m1[1])[0][1]
      return convertFn(v)
    },
    metrics() {
      const { graphid, convertFn } = this.$props,
            source = this.$store.getters['graphs/source'](graphid)
      if (!source || !source.metrics) {
        return []
      }
      return source.metrics.map(v => [v[0], convertFn(v[1])])
    },
    loading() {
      const { graphid } = this.$props,
            source = this.$store.getters['graphs/source'](graphid)
      if (!source) {
        return true
      }
      return !source.loaded
    },
  },
  methods: {
    expand() {
      this.$data.expanded = !this.$data.expanded
      this.$props.sizeChanged(this.$data.expanded ? this.$data.bodyHeight : -this.$data.bodyHeight)
    },
  },
  created() {
    const { graphid, url } = this.$props
    this.$store.dispatch('graphs/loadGraph', {id: graphid, url})
  },
}
</script>

<style module lang=stylus>

#body
  display: flex
  flex: 1
  overflow-x: auto

#header
  display: flex
  align-items: center
  justify-content: flex-start
  width: 100%
  padding-left: 10pt

.label
  font-weight: 300
  color: #777777

.value
  font-weight: 600
  font-size: 1.1em
  margin-right: 10pt

#expander
  display: flex
  align-items: center
  padding: 3pt
  border: 1px solid #E4E4E4
  border-radius: 2pt
  justify-self: flex-end
  color: #777777
  text-decoration: none
  font-size: 0.9em
  white-space: nowrap

#expander:hover
  background-color: #EEEEEE

#expander > img
  width: 18px
  height: 10.125px
  margin-left: 2pt
  transform: rotate(0deg)  
  transition: transform 0.2s

#expander.expanded > img
  transform: rotate(180deg)  

#spacer
  flex: 1

</style>
