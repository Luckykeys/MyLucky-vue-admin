import request from "@/utils/request";
const api_name = "/admin/product";
export default {
  //获取分页列表分类数据的请求
  getSpuList({ page, limit, category3Id }) {
    return request({
      method: "GET",
      url: `${api_name}/${page}/${limit}`,
      params: {
        category3Id
      }
    });
  },
  //请求品牌的数据发送的请求  GET /admin/product/baseTrademark/getTrademarkList
  getTrademarkList() {
    return request({
      method: "GET",
      url: `${api_name}/baseTrademark/getTrademarkList`
    });
  },
  // 请求图片列表的请求  /admin/product/spuImageList/{spuId}
  getSpuImageList(spuId) {
    return request({
      method: "GET",
      url: `${api_name}/spuImageList/${spuId}`
    });
  },
  //获取所有销售属性的请求   /admin/product/baseSaleAttrList
  getBaseSaleAttrList() {
    return request({
      method: "GET",
      url: `${api_name}/baseSaleAttrList`
    });
  },
  //获取spu销售属性的请求  /admin/product/spuSaleAttrList/{spuId}
  getSpuSaleAttrList(spuId) {
    return request({
      method: "GET",
      url: `${api_name}/spuSaleAttrList/${spuId}`
    });
  },
  // 保存更新spu属性的请求     /admin/product/updateSpuInfo
  updateSpuInfo(spu){
    return request({
      method:"POST",
      url:`${api_name}/updateSpuInfo`,
      data:spu
    })
  }
};
