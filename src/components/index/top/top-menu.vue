<template>
  <div class="pull-auto top-menu">
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      active-text-color="#ffffff"
      text-color="#000000"
    >
      <template v-for="(item,index) in items">
        <el-menu-item
          class="back-home-btn"
          :index="item.parentId+''"
          @click.native="openMenu(item)"
          :key="index"
        >{{item.label}}</el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { resolveUrlPath } from "@/utils/util";
import { mapState, mapGetters } from "vuex";
export default {
  name: "top-menu",
  data() {
    return {
      activeIndex: "0",
      items: [
        {
          label: "",
          href: "/home",
          parentId: 0
        }
      ]
    };
  },
  created() {},
  computed: {
    ...mapGetters(["tagCurrent", "menu"])
  },
  methods: {
    openMenu(item) {
      this.$store.dispatch("GetMenu", item.parentId).then(data => {
        let itemActive,
          childItemActive = 0;
        if (item.href) {
          itemActive = item;
        } else {
          if (this.menu[childItemActive].length == 0) {
            itemActive = this.menu[childItemActive];
          } else {
            itemActive = this.menu[childItemActive].children[childItemActive];
          }
        }
        this.$router.push({
          path: resolveUrlPath(itemActive.href, itemActive.label)
        });
      });
    }
  }
};
</script>

<style scoped="scoped" lang="scss">
.top-menu {
  margin-top: -4px;
  box-sizing: border-box;
}
.back-home-btn{
  color: black !important;
}
.back-home-btn:hover{
  color: #409eff !important;
}
</style>
