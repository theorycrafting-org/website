<template>
  <div class="nav-link-container" :class="{ 'responsive-nav-container': isMobile, 'responsive-nav-open': isOpen }">
    <div class="responsive-toggle">
      <button @click="toggleResponsiveMenu" class="menu-open">V</button>
    </div>
    <nav
      class="nav-links"
      v-if="userLinks.length || repoLink"
    >
      <ul>
        <li
          class="nav-item"
          v-for="item in userLinks"
          :key="item.link"
        >
          <DropdownLink
            v-if="item.type === 'links'"
            :item="item"
          />
          <NavLink
            v-else
            :item="item"
          />
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import DropdownLink from './DropdownLink.vue'
import { resolveNavLinkItem } from '../util'
import NavLink from './NavLink.vue'

export default {

  data: () => ({
    isMobile: false,
    isOpen: false
  }),

  beforeDestroy() {
    window.removeEventListener('resize', this.evt_resize);
  },

  mounted() {
    const handleWidth = () => {
      if (document.documentElement.clientWidth < 576 && this.$data.isMobile == false) {
        this.$set(this.$data, 'isMobile', true);
      }
      if (document.documentElement.clientWidth > 576 && this.$data.isMobile == true) {
        this.$set(this.$data, 'isMobile', false);
      }
    };
    handleWidth();
    window.addEventListener('resize', handleWidth, false);
  },

  components: { NavLink, DropdownLink },

  methods: {
    toggleResponsiveMenu(e) {
      e.preventDefault();
      if (!this.$data.isMobile) return;
      this.$set(this.$data, "isOpen", !this.$data.isOpen);
    }
  },
  computed: {
    userNav () {
      return this.$themeLocaleConfig.nav || this.$site.themeConfig.nav || []
    },

    nav () {
      const { locales } = this.$site
      if (locales && Object.keys(locales).length > 1) {
        const currentLink = this.$page.path
        const routes = this.$router.options.routes
        const themeLocales = this.$site.themeConfig.locales || {}
        const languageDropdown = {
          text: this.$themeLocaleConfig.selectText || 'Languages',
          items: Object.keys(locales).map(path => {
            const locale = locales[path]
            const text = themeLocales[path] && themeLocales[path].label || locale.lang
            let link
            // Stay on the current page
            if (locale.lang === this.$lang) {
              link = currentLink
            } else {
              // Try to stay on the same page
              link = currentLink.replace(this.$localeConfig.path, path)
              // fallback to homepage
              if (!routes.some(route => route.path === link)) {
                link = path
              }
            }
            return { text, link }
          })
        }
        return [...this.userNav, languageDropdown]
      }
      return this.userNav
    },

    userLinks () {
      return (this.nav || []).map(link => {
        return Object.assign(resolveNavLinkItem(link), {
          items: (link.items || []).map(resolveNavLinkItem)
        })
      })
    },

    repoLink () {
      const { repo } = this.$site.themeConfig
      if (repo) {
        return /^https?:/.test(repo)
          ? repo
          : `https://github.com/${repo}`
      }
    },

    repoLabel () {
      if (!this.repoLink) return
      if (this.$site.themeConfig.repoLabel) {
        return this.$site.themeConfig.repoLabel
      }

      const repoHost = this.repoLink.match(/^https?:\/\/[^/]+/)[0]
      const platforms = ['GitHub', 'GitLab', 'Bitbucket']
      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i]
        if (new RegExp(platform, 'i').test(repoHost)) {
          return platform
        }
      }

      return 'Source'
    }
  }
}
</script>
