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
import Category from "@/components/Category/category.vue";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
import SpuDesList from "./spuDesList";
export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      isShowSpuDesList:false,
      item: {},
      //spuItem代表的是spu的基础数据需要传达sku界面
      spuItem:{}
    };
  },
  methods: {
    //是否显示spuDes组件
    showSpuDesList(row){
      this.isShowSpuDesList = true
      this.spuItem = {...row}
    },
    showUpdateList(row) {
      this.isShowList = false;
      this.item = { ...row };
    },
    //显示showList页面的函数
    showList(category3Id) {
      this.isShowList = true;
      this.$nextTick(() => {
        this.$bus.$emit("accept", { category3Id });
      });
    },
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
    SpuDesList,
  },
};
</script>
