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
          <nuxt-link :id='$style.ismyplantok' :to='`/controller/${$route.params.controller}/${$route.params.box}/ismyplantok`'>Is my plant ok ?</nuxt-link>
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
