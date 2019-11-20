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
    <Title title='GENERAL CONFIG' icon='settings-black.svg' />
    <div :id='$style.body'>
      <div :id='$style.setting'>
        <h2>Temperature unit</h2>
        <select v-model='unit'>
          <option value='metric'>C</option>
          <option value='imperial'>F</option>
        </select>
      </div>
      <div :id='$style.setting'>
        <h2>Timer custom hours</h2>
        <div :id='$style.timerhours'>
          <div :class='$style.timerhour'>
            <Input label='Mid day hour' name='middayh' v-model='middayh' />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Title from '~/components/settings/common/settings-title.vue'
import Input from '~/components/settings/common/settings-input.vue'
import Loading from '~/components/common/loading.vue'

export default {
  components: {Title, Loading, Input,},
  data() {
    return {
    }
  },
  computed: {
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
    unit: {
      get() { return this.$store.state.settings.unit },
      set(unit) { this.$store.commit('settings/setUnit', unit) }
    },
    middayh: {
      get() { return this.$store.state.settings.middayh },
      set(middayh) { 
        if (isNaN(parseInt(middayh))) {
          return
        }
        this.$store.commit('settings/setMidDayH', parseInt(middayh))
      }
    },
  },
  methods: {
  },
}
</script>

<style module lang=stylus>

#container
  display: flex
  flex-direction: column
  padding: 0 10pt
  @media screen and (max-width: 600px)
    width: 100vw

#body
  display: flex
  position: relative
  min-height: 50pt
  padding: 15pt 0
  @media screen and (max-width: 600px)
    flex-direction: column

#setting
  padding: 10pt 25pt

#setting > h2
  color: #6a6a6a
  margin: 0 0 10pt 0

#timerhours
  display: flex
  margin: 10pt 0 0 0

.timerhour
  margin-right: 10pt

</style>
