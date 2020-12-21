import request from "@/utils/request";
const api_name = "/admin/product";
export default {
  //获取分页列表分类数据的请求  /admin/product/list/{page}/{limit}
  getSkuList(page,limit){
    return request({
      method:"GET",
      url: `${api_name}/list/${page}/${limit}`
    })
  },
  //保存sku的数据的请求/admin/product/saveSkuInfo
  saveSkuInfo(sku){
    return request({
      method:"POST",
      url:`${api_name}/saveSkuInfo`,
      data:sku
    })
  },
  //上架商品发送的请求/admin/product/onSale/{skuId}
  onSale(skuId){
    return request({
      method:"GET",
      url:`${api_name}/onSale/${skuId}`
    })
  },
  //下架商品发送的请求/admin/product/cancelSale/{skuId}
  cancelSale(skuId){
    return request({
      method:"GET",
      url:`${api_name}/cancelSale/${skuId}`
    })
  },
  //删除sku商品发送的请求/admin/product/deleteSku/{skuId}
  deleteSku(skuId){
    return request({
      method:"DELETE",
      url:`${api_name}/deleteSku/${skuId}`
    })
  },
  // /admin/product/getSkuById/{skuId}
  getSkuById(skuId){
    return request({
      method:"GET",
      url:`${api_name}/getSkuById/${skuId}`
    })
  },
};
