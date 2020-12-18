<template>
  <div>
    <el-card>
      <el-form label-width="80px" :model="sku" :rules="rules" ref="skuForm">
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
            :max="200000000000"
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
            :max="200000000000"
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
            <el-form-item :label="attr.attrName" style="display: inline-block">
              <el-select
                placeholder="请选择"
                v-model="sku.skuAttrValueList[index]"
                @change="clearValidate('skuAttrValueList')"
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
            <el-form-item
              :label="sale.saleAttrName"
              style="display: inline-block"
            >
              <el-select
                placeholder="请选择"
                v-model="sku.skuSaleAttrValueList[index]"
                @change="clearValidate('skuSaleAttrValueList')"
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
          <el-form-item>
            <el-table
              row-key="id"
              :data="ImageList"
              border
              tooltip-effect="dark"
              style="width: 100%; margin: 20px 0"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                reserve-selection
                width="55"
                prop="isCheck"
              >
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
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="cancelBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
/* skuId根本不需要，因为我们现在是保存数据，根本就没有skuId */
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
      rules: {
        skuName: [
          { required: true, message: "请输入SKU名称", trigger: "change" },
        ],
        price: [
          { required: true, message: "请输入SKU价格", trigger: "change" },
        ],
        weight: [
          { required: true, message: "请输入SKU重量", trigger: "change" },
        ],
        skuDesc: [
          { required: true, message: "请输入SKU描述", trigger: "change" },
        ],
        skuAttrValueList: [
          { required: true, validator: this.skuAttrValueListValidator },
        ],
        skuSaleAttrValueList: [
          { required: true, validator: this.skuSaleAttrValueListValidator },
        ],
        skuImageList: [
          { required: true, validator: this.skuImageListValidator },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      categoryList: (state) => state.category.categoryList,
    }),
  },
  /*
    {
  "category3Id": 0,
  "id": 0,//由后台生成
  "isSale": 0,
  "price": 0,
  "skuAttrValueList": [
    {
      "attrId": 0,
      "id": 0,
      "skuId": 0,
      "valueId": 0
    }
  ],
  "skuDefaultImg": "string",
  "skuDesc": "string",
  "skuImageList": [
    {
      "id": 0,
      "imgName": "string",
      "imgUrl": "string",
      "isDefault": "string",
      "skuId": 0,
      "spuImgId": 0
    }
  ],
  "skuName": "string",
  "skuSaleAttrValueList": [
    {
      "id": 0,
      "saleAttrValueId": 0,
      "skuId": 0,
      "spuId": 0
    }
  ],
  "spuId": 0,
  "tmId": 0,
  "weight": "string"
}
  */
  methods: {
    cancelBack() {
      this.$emit("showList");
    },
    save() {
      this.$refs.skuForm.validate(async (valid) => {
        if (valid) {
          console.log("校验成功~");
          const { category3Id, id: spuId, tmId } = this.spuList;
          const skuAttrValueList = this.sku.skuAttrValueList.map((item) => {
            const [attrId, valueId] = item.split("-");
            return {
              attrId,
              valueId,
            };
          });
          const skuDefaultImg = this.sku.skuImageList.find(
            (img) => img.isDefault
          ).imgUrl;
          const skuSaleAttrValueList = this.sku.skuSaleAttrValueList.map(
            (saleAttrValueId) => {
              return {
                saleAttrValueId,
                spuId,
              };
            }
          );
          const result = await this.$API.sku.saveSkuInfo({
            ...this.sku,
            skuAttrValueList,
            skuDefaultImg,
            skuSaleAttrValueList,
            spuId,
            tmId,
            category3Id,
          });
          console.log(result);
          if (result.code === 200) {
            this.$message.success("保存SKU数据成功");
            this.$emit("showList");
          } else {
            this.$message.error(result.message);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //清空表单校验
    clearValidate(prop) {
      this.$refs.skuForm.clearValidate(prop);
    },
    //校验平台属性
    skuAttrValueListValidator(rule, value, callback) {
      // console.log(rule, value, callback);
      //判断是否是全选和是否包含undefined
      //如果选择的值的长度和请求回来的数据的值的长度不一样则表示不是全选，并且选择的选项中不应该又undefined,true表示包含undefined
      const {
        attrsAllData,
        sku: { skuAttrValueList },
      } = this;
      if (
        attrsAllData.length !== skuAttrValueList.length ||
        !skuAttrValueList.some((attr) => attr)
      ) {
        callback(new Error("请选择所有的平台属性"));
        return;
      }
      callback();
    },
    //校验销售属性
    skuSaleAttrValueListValidator(rule, value, callback) {
      const {
        spuSaleAttrList,
        sku: { skuSaleAttrValueList },
      } = this;
      if (
        spuSaleAttrList.length !== skuSaleAttrValueList.length ||
        !skuSaleAttrValueList.some((sale) => sale)
      ) {
        callback(new Error("请选择所有的销售属性"));
      }
      callback();
    },
    //校验图片,至少选中一张图片并且有默认值得选项
    skuImageListValidator(rule, value, callback) {
      const {
        sku: { skuImageList },
      } = this;
      console.log(skuImageList);
      if (skuImageList.length === 0) {
        callback(new Error("请至少选中一张图片"));
      }
      if (!skuImageList.some((img) => img.isDefault)) {
        callback(new Error("请至少选中一张默认图片"));
      }
      callback();
    },
    setDefault(id) {
      console.log(id);
      this.clearValidate();
      this.ImageList = this.ImageList.map((item) => {
        return {
          ...item, //解构所有的数据，下面的修改会覆盖上面的数据
          isDefault: id === item.id ? true : false,
        };
      });
      this.sku.skuImageList = this.sku.skuImageList.map((item) => {
        return {
          ...item,
          isDefault: id === item.id ? true : false,
        };
      });
    },
    handleSelectionChange(ImageList) {
      // console.log(ImageList);
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
