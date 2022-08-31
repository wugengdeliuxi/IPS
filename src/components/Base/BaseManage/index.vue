<template>
  <div class="source">
    <global-search>
      <template #operate>
        搜索：
        <el-input
          placeholder="请输入字段名或code"
          style="width: 200px"
          v-model.trim="listQuery.mixed"
          clearable
          @keyup.enter.native="searchData"
        >
        </el-input>
        <el-button type="primary" @click="searchData" style="margin-left: 12px">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </template>
    </global-search>
    <global-table
      :selectable="false"
      v-loading="loading"
      :columns="columns"
      :data="tableData"
      :total="total"
      :current-page="listQuery.page"
      :page-size="listQuery.pageSize"
      @handle-current-change="currentChange"
      @handle-size-change="sizeChange"
      align="center"
    >
      <template v-slot:buttons>
        <div class="buttons">
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新 建</el-button>
        </div>
      </template>
      <template v-slot:last-columns>
        <el-table-column key="status" :width="200" prop="status" label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.state"
              @change="changeStatus(scope.row)"
              active-value="1"
              inactive-value="2"
            >
            </el-switch>
          </template>
        </el-table-column>
      </template>
    </global-table>
    <the-dialog
      v-if="visibleDialog"
      :title="tempMap[dialogStatus]"
      :edit-info="editInfo"
      :visible.sync="visibleDialog"
      @confirm-sure="handleConfirm"
      :dialog-status="dialogStatus"
      :type="type"
      :show-dsc="showDsc"
      :show-sort="showSort"
      v-bind="$attrs"
    >
    </the-dialog>
  </div>
</template>

<script>
import { getManageElements, changeManageElementStatus, deleteManageElement } from '@/api/case'
import { getMessage, changeMessageStatus, deleteMessage } from '@/api/message'

import TheDialog from './components/TheDialog'

export default {
  name: '',
  components: {
    TheDialog
  },
  props: {
    type: {
      // default: 1,
      required: true,
      type: Number
    },
    showDsc: {
      type: Boolean,
      default: false
    },
    showSort: {
      type: Boolean,
      default: false
    },
    tableColumns: {
      default: () => {
        return [
          {
            prop: 'id',
            label: '序号',
            labelCustomize: true,
            getLabel: (row, index, page, pageSize) => {
              return pageSize * (page - 1) + index + 1
            }
          },
          { prop: 'name', label: '字段名称' },
          { prop: 'code', label: '字段code' }
        ]
      }
    },
    customDetails: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      columns: [
        ...this.tableColumns,
        {
          label: '操作',
          width: 140,
          fixed: 'right',
          actions: [
            {
              id: 'detail',
              text: '详情',
              click: this.handleDetail
            },
            {
              id: 'edit',
              text: '编辑',
              click: this.handleEdit
            },
            {
              id: 'delete',
              text: '删除',
              click: this.handleDelete
            }
          ]
        }
      ],
      dialogStatus: 'create',
      tempMap: {
        create: '新建',
        update: '编辑',
        detail: '详情'
      },
      editInfo: {}, // 编辑带给弹框的值
      visibleDialog: false,
      tableData: [],
      total: 0,
      loading: false,
      listQuery: {
        pageSize: 10,
        page: 1,
        mixed: ''
      }
    }
  },
  computed: {},
  created() {
    this.fetchData()
  },
  methods: {
    // 数据
    fetchData() {
      this.loading = true
      const getApi = this.type == 14 ? getMessage : getManageElements
      getApi({ type: this.type, ...this.listQuery })
        .then((res) => {
          if (Object.keys(res.response).length > 0) {
            const response = res.response[0]
            this.tableData = response.data
            this.total = parseInt(response.count, 10)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 筛选
    searchData() {
      this.listQuery.page = 1
      this.fetchData()
    },
    // 新建
    handleCreate() {
      this.editInfo = {}
      this.dialogStatus = 'create'
      this.visibleDialog = true
    },
    // 编辑
    handleEdit({ row }) {
      this.editInfo = { ...row }
      this.dialogStatus = 'update'
      this.visibleDialog = true
    },
    // 详情
    handleDetail({ row }) {
      if (this.customDetails) {
        this.$router.push({ path: this.customDetails })
      } else {
        this.editInfo = { ...row }
        this.dialogStatus = 'detail'
        this.visibleDialog = true
      }
    },
    // 删除
    handleDelete({ row }) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const deleteApi = this.type == 14 ? deleteMessage : deleteManageElement
          deleteApi({ id: row.id }).then((res) => {
            console.log(res)
            if (res.status == 1) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              if (this.tableData.length == 1 && this.listQuery.page > 1) {
                // eslint-disable-next-line no-plusplus
                this.listQuery.page--
              }
              this.fetchData()
            } else {
              this.$message({
                type: 'error',
                message: res.errors.msg || '失败'
              })
            }
          })
        })
        .catch(() => {})
    },
    // 确定
    handleConfirm() {
      this.visibleDialog = false
      this.fetchData()
    },
    // 开关
    changeStatus(row) {
      const changeStatus = this.type == 14 ? changeMessageStatus : changeManageElementStatus
      changeStatus({ id: row.id })
        .then(() => {
          this.$message({
            message: '切换成功',
            type: 'success'
          })
        })
        .finally(() => {
          this.fetchData()
        })
    },
    // 重置
    handleReset() {
      this.listQuery = {
        type: this.type,
        pageSize: 10,
        page: 1,
        mixed: ''
      }
      this.fetchData()
    },
    // 分页
    currentChange(page) {
      this.listQuery.page = page
      this.fetchData()
    },
    // 分页
    sizeChange(size) {
      this.listQuery.pageSize = size
      this.listQuery.page = 1
      this.fetchData()
    }
  }
}
</script>

<style scoped></style>
