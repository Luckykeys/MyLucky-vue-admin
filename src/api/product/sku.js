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
  }
};
