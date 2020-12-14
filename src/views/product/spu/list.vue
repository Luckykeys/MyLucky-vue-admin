<template>
  <div>
    <Category></Category>
    <SpuShowList v-show="isShowList"></SpuShowList>
    <SpuUpdateList v-show="!isShowList"></SpuUpdateList>
  </div>
</template>

<script>
import Category from "@/components/Category/category.vue";
import SpuShowList from './spuShowList'
import SpuUpdateList from './spuUpdateList'
export default {
  name: "SpuList",
  data(){
    return {
      isShowList: true
    }
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList
  },
};
</script>
