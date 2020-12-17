//vuex集中管理三级分类列表的数据
import { Message } from "element-ui";
import * as API from "@/api";

export default {
  namespaced: true,
  state: {
    categoryList: {
      category1Id: "", //选中的代表一级分类数据的id
      category2Id: "",
      category3Id: ""
    },
    category1ListData: [], //一级分类数据
    category2ListData: [],
    category3ListData: []
  },
  actions: {
    //获取一级分类数据,页面一上来就应该获取一级分类数据
    async getCategory1ListData(store){
      const result = await API.attrs.getCategoryS1()
      if(result.code === 200){
        store.commit("GET_CATEGORY1LIST_DATA",result.data)
      }else{
        Message.error(result.message)
      }
    },
    //获取二级分类列表(前提是一级分类选中id)
    async getCategory2ListData(store,category1Id){
        const result = await API.attrs.getCategoryS2(category1Id)
        if(result.code === 200){
          store.commit("GET_CATEGORY2LIST_DATA_SUCCESS",{category1Id,category2ListData:result.data})
        }else{
          store.commit("GET_CATEGORY2LIST_DATA_ERROR",category1Id)
          Message.error(result.message)
        }

    },
    //获取三级分类列表(前提是一级分类和二级分类列表选中id)
    async getCategory3ListData(store,category2Id){
      const result = await API.attrs.getCategoryS3(category2Id)
      if(result.code === 200){
        store.commit("GET_CATEGORY3LIST_DATA_SUCCESS",{category2Id,category3ListData:result.data})
      }else{
        store.commit("GET_CATEGORY3LIST_DATA_ERROR",category2Id)
        Message.error(result.message)
      }

  }
  },
  mutations: {
    GET_CATEGORY1LIST_DATA(state,category1ListData){
      state.category1ListData = category1ListData
    },
    GET_CATEGORY2LIST_DATA_SUCCESS(state,{category1Id,category2ListData}){
      state.category2ListData = category2ListData
      state.category3ListData=[];
      state.categoryList.category1Id =category1Id
      state.categoryList.category2Id =""
      state.categoryList.category3Id =""
    },
    GET_CATEGORY2LIST_DATA_ERROR(state,category1Id){
      state.category3ListData=[];
      state.category2ListData=[];
      state.categoryList.category1Id =category1Id
      state.categoryList.category2Id =""
      state.categoryList.category3Id =""
    },
    GET_CATEGORY3LIST_DATA_SUCCESS(state,{category2Id,category3ListData}){
      state.category3ListData = category3ListData
      state.categoryList.category2Id = category2Id
      state.categoryList.category3Id = ""

    },
    GET_CATEGORY3LIST_DATA_ERROR(state,category2Id){
      state.category3ListData = []
      state.categoryList.category2Id = category2Id
      state.categoryList.category3Id = ""

    },
    //选择三级分类id的时候不需要发送请求
    SELECT_CATEGORY3ID(state,category3Id){
      state.categoryList.category3Id = category3Id
    }
  },
  getters: {}
};
