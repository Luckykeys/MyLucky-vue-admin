<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form ref="form" label-width="80px" :model="spuList">
        <el-form-item label="SPU名称" prop="spuName">
          <el-input placeholder="SPU名称" v-model="spuList.spuName"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="tmId">
          <el-select placeholder="请选择品牌" v-model="spuList.tmId">
            <el-option
              v-for="tm in trademarkList"
              :key="tm.id"
              :label="tm.tmName"
              :value="tm.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述" prop="description">
          <el-input
            type="textarea"
            placeholder="SPU描述"
            v-model="spuList.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
          <!-- Vue.prototype.$BASE_API = process.env.VUE_APP_BASE_API -->
          <!--
              file-list: 指定显示的图片列表数组 [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
              action: 指定上传图片的路径
              list-type: 指定图片列表的风格样式
              on-preview: 指定点击预览大图的回调函数
              on-remove: 点击删除的回调函数
            -->
          <el-upload
            :action="`${$BASE_API}/admin/product/fileUpload`"
            list-type="picture-card"
            :file-list="formatImageList"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
        <!-- prop="saleAttrList" 作为表单校验 -->
        <el-form-item label="销售属性" prop="saleAttrList">
          <el-select
            :placeholder="`还剩${filterSaleAttrList.length}个未选择`"
            v-model="spuList.saleAttrList"
          >
            <el-option
              v-for="saleAttr in filterSaleAttrList"
              :key="saleAttr.id"
              :label="saleAttr.name"
              :value="saleAttr.id"
            ></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="filterSaleAttrList.length === 0">添加销售属性</el-button>
          <el-table :data="spuSaleAttrList" border style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="saleAttrName" label="属性名" width="80">
            </el-table-column>
            <el-table-column label="属性值名称列表">
              <template slot-scope="{ row, $index }">
                <el-tag
                  :key="attrVal.id"
                  v-for="attrVal in row.spuSaleAttrValueList"
                  closable
                  :disable-transitions="false"
                  @click="handleClose(row, $index)"
                >
                  {{ attrVal.saleAttrValueName }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row, $index)"
                  @blur="handleInputConfirm(row, $index)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput($index)"
                  >+添加</el-button
                >
              </template>
            </el-table-column>
            <el-table-column prop="address" label="操作" width="80">
              <template>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-button type="primary">保存</el-button>
        <el-button>取消</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "SpuUpdateList",
  props: {
    item: Object,
  },
  data() {
    return {
      dialogVisible: false, //图片对话框显示还是隐藏
      dialogImageUrl: "", //点击显示放大的图片地址
      spuList: this.item,
      trademarkList: [],
      ImageList: [],
      saleAttrList: [],
      spuSaleAttrList: [],
      inputVisible: false, //显示添加的input框
      inputValue: "",
      dynamicTags: [],
    };
  },
  computed: {
    //从所有属性中过滤已经显示在下面的数据
    /* 使用数组的filter从所有的销售属性中过滤出需要保留的数据，如果下面已经有了就需要展示了，没有的话就需要展示 */
    filterSaleAttrList() {
      return this.saleAttrList.filter((sale) => {
        //filter 返回true就是保留需要的，返回false就是需要过滤掉的
        //这里需要过滤掉已经在下面显示的
        return !this.spuSaleAttrList.find((spuSale) => {
          return (spuSale.baseSaleAttrId = sale.id);
        });
      });
    },
    //格式图片
    //要对这里传入的图片对应的值做处理，因为element中所对应的值和我们的数据值的名字不一样
    //map 长度不变值变
    formatImageList() {
      return this.ImageList.map((item) => {
        return {
          uid: item.uid || item.id,
          name: item.imgName,
          url: item.imgUrl,
        };
      });
    },
  },
  methods: {
    //点击添加属性值按钮添加属性值
    addAttrValue(){

    },
    //上传之前触发的函数
    beforeAvatarUpload(file) {
      // console.log(file.type);
      const imgTypes = ["image/jpeg", "image/jpg", "image/png"]; //图片的类型
      //检测文件类型
      const isMyTypes = imgTypes.indexOf(file.type) > -1;
      //检测图片大小是否是小于50kB
      const isLt = file.size / 1024 < 50;
      if (!isMyTypes) {
        this.$message.error("上传SPU图片只能是 JPG/PNG 格式!");
      }
      if (!isLt) {
        this.$message.error("上传SPU图片大小不能超过 2MB!");
      }
      return isMyTypes && isLt;
    },
    //上传成功后触发的函数
    handleAvatarSuccess(res, file) {
      console.log(res, file);
      this.ImageList.push({
        uid:file.uid,
        imgName:file.name,
        imgUrl:res.data,
        spuId:this.spuList.id
      });
    },
    //点击标签的关闭x则删除这一项
    handleClose(row, index) {
      row.spuSaleAttrList.splice(index, 1);
    },
    //失去焦点保存数据
    handleInputConfirm(row, index) {
      let inputValue = this.inputValue;
      if (inputValue) {
        row.spuSaleAttrList.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    //点击添加属性值
    showInput(index) {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    //处理图片的放大函数
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove() {},
    //获取品牌数据的请求
    async getTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      // console.log(result);
      if (result.code === 200) {
        this.$message.success("获取品牌数据成功");
        this.trademarkList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    //获取所有图片数据
    async getSpuImageList() {
      const { id } = this.spuList;
      const result = await this.$API.spu.getSpuImageList(id);
      // console.log(result);
      if (result.code === 200) {
        this.$message.success("获取图片数据成功");
        this.ImageList = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
    //获取所有销售属性的请求
    async getBaseSaleAttrList() {
      const result = await this.$API.spu.getBaseSaleAttrList();
      if (result.code === 200) {
        this.$message.success("获取所有销售属性数据成功");
        this.saleAttrList = result.data;
      } else {
        this.$message.error(result.message);
      }
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
  },
  mounted() {
    this.getTrademarkList();
    this.getSpuImageList();
    this.getBaseSaleAttrList();
    this.getSpuSaleAttrList();
  },
};
</script>

<style lang="sass">
.el-tag + .el-tag
  margin-left: 10px

.button-new-tag
  margin-left: 10px
  height: 32px
  line-height: 30px
  padding-top: 0
  padding-bottom: 0

.input-new-tag
  width: 90px
  margin-left: 10px
  vertical-align: bottom
</style>
