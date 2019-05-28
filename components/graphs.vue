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
    <Loading v-if='loading' width='80pt' height='50pt' />
  </section>
</template>

<script>
import VueCharts from 'vue-chartjs'
import { Bar, Line } from 'vue-chartjs'
import Loading from '~/components/loading'

export default {
  extends: Bar,
  components: { Loading, },
  props: {
    min: Number,
    max: Number,
    title: String,
    color: String,
    metrics: Array,
    loading: Boolean,
    suffix: String,
  },
}
</script>

<style module lang=stylus>

#container
  flex: 1
  display: flex  
  margin: 10pt

</style>
