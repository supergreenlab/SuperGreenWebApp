<template>
  <BoxSection
    icon='section-remotecamera.svg'
    title='Remote camera'
    color='#73C253'
    link='Checkout the HowTo build here'
    linkurl='https://github.com/supergreenlab/SuperGreenLive'>
  <BoxSubSection 
    icon='subsection-remotecamera-liveview.svg'
    title='Live view'>
      <div :id='$style.body'>
        <BoxLiveview />
      </div>
      <a :id='$style.ismyweedok' href=''>Is my weed ok ?</a>
    </BoxSubSection>
  </BoxSection>
</template>

<script>

import BoxSection from '~/components/boxsection'
import BoxSubSection from '~/components/boxsubsection'
import BlowerControlSubSection from '~/components/blowercontrolsubsection'
import BoxLiveview from '~/components/boxliveview'

export default {
  components: { BoxSection, BoxSubSection, BoxLiveview, },
}

</script>

<style module lang=stylus>

#body
  display: flex
  flex: 1
  width: 100%

#ismyweedok
  display: block
  text-align: right

</style>
