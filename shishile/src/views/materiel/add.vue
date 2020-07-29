<template>
  <div class="app-container">

    <el-card class="box-card">
      <h3>药剂信息</h3>
      <el-form ref="goods" :model="goods" label-width="150px">
        <!-- <el-form-item label="商品ID" prop="id">
          <el-input v-model="goods.id" disabled />
        </el-form-item> -->
        <el-form-item label="cas号">
          <el-input v-model="goods.cas"  placeholder="cas号"/>
        </el-form-item>
        <el-form-item label="药品名">
          <el-input v-model="goods.name"  placeholder="药品名"/>
        </el-form-item>
        <el-form-item label="别名">
          <el-input v-model="goods.otherName"  placeholder="别名(别名之间请用;符号隔开)"/>
        </el-form-item>
        <el-form-item label="英文名">
          <el-input v-model="goods.engName"  placeholder="英文名"/>
        </el-form-item>

        <el-form-item label="英文别名">
          <el-input v-model="goods.otherEngName" placeholder="英文别名(别名之间请用;符号隔开)" />
        </el-form-item>
        <el-form-item label="化学分子式">
          <el-input v-model="goods.formula" placeholder="化学分子式" />
        </el-form-item>

        <el-form-item label="处置分类">
          <el-select v-model="goods.typeId" clearable  @change="typeChange">
            <el-option v-for="item in typeList" :key="item.value" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

      </el-form>
    </el-card>

    <div class="op-container">
      <el-button @click="handleCancel">重置</el-button>
      <el-button v-permission="['POST /admin/drug/dic/add']" type="primary" @click="handleAdd">添加药剂</el-button>
    </div>

  </div>
</template>

<script>
import { drugTypeList, materielAdd } from '@/api/materiel'
import { MessageBox } from 'element-ui'
import { getToken } from '@/utils/auth'

export default {
  name: 'materieladd',
  components: { },
  data() {
    return {
      typeList: [],
      goods: { 
        cas:'',
        name:'',
        otherName:'',
        engName:'',
        otherEngName:'',
        formula:'',
        typeId:'',
        type:'',
      },
      // rules: {
      //   name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
      //   type: [{ required: true, message: '处置类型不能为空', trigger: 'blur' }]
      // },
    }
  },
  computed: {
  },
  created() {
    this.init()
  },
  methods: {
    typeChange (item){
      let types = this.typeList.filter(it=>{
        return it.id === item
      })
      if (types.length) {
        this.goods.type = types[0].name || ''
      }
    },
    getType() {
      drugTypeList()
        .then(response => {
          this.typeList = response.data.data.list
        })
    },
    init: function() {
      this.getType()
    },
    handleCancel: function() {
      // this.$router.push({ path: '/goods/list' })
      this.goods = {
        cas:'',
        name:'',
        otherName:'',
        engName:'',
        otherEngName:'',
        formula:'',
        type:'',
        typeId:'',
      }
    },
    handleAdd: function() {
      if (!this.goods.cas) {
        this.$message.error('cas号不能为空')
        return
      }
      if (!this.goods.name) {
        this.$message.error('药品名称不能为空')
        return
      }
      // if (!this.goods.formula) {
      //   this.$message.error('化学分子式不能为空')
      //   return
      // }
      if (!this.goods.type) {
        this.$message.error('处置分类不能为空')
        return
      }
      materielAdd(this.goods)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '创建成功'
          })
          this.handleCancel()
        })
        .catch(response => {
          MessageBox.alert('业务错误：' + response.data.errmsg, '警告', {
            confirmButtonText: '确定',
            type: 'error'
          })
        })
    },
  }
}
</script>


<style>
.el-card {
  margin-bottom: 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.input-new-keyword {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar {
  width: 145px;
  height: 145px;
  display: block;
}
.op-container {
  display: flex;
  justify-content: center;
}
</style>
