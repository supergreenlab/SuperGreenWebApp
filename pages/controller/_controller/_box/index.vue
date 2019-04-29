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
    <Box :key='`${controller.broker_clientid.value}/${box}`' />
  </section>
</template>

<script>
import Box from '~/components/box'
import Loading from '~/components/loading'

export default {
  data() {
    return {
      failed: false,
    }
  },
  components: { Box, Loading, },
  methods: {
    async retry() {
      this.$data.failed = false
      const controller = this.$store.getters['controllers/getSelected']
      if (controller && controller.found == false) {
        try {
          await this.$store.dispatch('controllers/search_controller', {id: controller.broker_clientid.value})
        } catch(e) {
          console.log(e)
          this.$data.failed = true
        }
      }
    },
  },
  computed: {
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
    box() {
      return this.$route.params.box
    },
  },
  mounted() {
    this.$store.watch(state => state.controllers.selected, () => {
      this.retry()
    })
    this.retry()
  },
  async fetch({ store }) {
    await store.dispatch('controllers/init')
    await store.dispatch('liveviews/init')
    await store.dispatch('graphs/init')
  },
}
</script>

<style module lang=stylus>

#container
  flex: 1
  position: relative
  display: flex
  flex-direction: column
  overflow-y: auto

#container > div
  max-width: 700pt

#loading
  position: absolute
  width: 100%
  height: 100%
  top: 0
  left: 0
  display: flex
  flex: 1
  flex-direction: column
  align-items: center
  justify-content: center
  position: relative
  background-color: white

#loading_relative
  position: relative
  height: 200pt
  width: 400pt

</style>
