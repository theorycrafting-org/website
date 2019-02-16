<template>
<div class="search-box">
  <input :class="{'search-box-open': isOpen}" v-bind:ref="'searchbox'"  @keyup.enter="go(focusIndex)" @keyup.up="onUp" @keyup="search" @keyup.down="onDown" @blur="toggleBlur" @focus="toggleFocus" v-model="query" type="text" placeholder="Search..." />
  <button class="icon" @click="performSearchButtonAction"><i class="fa fa-search"></i></button>
  <ul class="suggestions" :class="{'visible': suggestionsOpen}">
    <li v-for="(item, idx) in suggestions" :key="item.url"><a @mouseover="hoverTo(idx)" :class="{'suggestion-highlight': idx == focusIndex}" :href="item.url">{{item.title}}</a></li>
  </ul>
</div>
</template>
<script>

import queryIndex from '@dynamic/es';

export default {
  data () {
    return {
      query: '',
      focusIndex: null,
      isFocus: false,
      isOpen: false,
      suggestionsOpen: false,
      isMobile: false
    }
  },
  methods: {
    search() {
      if (this.showSuggestions && this.suggestions.length) {
        this.$set(this.$data, 'suggestionsOpen', true);
      }
    },
    hoverTo(idx) {
      this.focusIndex = idx;
    },
    onUp () {
      if (this.showSuggestions) {
        if (this.focusIndex > 0) {
          this.focusIndex--
        } else {
          this.focusIndex = this.suggestions.length - 1
        }
      }
    },
    onDown () {
      if (this.showSuggestions) {
        if (this.focusIndex < this.suggestions.length - 1) {
          this.focusIndex++
        } else {
          this.focusIndex = 0
        }
      }
    },
    toggleBlur (e) {
      if (this.$data.isMobile) {
        this.$set(this.$data, 'isOpen', false);
      }
      this.$set(this.$data, 'isFocus', false);
      
        this.$set(this.$data, 'suggestionsOpen', false);
    },
    toggleFocus (e) {
      this.$set(this.$data, 'isFocus', true);
    },
    go(idx) {
      this.$router.push(this.suggestions[idx].url);
    },
    performSearchButtonAction (e) {
      e.preventDefault();
      if (!this.$data.isOpen && this.$data.isMobile) {
        this.$set(this.$data, 'isOpen', true);
        this.$set(this.$data, 'isFocus', true);
        this.$refs['searchbox'].focus();
        return;
      }
      if (this.$refs['searchbox'].value.length < 1) return;
      // Actual search
      this.$router.push('/search?q='+encodeURIComponent(this.$refs['searchbox'].value));
    }
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.evt_resize);
  },
  computed: {
    showSuggestions () {
      return (
        this.isFocus &&
        this.suggestions &&
        this.suggestions.length
      )
    },
    suggestions () {
      const query = this.query;
      if (!query) {
        return
      }
      return queryIndex(query);
    }
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
  }
}

</script>
