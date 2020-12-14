<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form ref="form" label-width="80px" :model="spuList">
        <el-form-item label="SPU名称" prop="spuName">
          <el-input placeholder="SPU名称" v-model="spuList.spuName"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select placeholder="请选择品牌">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述" prop="description">
          <el-input type="textarea" placeholder="SPU描述" v-model="spuList.description"></el-input>
        </el-form-item>
        <el-form-item label="SPU图片" prop="logoUrl">
          <!-- Vue.prototype.$BASE_API = process.env.VUE_APP_BASE_API -->
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
        <el-form-item label="销售属性">
          <el-select placeholder="请选择品牌">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        </el-form-item>
        <el-form-item label="特殊资源">
          <el-table :data="[]" border style="width: 100%">
            <el-table-column
              type="index"
              label="序号"
              width="180"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="name" label="属性名" width="180">
            </el-table-column>
            <el-table-column prop="address" label="属性值名称列表">
            </el-table-column>
            <el-table-column prop="address" label="操作">
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
  props:{
    item:Object
  },
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl:"",
      spuList:this.item
    };
  },
};
</script>

<style lang="less" scoped>
</style>
