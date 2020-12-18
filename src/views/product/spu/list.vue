<template>
  <div>
    <SpuDesList v-if="isShowSpuDesList" :spuItem="spuItem"></SpuDesList>
    <div v-else>
      <Category :disabled="!isShowList"></Category>
      <SpuShowList
        v-if="isShowList"
        @showList="!showList"
        @showUpdateList="showUpdateList"
        @showSpuDesList="showSpuDesList"
      ></SpuShowList>
      <SpuUpdateList v-else :item="item" @showList="showList"></SpuUpdateList>
    </div>
  </div>
</template>

<script>
// import {mapMutations} from "vuex"
import Category from "@/components/Category/category.vue";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
import SpuDesList from "./spuDesList";
export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      isShowSpuDesList: false,
      item: {}, //item代表的是spuShowList页面的单条的基础数据需要传达spuUpdateList页面的数据
      spuItem: {}, //spuItem代表的是spuShowList页面的单条的基础数据需要传达spuDesList页面的数据
    };
  },
  methods: {
    // ...mapMutations(['categoryList/RESET_CATEGORYLIST_ID']),
    //是否显示spuDes组件
    showSpuDesList(row, category) {
      this.isShowSpuDesList = true;
      this.spuItem = { ...row, ...category };
    },
    showUpdateList(row, category) {
      this.isShowList = false;
      this.item = { ...row, ...category };
    },
    //显示showList页面的函数
    showList(category) {
      this.isShowList = true;
      // this.$nextTick(() => {
      //   this.$bus.$emit("accept", category);
      // });
      // 通知spuShowList重新发送请求
    },
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
    SpuDesList,
  },
  beforeDestroy() {
    // this["categoryList/RESET_CATEGORYLIST_ID"]()
    this.$store.commit("category/RESET_CATEGORYLIST_ID");
  },
};
</script>
