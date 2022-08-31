<template>
  <div class="dialog-new">
    <global-dialog
      v-bind="$attrs"
      v-on="$listeners"
      v-loading="loading"
      @confirm="handleConfirm"
      @cancel="$emit('update:visible', false)"
      :show-footer="!disabled"
    >
      <el-form ref="form" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="字段名称" prop="name">
          <el-input
            v-model.trim="form.name"
            :disabled="disabled"
            type="input"
            placeholder="请输入字段名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="字段code" prop="codeId">
          <el-input
            v-model.trim="form.code"
            disabled
            type="input"
            placeholder="自动生成，无需输入"
            clearable
          />
        </el-form-item>
        <el-form-item
          label="标签"
          prop="ext"
          v-if="hasOwn(configForm, 'ext') && type == 12"
          :rules="[{ required: true, message: '请选择标签', trigger: 'change' }]"
        >
          <el-select
            v-model="form.ext"
            placeholder="请选择"
            :disabled="disabled"
            style="width: 100%"
          >
            <el-option
              v-for="item in $attrs.labelList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="模板类型" prop="tmp_type" v-if="hasOwn(configForm, 'tmp_type')">
          <el-select
            style="width: 100%"
            v-model="form.tmp_type"
            placeholder="请选择"
            :disabled="disabled"
            multiple
            clearable
          >
            <el-option
              v-for="item in $attrs.temTypeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="role" v-if="hasOwn(configForm, 'role')">
          <el-select
            style="width: 100%"
            v-model="form.role"
            placeholder="请选择"
            :disabled="disabled"
            multiple
            collapse-tags
            clearable
          >
            <el-option
              v-for="item in $attrs.roleList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板内容" prop="content" v-if="hasOwn(configForm, 'content')">
          <mess-content
            v-model="form.content"
            :disabled="disabled"
            :keywordsList="$attrs.keywordsList"
            :ext.sync="form.ext"
          ></mess-content>
        </el-form-item>
        <el-form-item label="字段配置" prop="ext" required v-if="showSort" :rules="[{ required: true, message: '请输入字段配置', trigger: 'change' }]">
          <el-input
            v-model.trim="form.ext"
            type="input"
            :disabled="disabled"
            placeholder="请输入字段配置"
            clearable
            maxlength="100"
          />
        </el-form-item>
        <el-form-item label="用户备注" prop="description" v-if="showDsc">
          <el-input
            v-model.trim="form.description"
            type="input"
            :disabled="disabled"
            placeholder="请输入描述"
            clearable
            maxlength="100"
          />
        </el-form-item>
      </el-form>
    </global-dialog>
  </div>
</template>

<script>
import { createManageElement, editManageElementItem } from '@/api/case'
import { createMessage, editMessage } from '@/api/message'
import messContent from '@/views/message-template/components/messContent'

export default {
  name: '',
  components: {
    messContent
  },
  props: {
    editInfo: {
      type: Object,
      default: () => {}
    },
    dialogStatus: {
      type: String,
      default: () => {}
    },
    type: {
      type: Number,
      default: 1
    },
    showDsc: {
      type: Boolean,
      default: false
    },
    showSort: {
      type: Boolean,
      default: false
    },
    configForm: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    disabled() {
      return this.dialogStatus == 'detail'
    }
  },
  data() {
    const validateContent = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入模板内容'))
      } else if (value.length > 500) {
        callback(new Error('模板内容不能超过300字'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      form: {},
      rules: {
        name: [{ required: true, message: '请输入字段名称', trigger: 'change' }],
        // ext: [{ required: true, message: '请选择标签', trigger: 'change' }],
        tmp_type: [{ required: true, message: '请选择模板类型', trigger: 'change' }],
        content: [{ validator: validateContent, trigger: 'change', required: true }],
        role: [{ required: true, message: '请输入模板内容', trigger: 'change' }]
      },
      defaultForm: {
        name: '',
        type: this.type
      }
    }
  },
  created() {
    this.initForm()
  },
  methods: {
    initForm() {
      if (this.dialogStatus == 'update' || this.dialogStatus == 'detail') {
        this.form = this.formParams(this.editInfo)
      } else {
        this.form = this.formParams()
      }
    },
    formParams(args = {}) {
      if (this.showDsc) Reflect.defineProperty(this.defaultForm, 'description', { value: '' })
      return { ...this.defaultForm, ...this.configForm, ...args }
    },
    // 确定按钮
    handleConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // eslint-disable-next-line no-unused-expressions
          this.dialogStatus == 'create' ? this.createData() : this.updateData()
        } else {
          this.$message({
            type: 'warning',
            message: '有必填参数未填写完毕！'
          })
        }
      })
    },
    // 新建
    createData() {
      const params = this.formParams(this.form)
      console.log('参数', params)
      this.loading = true
      const createApi = this.type == 14 ? createMessage : createManageElement
      createApi(params)
        .then(() => {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.$emit('confirm-sure')
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 更新
    updateData() {
      const params = this.formParams(this.form)
      this.loading = true
      const editApi = this.type == 14 ? editMessage : editManageElementItem
      editApi(params)
        .then(() => {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          this.$emit('confirm-sure')
        })
        .finally(() => {
          this.loading = false
        })
    },
    hasOwn(obj = {}, key) {
      return Reflect.has(obj, key)
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-new {
  .add-parameters-btn {
    color: $blue;
    text-decoration: underline;
  }
  .add-params-item {
    display: flex;
    position: relative;
    margin-top: 20px;
    .add-index {
      position: absolute;
      left: -28px;
      top: 4px;
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      background: $blue;
      color: $white;
      border-radius: 100%;
    }
  }
}
</style>
