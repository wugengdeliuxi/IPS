<template>
  <el-scrollbar wrap-class="scrollbar-wrapper" class="config-true">
    <slot name="title"></slot>
    <el-tree
      ref="tree"
      node-key="ext"
      default-expand-all
      icon-class="el-icon-arrow-right"
      :props="{ label: 'name' }"
      :indent="10"
      :highlight-current="true"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      :render-content="renderContent"
      @node-contextmenu="nodeContextmenu"
      v-bind="$attrs"
      v-on="$listeners"
    >
    </el-tree>
    <!--右键菜单-->
    <context-menu
      ref="rightMenu"
      class="right-menu"
      :x="x"
      :y="y"
      :show="contextMenuVisible"
      @update:show="(show) => (contextMenuVisible = show)"
    >
      <a href="javascript:;" @click="onNew">新建</a>
      <a href="javascript:;" @click="onEdit">编辑</a>
      <a href="javascript:;" @click="onDelete">删除</a>
    </context-menu>
  </el-scrollbar>
</template>

<script>
import ContextMenu from '@/components/ContextMenu'
import { getTreeId } from '@/utils/index'

export default {
  name: 'ConfigTree',
  components: {
    ContextMenu
  },
  props: {
    hasAppendBtn: {
      default: true,
      type: Boolean
    },
    hasRightContextMenu: {
      default: true,
      type: Boolean
    },
    appId: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      contextMenuVisible: false,
      x: null,
      y: null,
      currentNodeKey: ''
    }
  },
  mounted() {},
  methods: {
    append(e, data) {
      e.stopPropagation()
      const ext = new Date().getTime().toString()
      console.log(this.appId)
      const newChild = {
        ext,
        name: '菜单',
        category: '1',
        calcu: '2',
        use_type: '2',
        display_type: '0',
        icon: '',
        app_id: this.appId
      }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d) => d.ext === data.ext)
      children.splice(index, 1)
    },
    renderContent(h, { node, data }) {
      return (
        <span class="custom-tree-node">
          <span>
            {data.icon && (
              <svg-icon
                icon-class={data.icon}
                style="margin-right: 10px; margin-left:5px; color: #5b5bd5"
              />
            )}
            {node.label}
          </span>
          {this.hasAppendBtn && (
            <span>
              <el-button
                size="mini"
                icon="el-icon-plus"
                type="text"
                on-click={(e) => this.append(e, data)}
              ></el-button>
            </span>
          )}
        </span>
      )
    },
    // 右击唤起菜单
    async nodeContextmenu(e, data, node) {
      if (!this.hasRightContextMenu) {
        return
      }
      this.contextMenuVisible = true
      this.x = e.clientX
      this.y = e.clientY
      this.rightNode = node
      // 到底判断
      const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
      if (this.y + 86 > clientHeight) {
        this.y = clientHeight - 86
      }
    },
    // 右键的新建
    onNew() {
      const data = this.rightNode.data
      const ext = new Date().getTime().toString()
      const newChild = {
        ext,
        name: '菜单',
        category: '1',
        calcu: '2',
        use_type: '2',
        display_type: '0',
        icon: '',
        app_id: this.appId
      }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
      this.contextMenuVisible = false
    },
    // 右键的编辑
    onEdit() {
      this.$emit('update:currentNodeKey', this.rightNode.data.ext)
      this.contextMenuVisible = false
    },
    // 右键的删除
    onDelete() {
      const tree = this.$refs.tree
      const currentKey = tree.getCurrentKey()
      console.log(this.rightNode)
      tree.remove(this.rightNode)
      if (this.rightNode.data.ext === currentKey) {
        this.$emit('update:currentNodeKey', null)
      } else if (
        this.rightNode.data.children &&
        getTreeId(this.rightNode.data.children, currentKey)
      ) {
        this.$emit('update:currentNodeKey', null)
      }
      this.contextMenuVisible = false
    },
    handleDragStart(node) {
      console.log('drag start', node)
    },
    handleDragEnter(draggingNode, dropNode) {
      console.log('tree drag enter: ', dropNode.label)
    },
    handleDragLeave(draggingNode, dropNode) {
      console.log('tree drag leave: ', dropNode.label)
    },
    handleDragOver(draggingNode, dropNode) {
      console.log('tree drag over: ', dropNode.label)
    },
    handleDragEnd(draggingNode, dropNode, dropType) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType)
    },
    handleDrop(draggingNode, dropNode, dropType) {
      console.log('tree drop: ', dropNode.label, dropType)
    },
    allowDrop() {
      return true
    },
    allowDrag() {
      return true
    }
  }
}
</script>

<style scoped lang="scss">
.right-menu {
  position: fixed;
  background: #fff;
  border: solid 1px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  z-index: 999;
  display: none;
}
.right-menu a {
  font-size: 14px;
  width: 75px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  display: block;
  color: $wordcolor3;
}
.right-menu a:hover {
  background: rgba($blue, 0.2);
  color: $blue;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.icon {
  margin-right: 16px;
}
</style>
<style lang="scss">
.config-true .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.config-true .scrollbar-wrapper {
  overflow-x: hidden !important;
}
.config-true .el-scrollbar__wrap {
  overflow: scroll;
  height: 100%;
}
.config-true .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background: rgba($blue, 0.2);
  color: $blue;
}
.config-true .el-tree-node__content {
  height: 46px;
  line-height: 46px;
}
.config-true .el-tree-node__expand-icon {
  color: $blue;
}
.config-true .el-tree-node__expand-icon.is-leaf {
  color: transparent;
  cursor: default;
}
</style>
