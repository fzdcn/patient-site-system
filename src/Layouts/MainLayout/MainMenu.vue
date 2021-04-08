<template>
  <div class="main-menu-container">
    <Menu class="main-menu-wrap" ref="side_menu" :active-name="activeName" :open-names="openName" @on-select="handleSelect" width="200px">
      <MenuItem v-if="menuRouteName === 'projectRouters'" name="goBack" :to="{name: 'project'}"><i class="iconfont iconfanhui"></i> 返回首页</MenuItem>
      <template v-for="menu in menuList">
        <Submenu v-if="menu.children" :name="menu.name" :key="menu.name">
          <template slot="title">
            <i v-if="menu.meta.icon" :class="menu.meta.icon"></i>
            {{ menu.title}}
          </template>
          <MenuItem v-for="child in menu.children" :key="child.name" :name="child.name" :to="{name: child.name}"> <i v-if="child.meta.icon" :class="child.meta.icon"></i>{{child.title}}
          </MenuItem>
        </Submenu>
        <MenuItem v-else :name="menu.name" :key="menu.name" :to="{name: menu.name}">
        <i :class="menu.meta.icon"></i> {{menu.title}}
        </MenuItem>
      </template>
    </Menu>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import store from '@/store'

export default {
  name: 'MainMenu',
  data() {
    return {
      keepAliveArr: [],
      activeName: '',
      openName: [],
    }
  },
  computed: {
    ...mapState('permission', ['menuList', 'menuRouteName']),
    /* openName() {
      let parentName = '';
      this.menuList.forEach((item) => {
        if (item.name === this.routeName) {
          parentName = item.name;
          return false;
        }
        if (item.children) {
          const childIndex = item.children.findIndex(child => child.name === this.routeName);
          if (childIndex > -1) {
            parentName = item.name;
            return false;
          }
        }
        return true;
      });
      console.log('eee', parentName);
      return parentName;
    }, */
    routeName() {
      return this.$route.name
    },
  },
  watch: {
    routeName(val) {
      const name = val.split('.')[0]
      this.activeName = name
      this.setOpenName()
    },
    menuRouteName() {
      this.menuUpdate()
    },
    menuList(list) {
      if (this.$route.name === 'Index' && list.length) {
        this.$router.replace({
          path: this.menuList[0].path,
        })
      }
    },
  },
  methods: {
    handleSelect(name) {
      if (name === 'goBack') {
        store.commit('permission/setKeepAlive', ['project'])
        return
      }
      if (name.includes('project')) {
        store.commit('permission/setKeepAlive', [...new Set(['project', name])])
      } else {
        store.commit('permission/setKeepAlive', [name])
      }
    },
    menuUpdate() {
      this.$nextTick(() => {
        // 更新菜单高亮得名字
        this.$refs.side_menu.updateOpened()
        this.$refs.side_menu.updateActiveName()
      })
    },
    setOpenName() {
      this.menuList.forEach((item) => {
        if (item.name === this.activeName) {
          this.openName = [item.name]
          return false
        }
        if (item.children) {
          const childIndex = item.children.findIndex(
            (child) => child.name === this.activeName
          )
          if (childIndex > -1) {
            this.openName = [item.name]
            return false
          }
        }
        return true
      })
    },
  },
  mounted() {
    this.menuUpdate()
    const name = this.routeName.split('.')[0]
    this.handleSelect(name)
    this.activeName = name
    this.setOpenName()
    if (this.$route.name === 'Index' && this.menuList.length) {
      this.$router.replace({
        path: this.menuList[0].path,
      })
    }
  },
}
</script>

<style lang="less">
.main-menu-container {
  overflow: hidden;
  position: relative;
  width: 189px;
  .main-menu-wrap {
    height: 100%;
    position: absolute;
    overflow-y: scroll;
    .iconfont {
      font-size: 24px;
      display: inline-block;
      vertical-align: middle;
    }
    .ivu-menu-item,
    .ivu-menu-submenu-title {
      padding: 10px 24px;
      font-size: 14px;
    }
  }
}
</style>
