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
    icon='section-remotecamera.svg'
    title='Remote camera'
    color='#73C253'
    link='Checkout the HowTo build here'
    linkurl='https://github.com/supergreenlab/SuperGreenLive'
    :height='expanded ? `${contentHeight}px` : "30px"'>
    <div ref='content' :id='$style.content' :class='!expanded ? $style.hidden : ""'>
      <BoxSubSection 
        icon='subsection-remotecamera-liveview.svg'
        title='Live view'>
          <div :id='$style.body'>
            <Liveview />
          </div>
      </BoxSubSection>
    </div>
    <BoxSectionExpander @click='toggleExpand' :expanded='expanded' ref='expander' />
  </BoxSection>
</template>

<script>

import BoxSection from '~/components/boxsection'
import BoxSubSection from '~/components/boxsubsection'
import BoxSectionExpander from '~/components/boxsectionexpander'
import Liveview from '~/components/liveview'

export default {
  data() {
    return {
      expanded: false,
      contentHeight: 0,
    }
  },
  components: { BoxSection, BoxSubSection, Liveview, BoxSectionExpander, },
  mounted() {
    this.$data.contentHeight = this.$refs.content.clientHeight + 20
  },
  methods: {
    toggleExpand() {
      this.$data.expanded = !this.$data.expanded
    }
  },
}

</script>

<style module lang=stylus>

#body
  display: flex
  flex: 1
  width: 100%

#content
  transition: opacity 0.2s
 
.hidden
  opacity: 0

#ismyplantok
  display: block
  text-align: right

</style>
