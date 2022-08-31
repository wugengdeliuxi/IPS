<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} /> )
      } else {
        vnodes.push(<span class={['icon-bg']}><svg-icon icon-class={icon} /></span>)
      }
    }

    if (title) {
      vnodes.push(<span slot="title">{title}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped lang="scss">
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
.icon-bg {
  padding: 8px 6px;
  background: $bgCommonColor;
  border-radius: 6px;
  margin-right: 16px;
}
</style>
