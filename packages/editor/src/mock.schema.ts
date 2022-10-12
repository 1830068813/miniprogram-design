const cardSchema = [
  {
    type: 'number',
    label: '顶部外边距',
    key: 'style.marginTop',
  },
  {
    type: 'number',
    label: '底部外边距',
    key: 'style.marginBottom',
  },
  {
    type: 'number',
    label: '边框圆角',
    key: 'style.borderRadius',
  },
  {
    type: 'number',
    label: '宽度',
    key: 'style.width',
  },
  {
    type: 'number',
    label: '高度',
    key: 'style.height',
  },
  {
    type: 'checkbox',
    label: '可见性',
    key: 'isShow',
    trueLabel: 1,
    falseLabel: 0,
  },
  {
    type: 'image',
    label: '背景图片',
    key: 'defaultImg',
  }
]

const explain = [
  {
    type: 'number',
    label: '顶部外边距',
    key: 'style.marginTop',
  },
  {
    type: 'number',
    label: '底部外边距',
    key: 'style.marginBottom',
  },
  {
    type: 'number',
    label: '边框圆角',
    key: 'style.borderRadius',
  },
  {
    type: 'number',
    label: '宽度',
    key: 'style.width',
  },
  {
    type: 'number',
    label: '高度',
    key: 'style.height',
  },
  {
    type: 'checkbox',
    label: '可见性',
    key: 'isShow',
    trueLabel: 1,
    falseLabel: 0,
  },
  {
    type: 'image',
    label: '背景图片',
    key: 'defaultImg',
  }
]

const shop = [
  {
    type: 'number',
    label: '顶部外边距',
    key: 'style.marginTop',
  },
  {
    type: 'number',
    label: '底部外边距',
    key: 'style.marginBottom',
  },
  {
    type: 'number',
    label: '宽度',
    key: 'style.width',
  },
  {
    type: 'number',
    label: '高度',
    key: 'style.height',
  },
  {
    type: 'checkbox',
    label: '可见性',
    key: 'isShow',
    trueLabel: 1,
    falseLabel: 0,
  },
  {
    type: 'input',
    label: '跳转地址',
    key: 'url',
  },
  {
    type: 'image',
    label: '背景图片',
    key: 'defaultImg',
  }
]

const reserve = [
  {
    type: 'number',
    label: '顶部外边距',
    key: 'style.marginTop',
  },
  {
    type: 'number',
    label: '底部外边距',
    key: 'style.marginBottom',
  },
  {
    type: 'number',
    label: '宽度',
    key: 'style.width',
  },
  {
    type: 'number',
    label: '高度',
    key: 'style.height',
  },
  {
    type: 'checkbox',
    label: '可见性',
    key: 'isShow',
  },
  {
    type: 'image',
    label: '背景图片',
    key: 'defaultImg',
  },
  {
    type: 'input',
    label: '菜品预定名称',
    key: 'title.content',
  },
  {
    type: 'colorPicker',
    label: '字体颜色',
    key: 'title.style.color',
  },
  {
    type: 'input',
    label: '菜品预定描述',
    key: 'desc.content'
  },
  {
    type: 'colorPicker',
    label: '字体颜色',
    key: 'desc.style.color',
  },
]

const mine = [
  ...cardSchema,
  {
    type: 'checkbox',
    label: '解绑',
    key: 'unbound',
    trueLabel: 1,
    falseLabel: 0,
  },
  {
    type: 'checkbox',
    label: '充值',
    key: 'recharge',
    trueLabel: 1,
    falseLabel: 0,
  }
]

const container = [
  {
    type: 'radioGroup',
    label: '布局类型',
    key: 'layout',
    link: {
      grid: [
        {
          type: 'number',
          label: '列',
          key: 'grid',
        },
      ],
      swiper: []
    },
    options: [
      { label: '栅格布局', value: 'grid', },
      { label: '轮播', value: 'swiper' },
    ]
  }
]

const menuItem = [
  {
    type: 'input',
    label: '标题',
    key: 'title',
  },
  {
    type: 'checkbox',
    label: '可见性',
    key: 'isShow',
  }
]

const desc = [
  {
    type: 'editor',
    label: '说明内容',
    key: 'content',
  },
  {
    type: 'checkbox',
    label: '可见性',
    key: 'isShow',
  },
]

const link = [
  {
    type: 'checkbox',
    label: '可见性',
    key: 'isShow'
  },
  {
    type: 'input',
    label: '客服电话',
    key: 'phone',
  },
]

const entry = [
  {
    type: 'checkbox',
    label: '可见性',
    key: 'isShow',
    trueLabel: 1,
    falseLabel: 0,
  },
  {
    type: 'input',
    label: '名称',
    key: 'title',
  },
  {
    type: 'input',
    label: '描述',
    key: 'desc',
  },
  {
    type: 'image',
    label: '背景图片',
    key: 'defaultImg',
  }
]

const globalConfig = [
  {
    type: 'colorPicker',
    label: '主题色',
    key: 'color'
  },
  {
    type: 'colorPicker',
    label: '空记录背景色',
    key: 'emptyColor',
  },
  {
    type: 'colorPicker',
    label: '气泡颜色',
    key: 'bubbleColor',
  },
  {
    type: 'image',
    label: '登录背景图片',
    key: 'loginBg',
  }
]

const text = [
  {
    type: 'colorPicker',
    label: '字体颜色',
    key: 'style.color',
  },
  {
    type: 'number',
    label: '字体大小',
    key: 'style.fontSize',
  }
]

const image = [
  // {
  //   type: 'number',
  //   label: '宽度',
  //   key: 'style.width',
  // },
  // {
  //   type: 'number',
  //   label: '高度',
  //   key: 'style.height',
  // },
  {
    type: 'image',
    label: '图片',
    key: 'img',
  }
]

export const schema = {
  image,
  text,
  globalConfig,
  card: cardSchema,
  explain,
  shop,
  mine,
  reserve,
  container,
  menuItem,
  desc,
  link,
  entry,
}
