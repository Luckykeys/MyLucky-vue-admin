import request from "@/utils/request";

const api_name = "/admin/product/baseTrademark";

export default {
  //获取trademark列表数据展示
  getTrademarkList() {
    return request({
      method: "GET",
      url: `${api_name}/getTrademarkList`
    });
  },
  //获取品牌分页列表的请求
  getPageList(page, limit) {
    return request({
      method: "GET",
      url: `${api_name}/${page}/${limit}`
    });
  },
  //增加trademark列表数据展示
  addTrademarkList(data) {
    return request({
      method: "POST",
      url: `${api_name}/save`,
      data
    });
  },
  //修改trademark列表数据展示
  updateTrademarkList(data) {
    return request({
      method: "PUT",
      url: `${api_name}/update`,
      data
    });
  },

  //删除trademark列表数据展示
  removeTrademarkList(id) {
    return request({
      method: "DELETE",
      url: `${api_name}/remove/${id}`
    });
  }
};
