<template>
  <div>
    <Category></Category>
    <SpuShowList v-if="isShowList" @showUpdateList="showUpdateList"></SpuShowList>
    <SpuUpdateList v-else :item="item"></SpuUpdateList>
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
      isShowList: true,
      item:{}
    }
  },
  methods:{
    showUpdateList(row){
      this.isShowList = false
      this.item = {...row}
    }
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList
  },
};
</script>
