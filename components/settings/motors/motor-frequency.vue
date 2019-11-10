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
    <Input label='Frequency' name='frequency' v-model='freq' />
    <a href='javascript:void(0)' :class='`${$style.button} ${!this.valid ? $style.invalid : ""}`' @click='setBlowerFrequency'>OK</a>
    <Loading width='100pt' height='30pt' v-if='this.controller.motors[this.$props.motorId].frequency.loading' />
  </section>
</template>

<script>
import Input from '~/components/settings/common/settings-input.vue'
import Loading from '~/components/common/loading.vue'

export default {
  components: {Input, Loading,},
  props: ['motorId'],
  data() {
    return {
      freq: '',
    }
  },
  mounted() {
    this.$data.freq = this.controller.motors[this.$props.motorId].frequency.value
  },
  computed: {
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
    valid() {
      return this.$data.freq >= 2 && this.$data.freq <= 40000
    },
  },
  methods: {
    setBlowerFrequency() {
      this.$store.dispatch('controllers/set_motor_param', {id: this.controller.broker_clientid.value, i: this.$props.motorId, key: 'frequency', value: this.$data.freq}) 
    }
  },
}
</script>

<style module lang=stylus>

#container
  display: flex
  flex-direction: column
  position: relative
  align-items: flex-end
  padding: 0 10pt

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

.invalid
  opacity: 0.5
 
</style>
