<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        >添加SPU</el-button
      >
      <el-table :data="[]" border style="width: 100%; margin: 20px 0">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="SPU名称">
        </el-table-column>
        <el-table-column label="SPU描述"></el-table-column>
        <el-table-column label="操作" width="150">
          <template>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
            ></el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <el-button size="mini" type="info" icon="el-icon-info"></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SpuShowList",
};
</script>

<style lang="less" scoped>
</style>
