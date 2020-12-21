<template>
  <div>
    <el-card>
      <el-table :data="skuDataList" border stripe style="width: 100%">
        <el-table-column label="序号" width="80" type="index" align="center">
        </el-table-column>
        <el-table-column prop="skuName" label="名称"></el-table-column>
        <el-table-column prop="skuDesc" label="描述"> </el-table-column>
        <el-table-column
          prop="skuDefaultImg"
          label="默认图片"
          width="150"
          align="center"
        >
          <template v-slot="{ row }">
            <img
              :src="row.skuDefaultImg"
              :alt="row.skuName"
              style="width: 80px; height: 80px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="weight" label="重量(KG)"> </el-table-column>
        <el-table-column prop="price" label="价格(元)" width="80">
        </el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="{ row }">
            <el-button
              v-if="row.isSale === 0"
              size="mini"
              type="info"
              icon="el-icon-top"
              @click="onSale(row.id)"
            ></el-button>
            <el-button
              v-if="row.isSale === 1"
              size="mini"
              type="success"
              icon="el-icon-bottom"
              @click="cancelSale(row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="edit(row)"
            ></el-button>
            <el-button
              size="mini"
              type="info"
              icon="el-icon-info"
              @click="getSkuById(row.id)"
            ></el-button>
            <el-button
              :title="`确定删除${row.skuName}吗？`"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              slot="reference"
              @click="deleteSku(row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 20, 30, 40, 50]"
        :page-size.sync="limit"
        :current-page="page"
        layout="prev, pager, next, jumper,sizes, total"
        :total="total"
        class="pagination"
      >
      </el-pagination>
      <el-drawer title="我是标题" :visible.sync="drawer" :with-header="false">
        <el-row>
          <el-col :span="5">名称</el-col>
          <el-col :span="16">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">描述</el-col>
          <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">价格</el-col>
          <el-col :span="16">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="5">平台属性</el-col>
          <el-col
            style="margin-right: 5px"
            :span="16"
            v-for="attr in skuInfo.skuAttrValueList"
            :key="attr.id"
            >{{ attr.valueId }}</el-col
          >
        </el-row>
        <el-row>
          <el-col :span="5">销售属性</el-col>
          <el-col
            style="margin-right: 5px"
            :span="16"
            v-for="sale in skuInfo.skuSaleAttrValueList"
            :key="sale.id"
            >{{ attr.valueId }}</el-col
          >
        </el-row>
        <el-row>
          <el-col :span="5">商品图片</el-col>
          <el-col :span="16" style="margin-right: 5px"
            ><el-carousel class="sku-carousel" trigger="click" height="400px">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id"
              >
                <img :src="item.imgUrl" alt="" />
              </el-carousel-item> </el-carousel
          ></el-col>
        </el-row>
      </el-drawer>
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
      loading: false,
      drawer: false,
      skuInfo: {},
    };
  },
  methods: {
    async getSkuById(skuId) {
      this.drawer = true;
      const result = await this.$API.sku.getSkuById(skuId);
      console.log(result);
      this.skuInfo = result.data;
    },
    edit() {
      this.$message("正在开发中...");
    },
    async deleteSku(skuId) {
      const result = await this.$API.sku.deleteSku(skuId);
      if (result.code === 200) {
        this.$message.success("删除SKU成功");
        this.getSkuList(this.page);
      } else {
        this.$message.error(result.message);
      }
    },
    cancelSale(skuId) {
      this.$API.sku.cancelSale(skuId).then(() => {
        this.$message.success("下架成功");
        this.getSkuList(this.page);
      });
    },
    onSale(skuId) {
      this.$API.sku.onSale(skuId).then(() => {
        this.$message.success("上架成功");
        this.getSkuList(this.page);
      });
    },
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
    async getSkuList(page = 1) {
      this.loading = true;
      this.page = page;
      const result = await this.$API.sku.getSkuList(this.page, this.limit);
      if (result.code === 200) {
        this.$message.success("获取分页列表请求成功");
        this.skuDataList = result.data.records;
        this.total = result.data.total;
        this.page = result.data.current;
        this.limit = result.data.size;
      } else {
        this.$message.error("获取分页列表请求失败");
      }
      this.loading = false;
    },
  },
  mounted() {
    this.getSkuList();
  },
};
/* 
   1. 为什么必须加/deep/才能修改Carousel组件的样式?,
   声明了scoped, 不用deep不能修改子组件的非标签样式(也就是Carousel组件内部的子标签样式)
   用了deep: 不会对目标标签有当前组件的data属性选择的要求
   2. 为什么不加/deep/能修改Row/Col组件的样式?
   我们修改的是Row/Col根标签样式(它有当前组件的data属性)
*/
</script>

<style lang="sass">
  .sku-list
    .el-row
      height: 40px
      .el-col
        line-height: 40px
        &.el-col-5
          font-size: 18px
          font-weight: bold
          text-align: right
          margin-right: 20px

    .sku-carousel
      width: 400px
      border: 1px solid #ccc
      img
        width: 400px
        height: 400px

      /deep/ .el-carousel__indicator
        button
          background-color: hotpink

        &.is-active
          button
            background-color: green
</style>
