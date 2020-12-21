// export {default as login} from './acl/login' // {default: {}}
// export {default as user} from './acl/user'
// export {default as role} from './acl/role'
// export {default as permission} from './acl/permission'
// export {default as category} from './category'
// export {default as clientUser} from './clientUser'
// export {default as order} from './order'
// export {default as trademark} from './product/trademark'
// export {default as attrs} from './product/attrs'
// export {default as spu} from './product/spu'
// export {default as sku} from './product/sku'


const context = require.context(".", true, /\.js$/);
// console.log(context); //context是一个函数
// console.log(context.keys());
//["./acl/login.js", "./acl/permission.js", "./acl/role.js", "./acl/user.js", "./category/index.js", "./clientUser/index.js", "./index.js", "./order/index.js", "./product/attrs.js", "./product/sku.js", "./product/spu.js", "./product/trademark.js", "./test.js"]
const api = context
  .keys()
  .map(modulePath => {
    const names = modulePath.split("/");
    // console.log(names) // [".", "acl", "login.js"]
    let moduleName = names[2] && names[2].slice(0, -3);
    // console.log(moduleName);
    if (moduleName) {
      moduleName = moduleName === "index" ? names[1] : moduleName;
    }
    return {
      moduleName,
      modulePath
    };
  })
  .filter(module => module.moduleName) //过滤掉undefined
  .reduce((modules,module)=>{
    modules[module.moduleName] = context(module.modulePath).default
    return  modules
  },{})

console.log(api);

export default api

