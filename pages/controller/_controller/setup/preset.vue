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
  <section v-if='controller' :id='$style.container'>
    <h1>New box detected.</h1>
    <h3>Pick your kit:</h3>
    <div :id='$style.presets'>
      <div v-for='(preset, i) in presets' :class='$style.preset' v-on:click='select(i)'>
        <Preset :id='preset.id' :title='preset.title' :icon='preset.icon' :description='preset.description' :selected='i == presetid' />
      </div>
    </div>

    <section :id='$style.nav'>
      <NextButton :onClick='writePreset' label='Configure' />
    </section>
    <Loading v-if='loading' :label='`Uploading config.. ${parseInt(done/total*100)}%`' width='115pt' height='80pt' />
  </section>
</template>

<script>
import Preset from '~/components/preset'
import NextButton from '~/components/nextbutton'
import Loading from '~/components/loading'

export default {
  data() {
    return {
      done: 0,
      total: 0,
      presetid: 0,
      loading: false
    }
  },
  components: { Preset, NextButton, Loading, },
  computed: {
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
    presets() {
      return this.$store.state.presets.configs
    },
  },
  methods: {
    select(i) {
      this.$data.presetid = i
    },
    async writePreset() {
      this.$data.loading = true
      const preset = this.$store.state.presets.configs[this.$data.presetid],
            selected = this.$route.params.controller,
            shoot_presets = (keys, type, req) =>
        Object.keys(keys)
          .filter((k) => typeof keys[k] == 'string' || typeof keys[k] == 'number')
          .map(async (k) => {
            this.$data.total++
            await this.$store.dispatch(`controllers/set_${type}_param`, req(k, keys[k]))
            this.$data.done++
          })

      let promises = shoot_presets(preset.keys, 'controller', (k, v) => ({id: selected, key: k, value: v,}))
      preset.keys.leds.forEach((led, i) => promises.push(...shoot_presets(led, 'led', (k, v) => ({id: selected, key: k, value: v, i}))))
      preset.keys.boxes.forEach((box, i) => promises.push(...shoot_presets(box, 'box', (k, v) => ({id: selected, key: k, value: v, i}))))
      await Promise.all(promises)
      this.$router.push(`/controller/${selected}/setup/name`)
    },
  },
}
</script>

<style module lang=stylus>

#container
  display: flex
  flex: 1
  position: relative
  flex-direction: column
  min-height: 100vh
  align-items: center
  justify-content: center
  background-color: white

#presets
  display: flex
  flex: 1
  width: 100%

.preset
  width: 50%
  display: flex
  align-items: center
  justify-content: center

#nav
  display: flex
  justify-content: flex-end
  width: 100%

</style>
