<template>
  <div class="top">
    <div class="top-button is-left">
      <div class="tags-breadcrumb">
        <i
          class="icon-navicon tag-collapse"
          :class="[{ 'tag-collapse_right': isCollapse }]"
          @click="showCollapse"
        ></i>
      </div>
    </div>
    <h1 class="top-title">
      <topMenu></topMenu>
    </h1>
    <div class="top-button is-right">
      <!-- <el-tooltip class="item" effect="dark" placement="bottom"> -->
        <img class="top-userImg" :src="userInfo.avatar">
      <!-- </el-tooltip> -->
      <el-dropdown>
        <span class="el-dropdown-link">
          {{userInfo.displayName?userInfo.displayName:userInfo.loginName}}
          <i
            class="el-icon-arrow-down el-icon--right"
          ></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <router-link to="/info/index">修改信息</router-link>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout" divided>退出系统</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
// import { fullscreenToggel, listenfullscreen } from "@/utils/util";
import topMenu from "./top-menu";
export default {
  components: { topMenu },
  name: "top",
  data() {
    return {};
  },
  filters: {},
  created() {},
  mounted() {
    // listenfullscreen(this.setScreen);
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    ...mapGetters(["isCollapse"])
  },
  methods: {
    showCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
    handleScreen() {
      // fullscreenToggel();
    },
    setScreen() {
      // this.$store.commit("SET_FULLSCREN");
    },
    logout() {
      this.$confirm("是否退出系统?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          this.$router.push({ path: "/login" });
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

