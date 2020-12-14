<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="addTrademark"
      >添加</el-button
    >
    <el-dialog
      :title="`${trademarkForm.id ? '修改品牌' : '添加品牌'}`"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form
        :model="trademarkForm"
        :rules="rules"
        ref="trademarkForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="trademarkForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <!-- Vue.prototype.$BASE_API = process.env.VUE_APP_BASE_API -->
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkForm.logoUrl"
              :src="trademarkForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('trademarkForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-table
      :data="trademarkList"
      v-loading="loading"
      border
      style="width: 100%; margin: 20px 0"
    >
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" class="trademark-logo" alt="" />
        </template>
      </el-table-column>
      <el-table-column prop="done" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="limit"
      :current-page="page"
      layout="prev, pager, next, jumper,sizes, total"
      :total="total"
      class="pagination"
    >
    </el-pagination>
  </div>
</template>

<script>
// import {trademark} from "@/api"
export default {
  name: "TrademarkList",
  data() {
    return {
      //所有需要展示的数据
      trademarkList: [],
      total: 0,
      page: 1, //当前在第几页
      limit: 3, //默认一页显示多少条
      dialogVisible: false,
      loading: false,
      trademarkForm: {
        tmName: "",
        logoUrl: "",
      },
      rules: {
        tmName: [
          {
            required: true,
            message: "请输入品牌名称",
            trigger: "blur",
            // validator: this.validator,
          },
        ],
        logoUrl: [{ required: true, message: "请输入品牌LOGO" }],
      },
    };
  },
  methods: {
    // validator(rule, value, callback) {
    //   console.log(rule, value, callback);
    //   if (!value) {
    //     callback(new Error("请输入品牌名称"));
    //   } else if(value.length < 2 || value.length >10) {
    //     callback(new Error("品牌名称的字数不能小于2并且大于10"));
    //     return;
    //   }
    //   callback()
    // },

    //点击每页显示多少条的时候触发
    handleSizeChange(limit) {
      this.getPageList(this.page, limit);
      // console.log(this.page,limit)
    },
    //点击当前页码的时候触发
    handleCurrentChange(page) {
      this.getPageList(page, this.limit);
      // console.log(page,this.limit)
    },
    async getPageList(page, limit) {
      this.loading = true;
      //page--->当前在第几页, limit--->默认一页显示多少条
      const result = await this.$API.trademark.getPageList(page, limit);
      // console.log(result);
      if (result.code === 200) {
        this.$message.success("获取分页列表请求成功");
        this.trademarkList = result.data.records;
        this.total = result.data.total;
        this.page = result.data.current;
        this.limit = result.data.size;
      } else {
        this.$message.error("获取分页列表请求失败");
      }
      this.loading = false;
    },
    //上传之前触发的函数
    beforeAvatarUpload(file) {
      console.log(file.type);
      const imgTypes = ["image/jpeg", "image/jpg", "image/png"]; //图片的类型
      //检测文件类型
      const isMyTypes = imgTypes.indexOf(file.type) > -1;
      //检测图片大小是否是小于50kB
      const isLt = file.size / 1024 < 50;
      if (!isMyTypes) {
        this.$message.error("上传品牌LOGO只能是 JPG/PNG 格式!");
      }
      if (!isLt) {
        this.$message.error("上传品牌LOGO大小不能超过 2MB!");
      }
      return isMyTypes && isLt;
    },
    //上传成功后触发的函数
    handleAvatarSuccess(res) {
      console.log(res);
      this.trademarkForm.logoUrl = res.data;
    },
    //点击添加按钮的时候应该清空之前的数据
    addTrademark() {
      //移除表单验证
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
      this.dialogVisible = true;
      this.trademarkForm.tmName = "";
      this.trademarkForm.logoUrl = "";
      this.trademarkForm.id = "";
    },
    //点击弹出表单的确定按钮上传数据
    submitForm(trademarkForm) {
      this.$refs[trademarkForm].validate(async (valid) => {
        if (valid) {
          console.log(this.trademarkForm); //打印出来的就是需要的图片数据和名称
          //判断是否正在更新数据
          //这里有个关键的点就是，点击修改的时候trademarkForm是有id的,而添加没有
          const isUpdate = !!this.trademarkForm.id;
          // console.log(isUpdate);
          if (isUpdate) {
            const tm = this.trademarkList.find(
              (tm) => tm.id === this.trademarkForm.id
            );

            if (
              tm.tmName === this.trademarkForm.tmName &&
              tm.logoUrl === this.trademarkForm.logoUrl
            ) {
              this.$message.warning("不能提交与之前一样的数据");
              return;
            }
          }

          let result;
          if (isUpdate) {
            result = await this.$API.trademark.updateTrademarkList(
              this.trademarkForm
            );
          } else {
            result = await this.$API.trademark.addTrademarkList(this.trademarkForm);
          }
          // //表单校验通过就发送增加数据请求
          // const result = await this.$API.trademark.addTrademarkList(
          //   this.trademarkForm
          // );
          if (result.code === 200) {
            this.$message.success(
              `${isUpdate ? "修改数据成功" : "添加数据成功"}`
            );
            //把对话框隐藏
            this.dialogVisible = false;
            //重新获取一次数据
            this.getPageList(this.page, this.limit);
          } else {
            this.$message.error("添加数据失败");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //点击按钮修改数据
    handleEdit(index, row) {
      console.log(index, row);
      //移除表单验证
      this.$refs.trademarkForm && this.$refs.trademarkForm.clearValidate();
      this.dialogVisible = true;
      this.trademarkForm = { ...row };
    },
    //点击删除按钮删除这条数据
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm(`确定删除${row.tmName}这件商品吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const result = await this.$API.trademark.removeTrademarkList(row.id);
          console.log(result);
          if (this.trademarkList.length === 1) {
            this.page -= 1;
          }
          //重新请求一次数据
          this.getPageList(this.page, this.limit);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  mounted() {
    //一上来就应该调用一次
    this.getPageList(this.page, this.limit);
  },
};
</script>

<style lang="sass" scoped>
.trademark-logo
  width: 100px
/deep/.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden
/deep/.avatar-uploader .el-upload:hover
  border-color: #409EFF
/deep/.avatar-uploader-icon
  font-size: 28px
  color: #8c939d
  width: 178px
  height: 178px
  line-height: 178px
  text-align: center
/deep/.avatar
  width: 178px
  height: 178px
  display: block
</style>
