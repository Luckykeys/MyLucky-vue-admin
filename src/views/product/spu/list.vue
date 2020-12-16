<template>
  <div>
    <Category :disabled="!isShowList"></Category>
    <SpuShowList
      v-if="isShowList"
      @showList="!showList"
      @showUpdateList="showUpdateList"
    ></SpuShowList>
    <SpuUpdateList v-else :item="item" @showList="showList"></SpuUpdateList>
    <SpuDesList></SpuDesList>
  </div>
</template>

<script>
import Category from "@/components/Category/category.vue";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
import SpuDesList from "./spuDesList"
export default {
  name: "SpuList",
  data() {
    return {
      isShowList: true,
      item: {},
    };
  },
  methods: {
    showUpdateList(row) {
      this.isShowList = false;
      this.item = { ...row };
    },
    //显示showList页面的函数
    showList(category3Id) {
      this.isShowList = true;
      this.$nextTick(() => {
        this.$bus.$emit("accept", {category3Id});
      });
    },
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
    SpuDesList
  },
};
</script>
