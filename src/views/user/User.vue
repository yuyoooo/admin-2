<template>
  <div class="user">
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-input placeholder="请输入内容" class="search-input" v-model="query" @keydown.native.enter="initList">
          <el-button slot="append" icon="el-icon-search" @click="initList"></el-button>
        </el-input>
        <el-button type="success" @click="addDialog = true">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="userList"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="changeUserState(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
       <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="primary"
            plain
            @click="showEditDialog(scope.row)"></el-button>
            <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            plain
            @click="deleteUser(scope.row)"></el-button>
            <el-button
            size="mini"
            icon="el-icon-check"
            type="warning"
            plain
            @click="showgrantDialog(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialog">
      <el-form :model="addForm"  label-width="80px" :rules="rules" ref="addUserRef">
        <el-form-item label="账号" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" autocomplete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit('addUserRef')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialog">
      <el-form :model="editForm"  label-width="80px" :rules="rules" ref="editUserRef">
        <el-form-item label="账号" prop="username">
          <el-input v-model="editForm.username" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUserSubmit('editUserRef')">确 定</el-button>
      </div>
    </el-dialog>
     <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="grantDialog">
      <el-form :model="grantForm"  label-width="120px">
        <el-form-item label="当前用户" prop="username">
          <el-tag type="info">{{grantForm.username}}</el-tag>
        </el-form-item>
        <el-form-item label="请选择角色">
          <el-select v-model="roleId" placeholder="请选择活动区域">
            <el-option
            v-for="(role, index) in rolesList"
            :key="index"
            :label="role.roleName"
            :value="role.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialog = false">取 消</el-button>
        <el-button type="primary" @click="grantUserSubmit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {getUserList, changeUserState, addUser, editUserById, editUser, deleteUserData, getRoleList, grandUserRole} from '@/api/index'
export default {
  data () {
    return {
      loading: false,
      userList: [],
      query: '',
      total: 0,
      pagesize: 10,
      pagenum: 1,
      addDialog: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editDialog: false,
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: 0
      },
      // 分配角色
      grantDialog: false,
      grantForm: {},
      rolesList: [],
      roleId: '',
      // 添加用户的表单验证
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
        ],
        mobile: [
          { required: true, message: '电话不能为空' }
        ]
      }
    }
  },
  created () {
    this.initList()
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.initList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.initList()
    },
    initList () {
      this.loading = true
      getUserList({params: {query: this.query, pagenum: this.pagenum, pagesize: this.pagesize}}).then(res => {
        this.userList = res.data.users
        this.total = res.data.total
        this.loading = false
      })
    },
    changeUserState (row) {
      changeUserState({uid: row.id, type: row.mg_state}).then(res => {
        if (res.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '修改用户状态成功'
          })
        } else {
          this.$message({
            type: 'warning',
            message: res.meta.msg
          })
        }
      })
    },
    addUserSubmit (formName) {
      this.$refs[formName].validate(valide => {
        if (valide) {
          addUser(this.addForm).then(res => {
            if (res.meta.status === 201) {
              this.$message({
                type: 'success',
                message: '创建用户成功'
              })
            }
            this.addDialog = false
            this.initList()
          })
        }
      })
    },
    showEditDialog (row) {
      this.editDialog = true
      editUserById(row.id).then(res => {
        if (res.meta.status === 200) {
          this.editForm.username = res.data.username
          this.editForm.email = res.data.email
          this.editForm.mobile = res.data.mobile
          this.editForm.id = res.data.id
        }
      })
    },
    editUserSubmit (formName) {
      this.$refs[formName].validate(valide => {
        if (valide) {
          editUser(this.editForm).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.editDialog = false
              this.initList()
            }
          })
        }
      })
    },
    // 删除用户
    deleteUser (row) {
      this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserData(row.id).then(res => {
          if (res.meta.status === 200) {
            this.initList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加身份
    showgrantDialog (row) {
      this.grantForm = row
      this.grantDialog = true
      getRoleList().then(res => {
        if (res.meta.status === 200) {
          this.rolesList = res.data
        }
      })
    },
    // 分配角色
    grantUserSubmit () {
      if (!this.roleId) {
        this.$message({
          type: 'warning',
          message: '角色不能为空，请选择'
        })
      } else {
        grandUserRole({id: this.grantForm.id, rid: this.roleId}).then(res => {
          if (res.meta.status === 200) {
            this.$message({
              type: 'success',
              message: '设置角色成功'
            })
            this.grantDialog = false
          } else {
            this.$message({
              type: 'error',
              message: '设置角色失败'
            })
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .user {
    .search-input {
      width: 300px;
    }
    .page {
      padding: 5px 0;
      background-color: #D3DCE6;
    }
  }
</style>
