<template>
    <div class="categories">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加商品分类 -->
    <el-button
      type="success"
      plain
      @click="showCate"
    >添加商品分类</el-button>
     <tree-grid
      :treeStructure="true"
      :columns="columns"
      :data-source="cateList"
      @deleteCate="deleteCategory"
      @editCate="editCategory"
    >
    </tree-grid>
       <!-- 添加分类弹框 -->
    <el-dialog
      title="添加分 类"
      :visible.sync="adddialogFormVisible"
    >
      <el-form
        :model="addform"
        :rules="rules"
        ref="addform"
        label-width="100px"
      >
        <el-form-item
          label="分类名称"
          prop="cat_name"
        >
          <el-input
            v-model="addform.cat_name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="父级描述"
          prop="roleDesc"
        >
            <el-cascader
    :options="cateListTwo"
    v-model="selectedOptions"
    @change="handleChange"
    :props="defaultCate"
    >
  </el-cascader>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="adddialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addCateSumit"
        >确 定</el-button>
      </div>
    </el-dialog>
    </div>
</template>
<script>
// 引入自定义组件
import TreeGrid from '@/components/TreeGrid/TreeGrid.vue'
// 导入api
import { getGoodsCategories, addCate } from '@/api'
export default{
  data () {
    return {
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]},
      defaultCate: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedOptions: [],
      adddialogFormVisible: false,
      cateListTwo: [],
      addform: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      cateList: [],
      columns: [
        {
          text: '分类名称',
          dataIndex: 'cat_name',
          width: ''
        },
        {
          text: '是否有效',
          dataIndex: 'cat_deleted',
          width: ''
        },
        {
          text: '层级',
          dataIndex: 'cat_level',
          width: ''
        }
      ]
    }
  },
  // 注入组件
  components: {
    TreeGrid: TreeGrid
  },
  mounted () {
    this.init(3)
  },
  methods: {
    init (type) {
      getGoodsCategories(type).then(res => {
      // console.log(res)
        this.cateList = res.data
      })
    },
    addCateSumit () {
      // console.log(111)
      addCate(this.addform).then(res => {
        // console.log(res)
        if (res.meta.status === 201) {
          this.$message.success('添加成功')
          this.adddialogFormVisible = false
          this.init(3)
        }
      })
    },
    handleChange (value) {
      if (value.length === 1) {
        this.addform.cat_pid = value[0]
        this.addform.cat_level = 1
      } else if (value.length === 2) {
        this.addform.cat_pid = value[1]
        this.addform.cat_level = 2
      }
    },
    // 弹出添加分类
    showCate () {
      this.adddialogFormVisible = true
      getGoodsCategories(2).then(res => {
        // console.log(res)
        this.cateListTwo = res.data
      })
    },
    deleteCategory () {},
    editCategory () {}
  }
}
</script>
 <style lang="scss" scoped>
  .el-breadcrumb {
  background-color: #f5f5f5;
  height: 45px;
  font-size: 15px;
  padding-left: 10px;
  line-height: 45px;
  margin-bottom: 15px;
}
 </style>
