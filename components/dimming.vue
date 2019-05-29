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
    icon='section-light-dimming.svg'
    title='Light dimming'
    color='#F4F4E7'
    :dark=true>
    <div :id='$style.body'>
      <div :id='$style.left'>
        <DimmingMasterSwitch :expanded='expanded' :controller='controller' :loading='loading'/>
      </div>
      <div :id='$style.right'>
        <DimmingIndependent :expanded='expanded' :controller='controller' :loading='loading'/>
      </div>
    </div>
    <BoxSectionExpander @click='toggleExpand' :expanded='expanded' ref='expander' />
  </BoxSection>
</template>

<script>

import BoxSection from '~/components/boxsection'
import BoxSectionExpander from '~/components/boxsectionexpander'
import DimmingMasterSwitch from '~/components/dimmingmasterswitch'
import DimmingIndependent from '~/components/dimmingindependent'

export default {
  components: { BoxSection, BoxSectionExpander, DimmingMasterSwitch, DimmingIndependent, },
  data() {
    return {
      expanded: false,
    }
  },
  computed: {
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
    loading() {
      const controller = this.controller
      return controller.leds.findIndex((l) => l.dim.loading) != -1
    },
  },
  methods: {
    toggleExpand() {
      this.$data.expanded = !this.$data.expanded
    },
  },
  mounted() {
    const controller = this.controller,
      boxid = this.$route.params.box
    for (let i in controller.leds) {
      const l = controller.leds[i]
      if (l.box.value != boxid) continue
      this.$store.dispatch('controllers/load_led_param', {id: controller.broker_clientid.value, i, key: 'dim'}) 
    }
    this.$store.dispatch('controllers/load_box_param', {id: controller.broker_clientid.value, i: boxid, key: 'timer_output'}) 
  },
}

</script>

<style module lang=stylus>

#body
  display: flex
  position: relative
  @media screen and (max-width: 600px)
    flex-direction: column

#left
  flex: 0.6

#right
  flex: 1

</style>
