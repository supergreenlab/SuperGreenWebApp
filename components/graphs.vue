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
    <div :id='$style.graph' ref='graph'>
      <svg width='100%' height='100%'>
        <g v-if='!loading'>
          <polygon :points="fill_points" :style="{fill: color, opacity: 0.2}"></polygon>
          <path :d="stroke_path" :style='{stroke: color, "stroke-width": 2}' fill=none></path>
        </g>
      </svg>
      <div v-if='!loading' :class='$style.line' :id='$style.max_line' :style='{bottom: `${max_top}px`, color}'>{{ this.max_value }}{{ suffix }}</div>
      <div v-if='!loading' :class='$style.line' :id='$style.min_line' :style='{top: `${min_top}px`, color}'>{{ this.min_value }}{{ suffix }}</div>
    </div>
    <Loading v-if='loading' />
  </section>
</template>

<script>
import Loading from '~/components/loading'

export default {
  components: { Loading, },
  data() {
    return {
      gwidth: -1,
      gheight: -1,
    }
  },
  props: {
    min: Number,
    max: Number,
    title: String,
    color: String,
    value: String,
    metrics: Array,
    loading: Boolean,
    suffix: String,
  },
  computed: {
    width() {
      if (this.$data.gwidth == -1) {
        this.$data.gwidth = this.$refs.graph.clientWidth
      }
      return this.$data.gwidth
    },
    height() {
      if (this.$data.gheight == -1) {
        this.$data.gheight = this.$refs.graph.clientHeight
      }
      return this.$data.gheight
    },
    fill_points() {
      if (!this.$refs.graph) return ''
      const width = this.width,
            height = this.height,
            { min, max, metrics } = this.$props,
            xspan = width / (metrics.length - 1),
            ymin = min - (max - min) * 0.2,
            ymax = max + (max - min) * 0.2
      let points = `0,${height} `,
          x = 0
      for (let i in metrics) {
        const value = (metrics[i] - ymin) / (ymax - ymin)
        points += `${x},${value * height} `
        x += xspan
      }
      points += `${width},${height}`
      return points
    },

    stroke_path() {
      if (!this.$refs.graph) return ''
      const width = this.width,
            height = this.height,
            { min, max, metrics } = this.$props,
            xspan = width / (metrics.length - 1),
            ymin = min - (max - min) * 0.2,
            ymax = max + (max - min) * 0.2
      let points = '',
          x = 0
      for (let i in metrics) {
        if (i == 0) {
          points += 'M'
        } else {
          points += 'L'
        }
        const value = (metrics[i] - ymin) / (ymax - ymin)
        points += `${x} ${value * height} `
        x += xspan
      }
      return points
    },

    max_value() {
      const { metrics, } = this.$props,
        maxv = metrics.sort((m1, m2) => m1 > m2)[0]
      return maxv
    },
    min_value() {
      const { metrics, } = this.$props,
        minv = metrics.sort((m1, m2) => m1 < m2)[0]
      return minv
    },

    max_top() {
      if (!this.$refs.graph) return ''
      const width = this.width,
            height = this.height,
            { metrics, min, max, } = this.$props,
            ymin = min - (max - min) * 0.2,
            ymax = max + (max - min) * 0.2
      return height - ((this.max_value - ymin) / (ymax - ymin) * height)
    },

    min_top() {
      if (!this.$refs.graph) return ''
      const width = this.width,
            height = this.height,
            { metrics, min, max, } = this.$props,
            ymin = min - (max - min) * 0.2,
            ymax = max + (max - min) * 0.2
      return (this.min_value - ymin) / (ymax - ymin) * height
    },
  },
  methods: {
    resize() {
      this.$data.gwidth = this.$refs.graph.clientWidth
      this.$data.gheight = this.$refs.graph.clientHeight
    },
  },
  mounted: function () {
    window.addEventListener('resize', this.resize, true)
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.resize, true)
  },
}
</script>

<style module lang=stylus>

#container
  display: flex  
  margin: 10pt

#graph
  flex: 1
  position: relative
  border-radius: 1pt
  border-left: 1.5pt solid #dddddd
  border-bottom: 1.5pt solid #dddddd

.line
  position: absolute
  left: -30pt
  width: calc(100% + 30pt)
  font-size: 1.2em
  font-weight: 600

#max_line
  padding-bottom: 2pt
  border-bottom: 2px dashed #c4c4c4

#min_line
  padding-top: 2pt
  border-top: 2px dashed #c4c4c4
 

</style>
