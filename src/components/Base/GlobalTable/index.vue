<template>
  <div class="global-table" :style="{ height: tableContainerHeight }">
    <slot name="title" v-if="isTitle">
      <h4>查询列表</h4>
    </slot>
    <slot name="buttons" v-if="hasButtons">
      <div class="buttons">
        <el-button type="primary" icon="el-icon-plus">新 建</el-button>
      </div>
    </slot>
    <slot name="extra"></slot>
    <el-table
      ref="table"
      :header-cell-class-name="headercolor"
      :header-cell-style="colorCustomize ? tableRowClassName : () => {}"
      :[heightAttr]="tableHeight"
      :cell-style="columnStyle"
      size="medium"
      :stripe="stripe"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <slot name="selection"></slot>
      <el-table-column type="selection" width="55" v-if="selectable"> </el-table-column>
      <slot name="first-columns" />
      <template v-for="(item, index) in columns">
        <el-table-column
          v-if="item.actions && item.actions.length"
          :key="item.prop"
          :width="item.width"
          :fixed="item.fixed"
          :resizable="item.resizable || false"
          :min-width="item.minwidth"
          :sortable="item.sortable"
          :label="item.label"
          :column-key="'columnList_' + index"
        >
          <template v-slot="scope">
            <template v-for="(btnInfo, index) in item.actions">
              <template v-if="!(btnInfo.getHidden && btnInfo.getHidden({ ...scope }))">
                <el-button
                  :key="btnInfo.id"
                  type="text"
                  :disabled="btnInfo.disabled"
                  @click.stop="btnInfo.click({ ...scope })"
                  style="padding: 0"
                  >{{ btnInfo.text }}</el-button
                >
                <el-divider
                  direction="vertical"
                  :key="btnInfo.id"
                  v-if="index < item.actions.length - 1"
                ></el-divider>
              </template>
            </template>
          </template>
        </el-table-column>
        <!-- labelCustomize 是否开启单元格内容自定义，用 getLabel 回调传入，开启 labelIsHtml 可传入 html 结构-->
        <el-table-column
          v-else-if="item.labelCustomize"
          :key="item.prop"
          :width="item.width"
          :prop="item.prop"
          :fixed="item.fixed"
          :resizable="item.resizable || false"
          :show-overflow-tooltip="item.showTooltip === undefined ? true : item.showTooltip"
          :min-width="item.minwidth"
          :sortable="item.sortable"
          :label="item.label"
          :column-key="'columnList_' + index"
        >
          <template v-slot="scope">
            <div v-if="item.labelIsHtml" v-html="item.getLabel(scope.row || {})" />
            <template v-else-if="item.slot">
              <slot :name="item.prop" :row="scope.row"></slot>
            </template>
            <span v-else>{{
              item.getLabel(scope.row || {}, scope.$index, currentPage, pageSize)
            }}</span>
          </template>
        </el-table-column>
        <!--针对多级表头（暂时）-->
        <template v-else-if="item.children">
          <el-table-column :label="item.label" :key="item.prop" :align="item.align">
            <template v-for="child in item.children">
              <el-table-column
                v-if="child.labelCustomize"
                :key="child.prop"
                :width="child.width"
                :prop="child.prop"
                :fixed="child.fixed"
                :resizable="child.resizable || false"
                :show-overflow-tooltip="child.showTooltip === undefined ? true : child.showTooltip"
                :min-width="child.minwidth"
                :sortable="child.sortable"
                :label="child.label"
                :column-key="'columnList_' + index"
              >
                <template v-slot="scope">
                  <div v-if="child.labelIsHtml" v-html="child.getLabel(scope.row || {})" />
                  <template v-else-if="child.slot">
                    <slot :name="child.prop" :row="scope.row"></slot>
                  </template>
                  <span v-else>{{
                    child.getLabel(scope.row || {}, scope.$index, currentPage, pageSize)
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                v-else
                :key="child.prop"
                :width="child.width"
                :prop="child.prop"
                :fixed="child.fixed"
                :resizable="child.resizable || false"
                :show-overflow-tooltip="child.showTooltip === undefined ? true : child.showTooltip"
                :min-width="child.minwidth"
                :sortable="child.sortable"
                :label="child.label"
                :column-key="'columnList_' + index"
              >
              </el-table-column>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          v-else
          :key="item.prop"
          :width="item.width"
          :prop="item.prop"
          :class-name="item.customColumnClass"
          :fixed="item.fixed"
          :resizable="item.resizable || false"
          :show-overflow-tooltip="item.showTooltip === undefined ? true : item.showTooltip"
          :min-width="item.minwidth"
          :sortable="item.sortable"
          :label="item.label"
          :column-key="'columnList_' + index"
        >
        </el-table-column>
      </template>
      <slot name="last-columns" />
    </el-table>
    <div v-if="pagination" style="margin-top: 10px; text-align: right">
      <el-pagination
        v-if="canChangeSize"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
        @size-change="sizeChange"
        @current-change="currentChange"
      />
      <el-pagination
        v-else
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :page-count="total"
        background
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>

<script>
import { throttle } from 'lodash'

export default {
  name: 'GlobalTable',
  props: {
    /**
     * 字段列信息
     *  {
     *    label: '名称',
     *    prop: '字段属性',
     *  }
     *
     */
    columns: {
      type: Array,
      default: () => []
    },
    /**
     * 默认表格的高度是充满父容器的
     * 如果height 设置为 'auto',则表格高度将会根据内容自动撑起来
     */
    height: {
      type: [Number, String],
      default: 0
    },
    // 是否可分页
    pagination: {
      type: Boolean,
      default: true
    },
    stripe: {
      type: Boolean,
      default: true
    },
    currentPage: {
      type: [Number, String],
      default: 1
    },
    canChangeSize: {
      type: Boolean,
      default: true
    },
    pageSize: {
      type: [Number, String],
      default: 10
    },
    total: {
      type: [Number, String],
      default: 0
    },
    // 是否显示复选框
    selectable: {
      type: Boolean,
      default: true
    },
    // 头部栏的class名字，用于修改颜色等样式
    headercolor: {
      type: String,
      default: 'headercolor'
    },
    // 是否需要一个标题
    isTitle: {
      type: Boolean,
      default: false
    },
    colorCustomize: {
      type: Boolean,
      default: false
    },
    // 是否需要操作按钮
    hasButtons: {
      type: Boolean,
      default: true
    },
    selfCustomHeight: {
      type: Number,
      default: 0
    },
    // { columnIndex: 1, color: '#000' }
    customColumnBgColor: {
      type: Array,
      default: () => []
    },
    // 是否启用height. max_height适用于菜单，height适用于嵌套
    isHeight: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      innerHeight: 0
    }
  },
  computed: {
    heightAttr() {
      return this.isHeight ? 'height' : 'max-height'
    },
    // 计算表格区域高度
    tableHeight() {
      const { height, innerHeight } = this
      if (height) {
        let customHeight = height
        if (typeof customHeight === 'string') {
          if (customHeight.endsWith('px')) {
            customHeight = parseFloat(customHeight)
          }
        }
        if (typeof customHeight === 'number') {
          return customHeight
        }
        return customHeight
      }
      return innerHeight
    },
    tableContainerHeight() {
      const { height } = this
      if (height) {
        if (typeof height === 'number') {
          return `${height}px`
        }
        return height
      }
      return '100%'
    }
  },
  // 当表格所在页面存在keepalive时，需要在页面显示时重新布局表格
  activated() {
    this.doLayout()
  },
  mounted() {
    // 如果没有设置高度，则自动计算高度
    if (!this.height) {
      this.listenerResize()
    }
  },
  methods: {
    // 监听表格尺寸变化
    listenerResize() {
      const listenerResize = throttle(() => {
        const domBody = document.getElementsByClassName('app-wrapper')[0]
        const domSearch = document.getElementsByClassName('global-search')[0]
        const domBodyHeight = domBody && (domBody.clientHeight || '')
        const domSearchHeight = (domSearch && (domSearch.clientHeight || '')) || 0
        // eslint-disable-next-line
        this.innerHeight = domBodyHeight - domSearchHeight - 70 - 20 - 48 - 28 - 20 - 12 - 32 - 24 - this.selfCustomHeight
      }, 200)
      window.addEventListener('resize', listenerResize)
      // 渲染完成之后立即执行一次，保证不会出现滚动条
      this.$nextTick(() => {
        listenerResize()
      })
      // 销毁时候释放监听的事件
      this.$once('hook:beforeDestroy', () => {
        window.removeEventListener('resize', listenerResize)
      })
    },
    // 重新布局表格
    doLayout() {
      this.$refs.table.doLayout()
      this.listenerResize()
    },
    analyseFunProp(prop) {
      return typeof prop === 'function' ? prop() : prop
    },
    sizeChange(size) {
      this.$emit('handle-size-change', size)
    },
    currentChange(page) {
      this.$emit('handle-current-change', page)
    },
    columnStyle({ columnIndex }) {
      if (this.customColumnBgColor && this.customColumnBgColor.length) {
        for (let i = 0; i < this.customColumnBgColor.length; i++) {
          if (columnIndex == this.customColumnBgColor[i].columnIndex) {
            return `background: ${this.customColumnBgColor[i].color}`
          }
        }
      }
    },
    tableRowClassName({ column }) {
      let currentIndex = null
      if (column.columnKey && column.columnKey.includes('columnList_')) {
        currentIndex = column.columnKey.split('_')[1]
      }
      if (currentIndex !== null && this.columns[currentIndex] && this.columns[currentIndex].color)
        return `background: ${this.columns[currentIndex].color}`
      return ''
    }
  }
}
</script>

<style scoped lang="scss">
.global-table {
  padding: 24px 16px 28px 16px;
  background: $bgwhite;
  box-shadow: 0px 0px 24px 0px rgba(0, 0, 0, 0.08);
  .buttons {
    margin-bottom: 20px;
    text-align: left;
  }
}
</style>

<style lang="scss">
.el-table__empty-text {
  width: 100%;
  box-sizing: border-box;
}
.global-table th.headercolor {
  @include themeBgRgba(0.1);
  color: $wordcolor3;
}
</style>
