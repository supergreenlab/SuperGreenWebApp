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
  <section v-if='enabled' :id='$style.container'>
    <div :id='$style.header'>
      <h1>Box #1</h1>
    </div>
    <RemoteCamera />
    <Monitoring />
    <BlowerControl />
    <Dimming />
    <Schedule />
  </section>
  <section v-else :id='$style.containercenter'>
    <button v-on:click='enable()'>Enable</button>
    <Loading v-if='loadingenable' width='115pt' height='80pt' />
  </section>
</template>

<script>
import RemoteCamera from '~/components/remotecamera'
import Monitoring from '~/components/monitoring'
import BlowerControl from '~/components/blowercontrol'
import Dimming from '~/components/dimming'
import Schedule from '~/components/schedule'
import Loading from '~/components/loading'

export default {
  components: { RemoteCamera, Monitoring, BlowerControl, Dimming, Schedule, Loading, },
  computed: {
    enabled() {
      const controller = this.$store.getters['controllers/getSelected'],
            boxid = this.$route.params.box
      return controller.boxes[boxid].enabled.value
    },
    loadingenable() {
      const controller = this.$store.getters['controllers/getSelected'],
            boxid = this.$route.params.box
      return controller.boxes[boxid].enabled.loading
    },
  },
  methods: {
    enable() {
        const controller = this.$store.getters['controllers/getSelected'],
              boxid = this.$route.params.box
        this.$store.dispatch('controllers/set_box_param', {id: controller.broker_clientid.value, i: boxid, key: 'enabled', value: 1}) 
        this.$store.dispatch('controllers/set_box_param', {id: controller.broker_clientid.value, i: boxid, key: 'timer_type', value: 1}) 
    },
  },
  mounted() {
    const controller = this.$store.getters['controllers/getSelected'],
          boxid = this.$route.params.box
    this.$store.dispatch('controllers/load_box_param', {id: controller.broker_clientid.value, i: boxid, key: 'enabled'}) 
  },
}
</script>

<style module lang=stylus>

#container
  display: flex
  flex-direction: column
  background-color: white
  margin: 0pt 5pt 0 10pt
  max-width: 700pt
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.15)
  height: 100%

#containercenter
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  height: 100%

#containercenter > button
  background-color: #3bb30b
  border: none
  padding: 5pt 20pt
  border-radius: 3pt
  color: white
  cursor: pointer

#header
  padding: 0 20pt

</style>
