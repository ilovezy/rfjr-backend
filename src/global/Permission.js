import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    // let roles = store.state.actionPermission.permissionList || []
    let roles = USER.getPermissions() || []

    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value

      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role)
      })

      // 这段禁用掉可以去除前端的所有权限限制
      // if (!hasPermission) {
      //   el.style.display = 'none'
      // }
    } else {
      throw new Error(`需要权限`)
    }
  }
}
