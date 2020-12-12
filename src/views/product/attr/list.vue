<template>
  <div>
    <Category></Category>
    <el-card style="margin-top: 20px">
      <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
      <el-table
        :data="attributeList"
        border
        style="width: 100%; margin: 20px 0"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="tmName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column prop="logoUrl" label="属性值列表"> </el-table-column>
        <el-table-column prop="done" label="操作" width="150">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Category from "./category"
export default {
  name: "AttrList",
  data() {
    return {
      attributeList: [],
    };
  },
  components: {
    Category,
  },
};
</script>
