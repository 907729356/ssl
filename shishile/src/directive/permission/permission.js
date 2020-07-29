
import store from '@/store'

export default{
  // 有一个值 存在于权限perms就显示按钮  perms为*标识拥有所有权限
  inserted(el, binding, vnode) {
    const { value } = binding
    const perms = store.getters && store.getters.perms
    // console.log('value===',value)

    if (value && value instanceof Array && value.length > 0) {
      const permissions = value

      var hasPermission = false

      if (perms.indexOf('*') >= 0) {
        hasPermission = true
      } else {
        hasPermission = perms.some(perm => {
          return permissions.includes(perm)
        })
      }

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`need perms! Like v-permission="['GET /aaa','POST /bbb']"`)
    }
  }
}
