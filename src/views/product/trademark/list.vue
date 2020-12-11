<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <el-table :data="tableData" border style="width: 100%; margin: 20px 0">
      <el-table-column prop="id" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="name" label="品牌名称"> </el-table-column>
      <el-table-column prop="logo" label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logo" class="trademark-logo" alt="" />
        </template>
      </el-table-column>
      <el-table-column prop="done" label="操作">
        <template>
          <el-button type="warning" size="small" icon="el-icon-edit"
            >修改</el-button
          >
          <el-button type="danger" size="small" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-sizes="[3, 6, 9]"
      :page-size="3"
      layout="prev, pager, next, jumper,sizes, total"
      :total="20"
      class="trademark-pagination"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      tableData: [
        {
          id: 1,
          name: "苹果",
          logo:
            "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1188455173,3499029465&fm=26&gp=0.jpg",
        },
      ],
    };
  },
};
</script>

<style lang="sass">
.trademark-logo
  width: 100px
.trademark-pagination
  text-align: right
.el-pagination__sizes
  margin-left: 250px
</style>
