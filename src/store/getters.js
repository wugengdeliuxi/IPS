const getters = {
  token: (state) => state.user.token,
  sidebar: (state) => state.app.sidebar,
  size: (state) => state.app.size,
  device: (state) => state.app.device,
  avatar: (state) => state.user.avatar,
  roles: (state) => state.user.roles,
  permission_routes: (state) => state.permission.routes,
  cachedViews: (state) => state.tagsView.cachedViews,
  visitedViews: (state) => state.tagsView.visitedViews
}
export default getters
