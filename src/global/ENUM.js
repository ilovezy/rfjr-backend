window.ENUM = {
  sysUserStatus: {
    freeze: '冻结',
    normal: '正常',
    cancel: '注销'
  },
  checkStatus: {
    saved: '存盘',
    wait_audit: '待审核',
    audited: '审核通过',
    unaudited: '审核不通过'
  },
  checkStatusMap: [
    {value: 'saved', label: '存盘'},
    {value: 'wait_audit', label: '待审核'},
    {value: 'audited', label: '审核通过'},
    {value: 'unaudited', label: '审核不通过'},
  ],
  obCheckStatus: {
    saved: '存盘',
    wait_audit: '待审核',
    audited: '审核通过',
    unaudited: '审核不通过',
    discard: '废弃'
  },
  obStatusTypeMap: [
    {value: 'saved', label: '存盘'},
    {value: 'wait_audit', label: '待审核'},
    {value: 'audited', label: '审核通过'},
    {value: 'unaudited', label: '审核不通过'},
    {value: 'discard', label: '废弃'}
  ],
  platformObStatusTypeMap: [
    {value: 'wait_audit', label: '待审核'},
    {value: 'audited', label: '审核通过'},
    {value: 'unaudited', label: '审核不通过'},
    {value: 'discard', label: '废弃'}
  ],
  targetType: {
    'platform': '平台',
    'merchant': '商户',
    'member': '会员',
  },
  targetTypeMap: [{
    value: 'platform',
    label: '平台'
  }, {
    value: 'merchant',
    label: '商户'
  }, {
    value: 'member',
    label: '会员'
  }],
  sex: {
    'female': '女',
    'male': '男'
  },
  borrowerType: {
    'personal': '个人',
    'enterprise': '企业'
  }
}
