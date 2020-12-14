import request from "@/utils/request";
const api_name = "/admin/product";

export default {
  //获取一级分类数据的请求
  getCategoryS1() {
    return request({
      method: "GET",
      url: `${api_name}/getCategory1`
    });
  },
  //获取二级分类数据的请求
  getCategoryS2(category1Id) {
    return request({
      method: "GET",
      url: `${api_name}/getCategory2/${category1Id}`
    });
  },
  //获取三级分类数据的请求
  getCategoryS3(category2Id) {
    return request({
      method: "GET",
      url: `${api_name}/getCategory3/${category2Id}`
    });
  },
  //获取所有分类数据的请求
  getCategoryAllList({ category1Id, category2Id, category3Id }) {
    return request({
      method: "GET",
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
    });
  },
  //保存属性发送的请求
  getSaveAttrInfo(attr){
    return request({
      method: "POST",
      url: `${api_name}/saveAttrInfo`,
      data:attr
    });
  }
};
