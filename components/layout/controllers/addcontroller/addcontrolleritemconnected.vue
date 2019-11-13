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
  <AddControllerItem title='Already connected' button=''>
    <input v-model='url' type='text' placeholder='IP or name.local' />
  </AddControllerItem>
</template>

<script>
export default {
  data: () => ({
    url: '',
  }),
  methods: {
    wifi() {
      this.$store.commit('controllers/configureSearchNewController', {url: this.$data.url, is_sta: true})
      this.$router.push('/new/plug')
    },
  },
}
</script>

<style>

#container
  flex: 1

</style>
