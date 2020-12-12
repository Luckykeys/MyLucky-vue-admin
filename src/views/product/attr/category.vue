<template>
  <div>
    <el-card class="box-card">
      <el-form :inline="true" :model="categoryList" class="demo-form-inline">
        <el-form-item label="一级分类">
          <el-select
            v-model="categoryList.category1Id"
            placeholder="请选择"
            @change="handleCategoryS1"
          >
            <el-option
              v-for="category1 in category1ListData"
              :key="category1.id"
              label="category1.name"
              value="category1.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="categoryList.category2Id" placeholder="请选择">
            <el-option
              v-for="category2 in category2ListData"
              :key="category2.id"
              label="category2.name"
              value="category2.id"
              >{{ category2.name }}</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select v-model="categoryList.category3Id" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Category",
  data() {
    return {
      categoryList: {
        category1Id: "", //选中的代表一级分类数据的id
        category2Id: "",
        category3Id: "",
      },
      category1ListData: [], //一级分类数据
      category2ListData: [],
      category3ListData: [],
    };
  },
  methods: {
    //选中值发生变化时触发的函数	参数是目前的选中值
    handleCategoryS1(value) {
      console.log(value);
      // this.$API.attrs.getCategoryS2()
    },
  },
  //一上来就应该获取一级分类数据
  async mounted() {
    const result = await this.$API.attrs.getCategoryS1();
    console.log(result);
    if (result.code === 200) {
      this.category1ListData = result.data;
    } else {
      this.$message.error(result.message);
    }
  },
};
</script>

<style lang="less" scoped>
</style>
