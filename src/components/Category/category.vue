<template>
  <div>
    <el-card class="box-card">
      <el-form :inline="true" :model="categoryList" class="demo-form-inline">
        <el-form-item label="一级分类">
          <el-select
            v-model="categoryList.category1Id"
            placeholder="请选择"
            :disabled="disabled"
            @change="handleCategoryS1"
          >
            <el-option
              v-for="category1 in category1ListData"
              :key="category1.id"
              :label="category1.name"
              :value="category1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select
            v-model="categoryList.category2Id"
            placeholder="请选择"
            :disabled="disabled"
            @change="handleCategoryS2"
          >
            <el-option
              v-for="category2 in category2ListData"
              :key="category2.id"
              :label="category2.name"
              :value="category2.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select
            v-model="categoryList.category3Id"
            placeholder="请选择"
            :disabled="disabled"
            @change="handleCategoryS3"
          >
            <el-option
              v-for="category3 in category3ListData"
              :key="category3.id"
              :label="category3.name"
              :value="category3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "Category",
  props: ["disabled"],
  data() {
    return {
      categoryList: {
        category1Id: "", //选中的代表一级分类数据的id
        category2Id: "",
        category3Id: "",
      },
      // category1ListData: [], //一级分类数据
      // category2ListData: [],
      // category3ListData: [],
    };
  },
  /* 'some/nested/module/foo', // -> this['some/nested/module/foo']() */
  computed: {
    ...mapState({
      category1ListData: (state) => state.category.category1ListData,
      category2ListData: (state) => state.category.category2ListData,
      category3ListData: (state) => state.category.category3ListData,
    }),
  },
  methods: {
    ...mapActions([
      "category/getCategory1ListData",
      "category/getCategory2ListData",
      "category/getCategory3ListData",
    ]),
    ...mapMutations(["category/SELECT_CATEGORY3ID"]),
    //选中值发生变化时触发的函数	参数是目前的选中值
    //点击一级分类的时候发送请求请求二级数据
    async handleCategoryS1(category1Id) {
      // console.log(category1Id);
      //再次请求的时候应该把二级分类和三级分类都删除掉
      this.categoryList.category2Id = "";
      this.categoryList.category3Id = "";
      // this.category2ListData = [];
      // this.category3ListData = [];
      // const result = await this.$API.attrs.getCategoryS2(category1Id);
      // // console.log(result);
      // if (result.code === 200) {
      //   this.category2ListData = result.data;
      // } else {
      //   this.$message.error(result.message);
      // }
      this['category/getCategory2ListData'](category1Id);
      this.$bus.$emit("clearList");
    },
    //点击二级分类的时候发送请求请求三级数据
    async handleCategoryS2(category2Id) {
      // console.log(category2Id);
      //再次请求的时候应该把三级分类都删除掉
      this.categoryList.category3Id = "";
      // this.category3ListData = [];

      // const result = await this.$API.attrs.getCategoryS3(category2Id);
      // // console.log(result);
      // if (result.code === 200) {
      //   this.category3ListData = result.data;
      // } else {
      //   this.$message.error(result.message);
      // }
      this['category/getCategory3ListData'](this.categoryList.category2Id);
      this.$bus.$emit("clearList");
    },
    //点击三级分类的时候,只负责把数据传过去,然后让父组件去发送请求
    handleCategoryS3(category3Id) {
      // console.log(category3Id);
      // const categoryList = {
      //   ...this.categoryList, //这个代表的是前面两个的id
      //   category3Id,
      // };
      this['category/SELECT_CATEGORY3ID'](this.categoryList.category3Id);
      // this.$bus.$emit("accept", categoryList);
      //这里只负责把数据传过去,然后让父组件去发送请求
    },
  },
  //一上来就应该获取一级分类数据
  async mounted() {
    // const result = await this.$API.attrs.getCategoryS1();
    // // console.log(result);
    // if (result.code === 200) {
    //   this.category1ListData = result.data;
    // } else {
    //   this.$message.error(result.message);
    // }
    this['category/getCategory1ListData']();
  },
};
</script>

<style lang="less" scoped>
</style>
