<template>
  <div class="content-wrap">
    <div class="content-border">
      <Page />
    </div>
  </div>
</template>
<script>

import Page from '../components/Page.vue'
export default {
  components: { Page },
  props: {
    background: String
  },
  mounted: () => {
  }
}
</script>
<style>
.content-wrap {
  height: auto !important;
  position: absolute;
  width: 100%;
  top: 69px;
  bottom: 0;
}
main.page {
  min-height: 100%;
  height: 100%;
}
.content-pad {
  z-index: -1;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: fixed;
  background-size: cover;
  display: none;
}
.content-wrap h1, .content-wrap h2, .content-wrap h3, .content-wrap h4, .content-wrap h5 {
  margin: 0;
  padding: 1em;
}
.content-border {
  width: 100%;
  min-height: 100%;
  border-left: 5px white solid;
  border-right: 5px white solid;

  background: #ffffff;
}
div.content {
  padding: 5px 20px;
  line-height: 1.2em;
}
@media all and (min-width: 576px) {
  .content-pad {
    display: block;
  }
  .content-border {
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    top: 0;
  }
}
</style>
