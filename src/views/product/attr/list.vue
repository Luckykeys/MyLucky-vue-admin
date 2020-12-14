<template>
  <div>
    <!-- 自定义事件方法 -->
    <!-- <Category @accept="getAttrsLists" :disabled="!isShowAdd"></Category> -->
    <!-- 全局事件总线 -->
    <Category :disabled="!isShowAdd"></Category>
    <el-card style="margin-top: 20px" v-show="isShowAdd">
      <!-- @click="addAttr" -->
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="addAttValueOnePage"
        :disabled="!categoryList.category3Id"
        >添加属性</el-button
      >
      <el-table :data="attrsAllData" border style="width: 100%; margin: 20px 0">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id"
              style="margin-right: 5px"
            >
              {{ attrValue.valueName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="{ row, $index }">
            <el-button size="mini" type="warning" @click="update(row)"
              ><i class="el-icon-edit"></i
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              @click="delAttValueOnePage($index)"
              ><i class="el-icon-delete"></i
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card style="margin-top: 20px" v-show="!isShowAdd">
      <el-form :model="attr" inline>
        <el-form-item label="属性名">
          <el-input v-model="attr.attrName"></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        :disabled="!attr.attrName"
        icon="el-icon-plus"
        @click="addAttValueTwoPage()"
        >添加属性值</el-button
      >
      <el-button @click="canelAdd">取消</el-button>

      <el-table
        :data="attr.attrValueList"
        style="width: 100%; margin: 20px 0"
        border
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column label="属性值名称">
          <template v-slot="{ row }">
            <el-input
              v-if="row.edit"
              size="mini"
              v-model="row.valueName"
              ref="input"
              @blur="row.edit = false"
              @keyup.enter.native="row.edit = false"
            ></el-input>
            <span
              v-else
              @click="edited(row)"
              style="display: block; width: 100%"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row, $index }">
            <el-popconfirm
              @onConfirm="delAttValueTwoPage($index)"
              :title="`您确定删除${row.valueName}吗？`"
            >
              <el-button size="mini" type="danger" slot="reference"
                ><i class="el-icon-delete"></i
              ></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-button type="primary" :disabled="!attr.attrName" @click="saveAllAttrs"
        >保存</el-button
      >
      <el-button>取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Category from "@/components/Category/category.vue";
export default {
  name: "AttrList",
  data() {
    return {
      attrsAllData: [],
      categoryList: {
        // category1Id: "",
        // category2Id: "",
        // category3Id: "",
      },
      // loading: true,
      isShowAdd: true,
      //点击添加属性的时候form表单的数据
      attr: {
        attrName: "",
        attrValueList: [],
      },
    };
  },
  methods: {
    //接收子组件传过来的result.data数据
    async getAttrsLists(categoryList) {
      // console.log(categoryList);
      //categoryList 是需要的三个id,因为子组件只是简单的传递数据，父组件发送请求
      this.categoryList = categoryList;
      const result = await this.$API.attrs.getCategoryAllList(categoryList);
      console.log(result);
      if (result.code === 200) {
        //发送请求回来的数据给到定义的数据进行遍历展示
        this.attrsAllData = result.data;
        this.$message.success("请求数据成功");
      } else {
        this.$message.error(result.message);
      }
    },
    //点击修改属性按钮显示修改属性的相关页面
    update(row) {
      // console.log(111)
      this.isShowAdd = false;
      // this.attr = {
      //   ...row,
      // };
      //深度克隆
      this.attr = JSON.parse(JSON.stringify(row));
    },
    //点击span文本需要修改触发的函数
    edited(row) {
      // console.log(row)
      /*  attrId: 6
          edit: true
          id: 18640
          valueName: "4K超清" */
      this.$set(row, "edit", true);
      //手动获取焦点
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    addAttValueOnePage() {
      this.isShowAdd = false;
      this.attr.attrName = "";
      this.attr.attrValueList = [];
    },
    //点击添加属性值添加一条新的新的属性
    addAttValueTwoPage() {
      this.attr.attrValueList.push({
        edit: true,
      });
      //添加新属性自动获取焦点
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    delAttValueOnePage(index) {
      console.log(index);
    },
    //点击删除删除当前这一条
    delAttValueTwoPage(index) {
      console.log(111);
      console.log(index);
      this.attr.attrValueList.splice(index, 1);
    },
    //保存已经修改好的所有属性
    async saveAllAttrs() {
      //判断是否是添加的删除还是修改的删除
      const isAdd = !this.attr.id;
      const data = this.attr;
      if (isAdd) {
        //代表是添加的时候，是没有id的
        data.categoryId = this.category.category3Id;
        data.categoryLevel = 3;
      }
      //修改页面保存后发送保存的请求
      const result = await this.$API.attrs.getSaveAttrInfo(data);
      if (result.code === 200) {
        this.$message.success("保存属性成功");
        this.isShowAdd = true;
        this.getAttrsLists(this.categoryList);
      } else {
        this.$message.error("保存属性失败!");
      }
    },
    //取消添加新的属性值,返回前一页
    canelAdd() {
      this.isShowAdd = true;
    },
    //随意点击级别分类的时候应该清空后面的分类数据
    clearList() {
      //清空数据
      this.attrsAllData = [];
      //禁用按钮
      this.categoryList.category3Id = "";
    },
  },
  mounted() {
    this.$bus.$on("accept", this.getAttrsLists);
    this.$bus.$on("clearList",this.clearList)
  },
  beforeDestroy() {
    this.$bus.$off("accept", this.getAttrsLists);
    this.$bus.$off("clearList",this.clearList)
  },
  components: {
    Category,
  },
};
</script>
