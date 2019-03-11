<!--左侧列表内容   -->
<template>
  <div class="sidebar-container" :class="{'is-active':isCollapse}">
    <logo :isCollapse="isCollapse"></logo>
    <el-menu unique-opened :default-active="nowTagValue" class="el-menu-vertical-demo" mode="vertical" :show-timeout="200" background-color="#00142a"
             text-color="hsla(0,0%,100%,.65)" active-text-color="#409eff" :collapse="isCollapse">
      <sidebar-item :menu="menu" :isCollapse="isCollapse"></sidebar-item>
    </el-menu>
  </div>
</template>

<script>
  import {setUrlPath} from "@/utils/util";
  import {mapGetters} from "vuex";
  import SidebarItem from "./sidebarItem";
  import logo from "./logo";
  import {validateNull} from "@/utils/validate";
  import {initMenu} from "@/utils/util";

  export default {
    name: "sidebar",
    components: {SidebarItem, logo},
    data() {
      return {};
    },
    created() {
      if (validateNull(this.menu)) {
        this.$store.dispatch("GetMenu").then(data => {
          initMenu(this.$router, data);
        });
      }
    },
    computed: {
      ...mapGetters(["menu", "tag", "isCollapse"]),
      nowTagValue: function () {
        return setUrlPath(this.$route);
      }
    },
    mounted() {
    },
    methods: {}
  };
</script>
<style lang="scss" scoped>
</style>

