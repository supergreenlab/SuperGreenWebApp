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
    <vue-slider :min='min || 0' :max='max || 100' v-model='vcomp' :id='$style.slider' height='15pt' :lazy="true" :contained='true' dotSize='30' :interval='interval || 5' absorb='true'/>
  </section>
</template>

<script>
import VueSlider from 'vue-slider-component'

export default {
  props: [ 'value', 'min', 'max', 'interval',],
  components: {
    VueSlider,
  },
  computed: {
    vcomp: {
      get() {
        return this.$props.value
      },
      set(v) {
        this.$emit('input', v)
      },
    }
  }
}
</script>

<style module lang=stylus>

#container
  flex: 1
  cursor: pointer
  
#slider
  width: 100%

</style>
