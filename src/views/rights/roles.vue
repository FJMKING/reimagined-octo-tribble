<template>
  <div class="role">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加角色 -->
    <el-button
      type="success"
      plain
      @click="addRole"
    >添加角色</el-button>
    <!-- 角色信息 -->
    <template>
      <el-table
        :data="rolesList"
        border
        style="width: 100%;margin-top:15px"
      >
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="first in scope.row.children"
              :key="first.id"
            >
              <el-col :span="4">
                <div class="grid-content bg-purple">
                  <el-tag
                    closable
                    type="success"
                    @close="deletePower(scope.row,first.id)"
                  >
                    {{first.authName}}
                  </el-tag>
                </div>
              </el-col>
              <el-col :span="20">
                <div class="grid-content bg-purple-light">
                  <el-row
                    v-for="second in first.children"
                    :key="second.id"
                  >
                    <el-col :span="4">
                      <div class="grid-content bg-purple">
                        <el-tag
                          closable
                          type="info"
                          @close="deletePower(scope.row,second.id)"
                        >
                          {{second.authName}}
                        </el-tag>
                      </div>
                    </el-col>
                    <el-col :span="20">
                      <div class="grid-content bg-purple-light">
                        <el-tag
                          v-for="third in second.children"
                          :key="third.id"
                          closable
                          type="warning"
                          @close="deletePower(scope.row,third.id)"
                        >
                          {{third.authName}}
                        </el-tag>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          width="50"
        >
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="500"
        >
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="描述"
          width="500"
        >
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              content="编辑"
              placement="top"
            >
              <el-button
                size="mini"
                @click="handleEdit(scope.row)"
                icon="el-icon-edit"
                type="primary"
                plain
              ></el-button>
            </el-tooltip>
            <el-tooltip
              content="删除"
              placement="top"
            >
              <el-button
                size="mini"
                @click="handleDelete(scope.row)"
                icon="el-icon-delete"
                plain
                type="primary"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              content="分配权限"
              placement="top"
            >
              <el-button
                size="mini"
                @click="givePower(scope.row)"
                icon="el-icon-check"
                type="primary"
                plain
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>

      </el-table>
    </template>
    <!-- 添加角色弹窗 -->
    <el-dialog
      title="添加角色"
      :visible.sync="adddialogFormVisible"
    >
      <el-form
        :model="addform"
        :rules="rules"
        ref="addform"
        label-width="100px"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input
            v-model="addform.roleName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="roleDesc"
        >
          <el-input
            v-model="addform.roleDesc"
            autocomplete="off"
          ></el-input>
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="adddialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addRoleSumit"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑角色弹框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editdialogFormVisible"
    >
      <el-form
        :model="editform"
        :rules="rules"
        ref="editform"
        label-width="100px"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input
            v-model="editform.roleName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="角色描述"
          prop="roleDesc"
        >
          <el-input
            v-model="editform.roleDesc"
            autocomplete="off"
          ></el-input>
        </el-form-item>

      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="editdialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="editRoleSumit"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 授权角色 -->
    <el-dialog
      title="分配权限"
      :visible.sync="sharedialogFormVisible"
    >
      <el-tree
        ref="tree"
        :data="powerList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="selctNode"
        :props="defaultProps"
      >
      </el-tree>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="sharedialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="shareSumbit"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import {
  getRole,
  addRoles,
  deleteRoles,
  editRoles,
  getRights,
  giveRoles,
  deleteRolesById
} from '@/api'
export default {
  data () {
    return {
      powerList: [],
      rid: '',
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      selctNode: [],
      rolesList: [],
      adddialogFormVisible: false,
      editdialogFormVisible: false,
      sharedialogFormVisible: false,
      addform: {
        roleName: '',
        roleDesc: ''
      },
      editform: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入描述名称', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 删除角色权限
    deletePower (row, id) {
      deleteRolesById(row.id, id).then(results => {
        // console.log(results)
        if (results.meta.status === 200) {
          this.$message.success('取消权限成功')
          row.children = results.data
        } else {
          this.$message.error('取消权限失败')
        }
      })
    },
    // 授予权限
    shareSumbit () {
      // 获取被选中的节点
      var selectNodes = this.$refs.tree.getCheckedNodes()
      // 遍历被选中的节点，返回一个数组
      var nodes = selectNodes.map((value, index) => {
        return value.id + ',' + value.pid
      })
      // console.log(nodes)
      // 将数组转换为字符串
      var joinStr = nodes.join(',')
      // console.log(joinStr)
      // 去重复
      var set = new Set(joinStr.split(','))
      // console.log(set)
      // 将set对象的成员转换为数组
      var findVal = Array.from(set)
      // console.log(findVal)
      // 将数组转换为字符串，用，连接
      var findStr = findVal.join(',')
      // console.log(findStr)
      giveRoles(this.rid, findStr).then(results => {
        // console.log(results)
        if (results.meta.status === 200) {
          this.$message.success('授予权限成功')
          this.sharedialogFormVisible = false
          this.init()
        } else {
          this.$message.error('授予权限失败')
        }
      })
    },
    // 编辑角色
    editRoleSumit () {
      editRoles(this.editform).then(results => {
        if (results.meta.status === 200) {
          this.$message.success('编辑角色成功')
          this.editdialogFormVisible = false
          this.init()
        } else {
          this.$message.error('编辑角色失败')
        }
      })
    },
    // 确认添加角色
    addRoleSumit () {
      //   console.log(this.addform)
      addRoles(this.addform).then(results => {
        // console.log(results)
        if (results.meta.status === 201) {
          this.adddialogFormVisible = false
          this.$message.success('添加角色成功')
          this.init()
        } else {
          this.$message.error('添加角色失败')
        }
      })
    },
    // 添加角色
    addRole () {
      this.adddialogFormVisible = true
    },
    // 查询角色列表
    init () {
      getRole().then(results => {
        if (results.meta.status === 200) {
          console.log(results)
          this.rolesList = results.data
        }
      })
    },
    handleEdit (row) {
      console.log(row)
      this.editdialogFormVisible = true
      this.editform.roleName = row.roleName
      this.editform.roleDesc = row.roleDesc
      this.editform.id = row.id
    },
    handleDelete (row) {
      // console.log(row)
      deleteRoles(row.id).then(results => {
        // console.log(results)
        if (results.meta.status === 200) {
          this.$message.success('删除角色成功')
          this.init()
        } else {
          this.$message.success('删除角色失败')
        }
      })
    },
    givePower (row) {
      this.sharedialogFormVisible = true
      // 异步渲染 延时器
      setTimeout(() => {
        this.rid = row.id
        // 获取所有权限列表
        getRights('tree').then(results => {
          // console.log(results.data)
          this.powerList = results.data
        })
        // console.log(this)
        // console.log(this.$refs)
        // 清除默认选择节点
        // 获取当前角色的所有权限
        this.$refs.tree.setCheckedKeys([])
        getRole(row).then(result => {
          row.children.forEach((first, index) => {
            if (first.children && first.children.length > 0) {
              first.children.forEach((second, index) => {
                if (second.children && second.children.length > 0) {
                  second.children.forEach((third, index) => {
                    this.selctNode.push(third.id)
                  })
                }
              })
            }
          })
          // console.log(' this.selctNode---------------->', this.selctNode)
        })
      }, 10)
    }
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
.el-tree {
  overflow: auto;
  height: 400px;
}
.el-tag {
  margin: 5px;
}
</style>
