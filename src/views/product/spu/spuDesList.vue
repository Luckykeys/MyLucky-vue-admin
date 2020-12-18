<template>
  <div>
    <el-card>
      <el-form label-width="80px">
        <!-- prop用作表单校验 -->
        <el-form-item label="SPU名称" prop="spuName">
          <span>{{ spuList.spuName }}</span>
        </el-form-item>
        <el-form-item label="SKU名称" prop="skuName">
          <el-input placeholder="SKU 名称"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)" prop="price">
          <el-input-number
            align="left"
            style="width: 300px"
            controls-position="right"
            :min="0"
            v-model="priceNum"
            placeholder="SKU价格"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="重量(千克)">
          <el-input-number
            align="left"
            style="width: 300px"
            controls-position="right"
            :min="0"
            v-model="weightNum"
            placeholder="SKU重量"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="规格描述" prop="skuDesc">
          <el-input type="textarea" placeholder="SKU规格描述"></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
          <div
            v-for="attr in attrsAllData"
            :key="attr.id"
            class="spuDesList-select-container"
          >
            <span>{{ attr.attrName }}</span>
            <el-select placeholder="请选择">
              <el-option
                v-for="value in attr.attrValueList"
                :key="value.id"
                :value="value.id"
                :label="value.valueName"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="销售属性">
          <div
            v-for="sale in spuSaleAttrList"
            :key="sale.id"
            class="spuDesList-select-container"
          >
            <span>{{ sale.saleAttrName }}</span>
            <el-select placeholder="请选择">
              <el-option
                v-for="attrValue in sale.spuSaleAttrValueList"
                :key="attrValue.id"
                :value="attrValue.id"
                :label="attrValue.saleAttrValueName"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="图片列表">
          <!-- ref="multipleTable" -->
          <el-table
            :data="ImageList"
            border
            tooltip-effect="dark"
            style="width: 100%; margin: 20px 0"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" prop="isCheck">
            </el-table-column>
            <el-table-column label="图片" class="cell">
              <template slot-scope="scope">
                <img :src="scope.row.imgUrl" :alt="scope.row.imgName" />
              </template>
            </el-table-column>
            <el-table-column prop="name" label="名称">
            </el-table-column>
            <el-table-column label="操作">
              <el-button type="primary" size="mini">设为默认</el-button>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SpuDesList",
  props: {
    spuItem: Object,
  },
  data() {
    return {
      priceNum: 0,
      weightNum:0,
      spuList: this.spuItem, //spuShowList页面传过来的spu单条的数据
      sku: {}, // sku数据
      ImageList: [],
      spuSaleAttrList: [],
      attrsAllData: [],
    };
  },
  methods: {
    handleSelectionChange() {},
    //获取单个spu销售属性的请求
    async getSpuSaleAttrList() {
      const { id } = this.spuList;
      const result = await this.$API.spu.getSpuSaleAttrList(id);
      if (result.code === 200) {
        this.$message.success("获取SPU销售属性数据成功");
        this.spuSaleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    //接收子组件传过来的result.data数据
    async getAttrsLists(categoryList) {
      // console.log(categoryList);
      //categoryList 是需要的三个id,因为子组件只是简单的传递数据，父组件发送请求
      // this.categoryList = categoryList;
      const result = await this.$API.attrs.getCategoryAllList({
        category1Id: this.spuList.category1Id,
        category2Id: this.spuList.category2Id,
        category3Id: this.spuList.category3Id,
      });
      // console.log(result);
      if (result.code === 200) {
        //发送请求回来的数据给到定义的数据进行遍历展示
        this.attrsAllData = result.data;
        this.$message.success("请求数据的平台属性数据成功");
      } else {
        this.$message.error(result.message);
      }
    },
    //获取所有图片数据
    async getSpuImageList() {
      const { id } = this.spuList;
      const result = await this.$API.spu.getSpuImageList(id);
      if (result.code === 200) {
        this.$message.success("获取图片数据成功");
        this.ImageList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  mounted() {
    this.getSpuImageList();
    this.getSpuSaleAttrList();
    this.getAttrsLists();
  },
};
</script>
<style lang="sass" scoped>
>>>.el-input-number .el-input__inner
  text-align: left
.spuDesList-select-container
  display: inline-block
  margin-right: 20px
.cell img
  width: 100px
  height: 100px
</style>
