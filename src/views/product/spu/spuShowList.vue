<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-button
        type="primary"
        icon="el-icon-plus"
        >添加SPU</el-button
      >
      <el-table :data="spuList" border style="width: 100%; margin: 20px 0">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="spuName" label="SPU名称">
        </el-table-column>
        <el-table-column label="SPU描述" prop="description"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-plus"
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
      @size-change="getPageList(page,$event)"
      @current-change="getPageList($event,limit)"
      :page-sizes="[3, 6, 9]"
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
  name: "SpuShowList",
  data(){
    return {
      categoryList: {
        category1Id: "", //选中的代表一级分类数据的id
        category2Id: "",
        category3Id: "",
      },
      //spu数据
      spuList:[],
      page:1,
      limit:3,
      total:0,
    }
  },
  methods:{
    //点击编辑
    edit(row){
      this.$emit("showUpdateList",row)
    },
    //获取分页列表
    async getPageList(page,limit){

      const {category3Id} = this.categoryList
      const result = await this.$API.spu.getSpuList({page,limit,category3Id})
      // console.log(result);
      if(result.code === 200){
        this.$message.success("请求分页数据成功")
        this.spuList = result.data.records
        this.total = result.data.total
      }else{
        this.$message.error(result.message)
      }
    },
    //给需要触发全局事件总线绑定的事件
    handleCategoryAccept(categoryList){
      this.categoryList = categoryList
      //调用发送请求的方法
      this.getPageList(this.page,this.limit)
    },
    clearList(){
      this.spuList = []
      this.categoryList.category3Id=""
    }
  },
  mounted(){
    this.$bus.$on("accept",this.handleCategoryAccept)
    this.$bus.$on("clearList",this.clearList)

  },
  beforeDestroy(){
    this.$bus.$off("accept",this.handleCategoryAccept)
    this.$bus.$off("clearList",this.clearList)
  }
};
</script>

<style lang="less" scoped>
</style>
