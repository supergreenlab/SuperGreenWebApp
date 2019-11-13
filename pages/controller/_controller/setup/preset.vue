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
    <div :id='$style.body'>
      <h1>New controller setup.</h1>
      <div :class='$style.instruction'>
        Alright now's the time to plug in the lights!<br />
        Press the button below once they're all connected.<br />
        <div v-if='led_test_phase'>Switching <b>{{ led_test_phase }}</b>: {{led_n+1}}/{{controller.leds.length}}</div>
        <a href='javascript:void(0)' :class='$style.button' @click='testLeds'>Test LEDs</a>
      </div>
      <h1>Preconfiguration</h1>
      <div :class='$style.instruction'>
        (All this settings can be overwritten later)
      </div>
      <div :id='$style.presets'>
        <div v-for='(preset, i) in presets' :class='$style.preset' v-on:click='select(i)'>
          <Preset :id='preset.id' :title='preset.title' :icon='preset.icon' :description='preset.description' :selected='i == presetid' />
        </div>
      </div>
    </div>

    <section :id='$style.nav'>
      <NextButton :onClick='writePreset' label='Configure' />
    </section>
    <div v-if='loading' :id='$style.loading'>
      <Loading :label='`Uploading config.. ${parseInt(done/total*100)}%`' width='115pt' height='80pt' />
    </div>
  </section>
</template>

<script>
import Preset from '~/components/setup/presets/preset.vue'
import NextButton from '~/components/common/nextbutton.vue'
import Loading from '~/components/common/loading.vue'

export default {
  data() {
    return {
      done: 0,
      total: 0,
      presetid: 0,
      loading: false,
      led_n: 0,
      led_test_phase: '',
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
    async testLeds() {
      this.$data.led_test_phase = 'ON'
      for (let i in this.controller.leds) {
        const led = this.controller.leds[i]
        this.$data.led_n = parseInt(i)
        await this.$store.dispatch(`controllers/setLedParam`, {id: this.controller.broker_clientid.value, i, key: 'duty', value: 100})
      }
      await new Promise((r) => setTimeout(r, 1000))
      this.$data.led_test_phase = 'OFF'
      for (let i in this.controller.leds) {
        const led = this.controller.leds[i]
        this.$data.led_n = parseInt(i)
        await this.$store.dispatch(`controllers/setLedParam`, {id: this.controller.broker_clientid.value, i, key: 'duty', value: 0})
      }
      this.$data.led_test_phase = ''
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
            try {
              await this.$store.dispatch(`controllers/set${type[0].toUpperCase() + type.slice(1)}Param`, req(k, keys[k]))
            } catch(e) {
              console.log(e)
            }
            this.$data.done++
          })

      let promises = shoot_presets(preset.keys, 'controller', (k, v) => ({id: selected, key: k, value: v,}))
      preset.keys.leds.forEach((led, i) => promises.push(...shoot_presets(led, 'led', (k, v) => ({id: selected, key: k, value: v, i}))))
      preset.keys.boxes.forEach((box, i) => promises.push(...shoot_presets(box, 'box', (k, v) => ({id: selected, key: k, value: v, i}))))
      await Promise.all(promises)
      //this.$router.push(`/controller/${selected}/setup/name`)
      this.$router.push(`/controller/${selected}/0`)
    },
  },
}
</script>

<style module lang=stylus>

#container
  position: relative
  background-color: white
  color: #616161
  padding: 20pt 0

#body
  display: flex
  flex-direction: column
  align-items: center

#presets
  display: flex
  justify-content: space-around
  flex-wrap: wrap
  width: 100%
  margin: 20pt 0 0 0

.preset
  flex-basis: 40%
  margin: 10pt 10pt
  @media screen and (max-width: 600px)
    flex-basis: 100%

#nav
  display: flex
  justify-content: flex-end
  width: 100%

.button
  display: flex
  align-items: center
  justify-content: center
  padding: 0 25pt
  background-color: #3BB30B
  height: 23pt
  color: white
  text-decoration: none
  border-radius: 3pt
  margin: 10pt 0

.button:hover
  background-color: #4BC30B

.button:active
  background-color: #2BA30B

.instruction
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  margin: 10pt 10pt

#loading
  position: fixed
  width: 100vw
  height: 100vh
  top: 0
  left: 0

</style>
