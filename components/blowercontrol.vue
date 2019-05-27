<template>
  <BoxSection
    icon='section-blower.svg'
    title='Blower control'
    color='#7DB0BB'
    :expanded='expanded'>
    <div :id='$style.body'>
      <BlowerControlSubSection schedule='on' param='blower_day' :expanded="expanded" />
      <BlowerControlSubSection schedule='off' param='blower_night' :expanded="expanded" />
    </div>
    <BoxSectionExpander @click='toggleExpand' :expanded='expanded' ref='expander' />
  </BoxSection>
</template>

<script>

import BoxSection from '~/components/boxsection'
import BlowerControlSubSection from '~/components/blowercontrolsubsection'
import BoxSectionExpander from '~/components/boxsectionexpander'

export default {
  components: { BoxSection, BlowerControlSubSection, BoxSectionExpander, },
  data() {
    return {
      expanded: false,
    }
  },
  computed: {
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
  },
  mounted() {
    const controller = this.controller,
          boxid = this.$route.params.box
    this.$store.dispatch('controllers/load_box_param', {id: controller.broker_clientid.value, i: boxid, key: 'blower_day'})
    this.$store.dispatch('controllers/load_box_param', {id: controller.broker_clientid.value, i: boxid, key: 'blower_night'})
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

</style>
