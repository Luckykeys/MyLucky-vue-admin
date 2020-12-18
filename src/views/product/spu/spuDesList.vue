<template>
  <div>
    <el-card>
      <el-form label-width="80px" :model="sku" :rules="rules">
        <!-- prop用作表单校验 -->
        <el-form-item label="SPU名称">
          <span>{{ spuList.spuName }}</span>
        </el-form-item>
        <el-form-item label="SKU名称" prop="skuName">
          <el-input placeholder="SKU 名称" v-model="sku.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)" prop="price">
          <el-input-number
            align="left"
            style="width: 300px"
            controls-position="right"
            :min="0"
            v-model="sku.price"
            placeholder="SKU价格"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="重量(千克)" prop="weight">
          <el-input-number
            align="left"
            style="width: 300px"
            controls-position="right"
            :min="0"
            v-model="sku.weight"
            placeholder="SKU重量"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="规格描述" prop="skuDesc">
          <el-input
            type="textarea"
            placeholder="SKU规格描述"
            v-model="sku.skuDesc"
          ></el-input>
        </el-form-item>
        <el-form-item label="平台属性" prop="skuAttrValueList">
          <div
            v-for="(attr, index) in attrsAllData"
            :key="attr.id"
            class="spuDesList-select-container"
          >
            <el-form-item :label="attr.attrName" style="display:inline-block">
              <el-select
                placeholder="请选择"
                v-model="sku.skuAttrValueList[index]"
              >
                <el-option
                  v-for="value in attr.attrValueList"
                  :key="value.id"
                  :value="`${attr.id}-${value.id}`"
                  :label="value.valueName"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="销售属性" prop="skuSaleAttrValueList">
          <div
            v-for="(sale, index) in spuSaleAttrList"
            :key="sale.id"
            class="spuDesList-select-container"
          >
            <el-form-item :label="sale.saleAttrName" style="display:inline-block">
              <el-select
                placeholder="请选择"
                v-model="sku.skuSaleAttrValueList[index]"
              >
                <el-option
                  v-for="attrValue in sale.spuSaleAttrValueList"
                  :key="attrValue.id"
                  :value="attrValue.id"
                  :label="attrValue.saleAttrValueName"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="图片列表" prop="skuImageList">
          <!-- ref="multipleTable" -->
          <!--row-key="id" 这个id会自己去ImageList数据中寻找id  -->
          <el-table
            row-key="id"
            :data="ImageList"
            border
            tooltip-effect="dark"
            style="width: 100%; margin: 20px 0"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" reserve-selection width="55" prop="isCheck">
            </el-table-column>
            <el-table-column label="图片" class="cell">
              <template v-slot="{ row }">
                <img :src="row.imgUrl" :alt="row.imgName" />
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="imgName"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button
                  v-show="!row.isDefault"
                  type="primary"
                  size="mini"
                  @click="setDefault(row.id)"
                  >设为默认</el-button
                >
                <el-tag v-show="row.isDefault" type="success">默认</el-tag>
              </template>
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
import { mapState } from "vuex";
export default {
  name: "SpuDesList",
  props: {
    spuItem: Object,
  },
  data() {
    return {
      spuList: this.spuItem, //spuShowList页面传过来的spu单条的数据
      sku: {
        skuAttrValueList: [], //平台属性
        skuImageList: [], //图片
        skuSaleAttrValueList: [], //销售属性
      }, // sku数据
      ImageList: [],
      spuSaleAttrList: [],
      attrsAllData: [],
      rules: {},
    };
  },
  computed: {
    ...mapState({
      categoryList: (state) => state.category.categoryList,
    }),
  },
  methods: {
    setDefault(id) {
      console.log(id);
      this.ImageList = this.ImageList.map((item) => {
        return {
          ...item, //解构所有的数据，下面的修改会覆盖上面的数据
          isDefault: id === item.id ? true : false,
        };
      });
    },
    handleSelectionChange(ImageList) {
      console.log(ImageList);
      this.sku.skuImageList = ImageList;
    },
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
    //接收子组件传过来的result.data数据,请求数据的平台属性数据
    async getAttrsLists() {
      // console.log(categoryList);
      //categoryList 是需要的三个id,因为子组件只是简单的传递数据，父组件发送请求
      // this.categoryList = categoryList;
      const result = await this.$API.attrs.getCategoryAllList(
        this.categoryList
      );
      if (result.code === 200) {
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
  width: 30%
  margin-bottom: 10px
.cell img
  width: 100px
  height: 100px
</style>
