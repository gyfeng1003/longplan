/**
 * 表单校验逻辑
 */

// 表单校验规则
const validators = {
  required: {
    rule: /.+/,
    msg: '请将信息填写完整'
  },
  mobile: {
    rule: /^[\d]{11}$/,
    msg: '手机号格式不正确'
  },
  password: {
    rule: /^[a-zA-Z0-9]{6,16}$/,
    msg: '请输入6-16位的密码'
  },
  email: {
    rule: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
    msg: '邮箱格式不正确'
  },
  username: {
    rule: /[\u4E00-\u9FA5a-zA-Z]{1,32}$/,
    msg: '请输入中英文字符作为用户名'
  },
  code: {
    rule: /^\d{4}$/,
    msg: '验证码格式不正确'
  },
  same: {
    rule (val='', sVal='') {
      return val===this.data[sVal]
    },
    msg: '密码不一致'
  }
}

var check = function (value, opt, key, context) {
    if (typeof opt.type == 'function') {
      if (opt.type()) {
        context.$toast(opt.message)
        return true;
      }
      return false;
    }
    if(opt.type == 'required'){
      if (!_test(opt.type, value)) {
        context.$toast(opt.message)
        return true;
      }
    }else{
      if (value!='' && !_test(opt.type, value)) {
        context.$toast(opt.message)
        return true;
      }
    }

    return false;
  },
  _test = function (name, value) {
    if (typeof validators[name] == 'function') return validators[name](value);
    return validators[name].rule.test(value);
  }

const validate = function(data, test, context){
  for (var key in test) {
    if (test[key] instanceof Array) {
      for (var j = 0; j < test[key].length; j++) {
        if (check(data[key].trim(), test[key][j], key, context)) {
          return true;
        }
      }
    } else if (check(data[key].trim(), test[key], key, context)) {
      return true;
    }
  }
}

export default validate
