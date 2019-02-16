<template>
  <header class="navbar">
    <div class="nav-content">

      <router-link
        :to="$localePath"
        class="home-link"
      >
        <img
          class="logo"
          v-if="$site.themeConfig.logo"
          :src="$withBase($site.themeConfig.logo)"
          :alt="$siteTitle"
        >
        <span
          ref="siteName"
          class="site-name"
          v-if="$siteTitle"
          :class="{ 'can-hide': $site.themeConfig.logo }"
        >{{ $siteTitle }}</span>
      </router-link>
      <NavLinks />

      <SearchBox/>
    </div>
  </header>
</template>

<script>
import SearchBox from './SearchBox'
import NavLinks from './NavLinks.vue'

export default {
  components: { NavLinks, SearchBox },

  data () {
    return {
      linksWrapMaxWidth: null
    }
  },

  mounted () {
  },

  computed: {
  }
}

function css (el, property) {
  // NOTE: Known bug, will return 'auto' if style value is 'auto'
  const win = el.ownerDocument.defaultView
  // null means not to return pseudo styles
  return win.getComputedStyle(el, null)[property]
}
</script>
