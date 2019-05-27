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
  :value="lastValue">
    <div>
    </div>
    <div :class='$style.body'>
      <Graphs
      :title='title'
      :color='color'
      :metrics='metrics'
      :loading='loading'
      :min='min'
      :max='max'
      :suffix='suffix' />
    </div>
  </BoxSubSection>
</template>

<script>

import BoxSubSection from '~/components/boxsubsection.vue'

export default {
  components: {BoxSubSection, },
  props: ['icon', 'title', 'graphid', 'url', 'color', 'metrics', 'loading', 'min', 'max', 'suffix'],
  computed: {
    lastValue() {
      const { graphid } = this.$props,
            source = this.$store.getters['graphs/source'](graphid)
      if (!source || !source.metrics) {
        return '-'
      }
      const v = source.metrics[source.metrics.length-1][1]
      return (v < -100 || v > 100) ? 'error' : `${v}°`
    },
    metrics() {
      const { graphid } = this.$props,
            source = this.$store.getters['graphs/source'](graphid)
      if (!source || !source.metrics) {
        return []
      }
      return source.metrics.map((t) => t[1])
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
  created() {
    const { graphid, url } = this.$props
    this.$store.dispatch('graphs/load_graph', {id: graphid, url})
  },
}
</script>

<style module lang=stylus>

.body
  display: flex
  flex: 1

</style>
