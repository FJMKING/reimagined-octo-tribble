<template>
  <div class="user">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        v-model="serachkey"
        class="input-with-select"
        style="width:300px"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchUsers"
        ></el-button>
      </el-input>
      <el-button
        type="success"
        plain
        @click="adddialogFormVisible=true"
      >添加用户</el-button>
    </div>
    <!-- 用户信息表格 -->
    <template>
      <el-table
        :data="userList"
        border
        style="width: 100%;margin-top: 15px;"
      >
        <el-table-column
          type="index"
          width="50"
        >
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
        >
        </el-table-column>

        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              content="编辑"
              placement="top"
            >
              <el-button
                type="primary"
                size="mini"
                @click="handleEdit(scope.row)"
                icon="el-icon-edit"
                plain
              ></el-button>
            </el-tooltip>
            <el-tooltip
              content="删除"
              placement="top"
            >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                icon="el-icon-delete"
                plain
              ></el-button>
            </el-tooltip>
            <el-tooltip
              content="分配权限"
              placement="top"
            >
              <el-button
                type="warning"
                size="mini"
                @click="changeRole(scope.row)"
                icon="el-icon-share"
                plain
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <el-pagination
      style="margin-top:15px;backgroundColor:pink"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 添加用户弹出框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="adddialogFormVisible"
    >
      <el-form
        :model="addform"
        label-width="100px"
        :rules="rules"
        ref="addform"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="addform.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="addform.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input
            v-model="addform.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="手机"
          prop="mobile"
        >
          <el-input
            v-model="addform.mobile"
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
          @click="addUser('addform')"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑信息 -->
    <el-dialog
      title="编辑用户"
      :visible.sync="editdialogFormVisible"
    >
      <el-form
        :model="editform"
        label-width="100px"
        :rules="rules"
        ref="editform"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="editform.username"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input
            v-model="editform.email"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="手机"
          prop="mobile"
        >
          <el-input
            v-model="editform.mobile"
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
          @click="editUser('editform')"
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog
      title="角色权限"
      :visible.sync="changedialogFormVisible"
    >
      <el-form
        :model="changeform"
        label-width="100px"
        :rules="rules"
        ref="changeform"
      >
        <el-form-item
          label="用户名"
          prop="username"
        >
          <el-input
            v-model="changeform.username"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <template>
            <el-select
              v-model="changeform.rid"
              placeholder="请选择"
            >
              <el-option
                v-for="item in roleslist"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </template>
            </el-form-item>

      </el-form>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="changedialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="changeRloes"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUserList, addUsers, editUsers, deleteUsersById, getRole, getUsersById, changeRole, changeUsersState } from '@/api'
export default {
  data () {
    return {
      roleslist: [],
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editform: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      changeform: {
        id: '',
        rid: '',
        username: ''
      },
      adddialogFormVisible: false,
      editdialogFormVisible: false,
      changedialogFormVisible: false,
      serachkey: '',
      mg_state: '',
      userList: [],
      total: 1,
      pagenum: 1,
      pagesize: 10,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur,change'
          }
        ],
        mobile: [{ required: true, message: '电话不能为空' }]
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    // 改变用户状态
    changeState (row) {
      console.log(row)
      changeUsersState(row.id, row.mg_state).then(results => {
        console.log(results)
        if (results.meta.status === 200) {
          this.$message.success('状态更改成功')
        } else {
          this.$message.error('状态更改失败')
        }
      })
    },
    // 分配角色
    changeRloes () {
      // console.log(this.changeform)
      changeRole(this.changeform).then(results => {
        // console.log(results)
        if (results.meta.status === 200) {
          this.changedialogFormVisible = false
          this.$message.success('权限设置成功')
          this.init()
        } else {
          this.$message.error('权限设置失败')
        }
      })
    },
    // 编辑用户
    editUser (formname) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          // console.log(this.editform)
          editUsers(this.editform).then(results => {
            if (results.meta.status === 200) {
              this.$message.success('编辑成功')
              this.editdialogFormVisible = false
              this.$refs[formname].resetFields()
              this.init()
            } else {
              this.$message.error('编辑失败')
            }
          })
        } else {
        }
      })
    },
    // 添加用户
    addUser (formname) {
      this.$refs[formname].validate(valid => {
        if (valid) {
          addUsers(this.addform).then(results => {
            // console.log(results)
            if (results.meta.status === 201) {
              this.$refs[formname].resetFields()
              this.$message({
                showClose: true,
                message: results.meta.msg,
                type: 'success'
              })
              this.adddialogFormVisible = false
              this.init()
            } else {
              this.$message({
                showClose: true,
                message: results.meta.msg,
                type: 'error'
              })
            }
          })
        } else {
          this.$message({
            showClose: true,
            message: '添加用户失败，数据输入有误',
            type: 'error'
          })
          return false
        }
      })
    },
    searchUsers () {
      getUserList({
        query: this.serachkey,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }).then(results => {
        // console.log(results)
        this.userList = results.data.users
        this.total = results.data.total
      })
    },
    init () {
      getUserList({
        query: this.serachkey,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }).then(results => {
        // console.log(results)
        this.userList = results.data.users
        this.total = results.data.total
      })
    },
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.init()
    },
    handleEdit (row) {
      // console.log(row)
      this.editdialogFormVisible = true
      this.editform.username = row.username
      this.editform.email = row.email
      this.editform.mobile = row.mobile
      this.editform.id = row.id
    },
    handleDelete (row) {
      console.log(row)
      deleteUsersById(row.id).then(results => {
        console.log(results)
        if (results.meta.status === 200) {
          this.$message.success('删除成功')
          this.init()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    changeRole (row) {
      this.changedialogFormVisible = true
      this.changeform.username = row.username
      this.changeform.id = row.id
      getRole().then(results => {
        if (results.meta.status === 200) {
          this.roleslist = results.data
          getUsersById(row.id).then(result => {
            console.log(result)
            if (result.meta.status === 200) {
              if (result.data.rid <= 0) {

              } else {
                this.changeform.rid = result.data.rid
              }
            }
          })
        }
      })
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
.user {
  .search-input {
    width: 300px;
  }
}
</style>
