<template>
  <div>
    <el-card>
    <el-table :data="skuDataList" border stripe style="width: 100%">
      <el-table-column label="序号" width="80" type="index" align="center"> </el-table-column>
      <el-table-column prop="skuName" label="名称"></el-table-column>
      <el-table-column prop="skuDesc" label="描述"> </el-table-column>
      <el-table-column prop="skuDefaultImg" label="默认图片" width="150" align="center">
        <template v-slot="{ row }">
                  <img :src="row.skuDefaultImg" :alt="row.skuName" style="width:80px;height:80px;"/>
                </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)"> </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80">
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template>
          <el-button
            size="mini"
            type="success"
            icon="el-icon-download"
          ></el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="edit(row)"
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
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[5, 10, 15, 20]"
      :page-size.sync="limit"
      :current-page="page"
      layout="prev, pager, next, jumper,sizes, total"
      :total="total"
      class="pagination"
    >
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SKuList",
  data() {
    return {
      skuDataList: [],
      page: 1,
      limit: 5,
      total: 0,
    };
  },
  methods: {
    //点击每页显示多少条的时候触发
    handleSizeChange(limit) {
      this.getSkuList(this.page, limit);
      // console.log(this.page,limit)
    },
    //点击当前页码的时候触发
    handleCurrentChange(page) {
      this.getSkuList(page, this.limit);
      // console.log(page,this.limit)
    },
    async getSkuList() {
      const { page, limit } = this;
      const result = await this.$API.sku.getSkuList(page, limit);
      if (result.code === 200) {
        this.$message.success("获取分页列表请求成功");
        this.skuDataList = result.data.records;
        this.total = result.data.total;
        this.page = result.data.current;
        this.limit = result.data.size;
      } else {
        this.$message.error("获取分页列表请求失败");
      }
    },
  },
  mounted() {
    this.getSkuList();
  },
};
</script>

