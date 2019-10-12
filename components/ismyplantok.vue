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
    icon='towelie.png'
    title='Is my plant ok?'
    color='#4B5189'
    :linkto='`/controller/${$route.params.controller}/${$route.params.box}/ismyplantok`'
    height='5pt'>
  </BoxSection>
</template>

<script>

import BoxSection from '~/components/boxsection'

export default {
  components: { BoxSection, },
}

</script>

<style module lang=stylus>

#body
  display: flex
  flex: 1
  width: 100%

</style>
