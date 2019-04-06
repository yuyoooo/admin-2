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
        <el-button type="success">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table
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
      <el-table-column>
        <el-switch v-model="value3">
        </el-switch>
      </el-table-column>
       <el-table-column label="操作">
        <template>
          <el-button
            size="mini"
            icon="el-icon-edit"
            type="primary"
            plain></el-button>
            <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            plain></el-button>
            <el-button
            size="mini"
            icon="el-icon-check"
            type="warning"
            plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="1"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import {getUserList} from '@/api/index'
export default {
  data () {
    return {
      userList: [],
      query: '',
      value3: '',
      total: 0,
      pagesize: 1,
      pagenum: 1
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
      getUserList({params: {query: this.query, pagenum: this.pagenum, pagesize: this.pagesize}}).then(res => {
        this.userList = res.data.users
        this.total = res.data.total
      })
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
