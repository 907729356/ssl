<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <!-- <el-select v-model="schoolId" clearable placeholder="请选择学校" @change="schoolChange"> -->
      
      <el-select v-model="statusId" clearable placeholder="请选择状态" @change="statusChange">
        <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="labId" placeholder="请选择实验室" @change="labChange">
        <el-option v-for="item in labList" :key="item.value" :label="item.name" :value="item.id" />
      </el-select>
     </div>

    <div class="operator-container" style="dispaly:flex;justify-content:space-between;">     
      <div>
        <el-button v-permission="['POST /admin/drug/application/add']" class="filter-item" type="success" @click="handleBatchReject">保存</el-button>
      </div>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" fit highlight-current-row @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" /> -->
      
      <el-table-column align="center" label="ID" prop="id" />
      <el-table-column align="center" label="品名" prop="name"  show-overflow-tooltip/>
      <el-table-column align="center" label="cas号" prop="cas" />
      <el-table-column align="center" label="重量" prop="weight">
        
      </el-table-column>
      <el-table-column align="center" label="分类" prop="name" show-overflow-tooltip/>
      <el-table-column align="center" label="创建人" prop="addUser" show-overflow-tooltip />
      <el-table-column align="center" label="提交人" prop="commitUser"  show-overflow-tooltip/>
      <el-table-column align="center" label="审批人" prop="approvalUser"  show-overflow-tooltip/>
      <el-table-column align="center" label="确认人" prop="confirmUser"  show-overflow-tooltip/>
      <el-table-column align="center" label="备注" prop="remark"  show-overflow-tooltip/>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />  

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>

  </div>
</template>

<script>

import { schoolList, schoolZone, laboratoryList, labList, saveStatus } from '@/api/materiel'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import _ from 'lodash'

export default {
  name: 'materiellist',
  components: { BackToTop, Pagination },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
      },
      list: [],
      total: 0,
      listLoading: false,
      dialogFormVisible: false,
      dialogStatus: 'create',//create新增 else编辑
      labList: [],
      schoolList: [],
      zoneList: [],
      schoolId: '',
      schoolName: '',
      zoneId: '',
      zoneName: '',
      labId: '',
      labName: '',
      multipleSelection: [],
      tableData: [],
      dialogmultipleSelection: [],
      dialoSelData: [],
      statusList: [],
      searchType: '',
      searchTypeValue: '',
      searchName: '',
      statusId: '',
      searchTypeList: [],
      contentDialogVisible: false,
      downloadLoading: false
    }
  },
  created() {
    this.getBrand()
    // this.getList()
    
    this.statusList = [
      {value:'1',label:'未提交'},
      {value:'2',label:'已提交'},
      {value:'3',label:'已审批'},
      {value:'4',label:'已确定'},
    ]
  },
  methods: {
    getBrand() {
      laboratoryList()
        .then(response => {
          this.labList = response.data.data.list
          if (this.labList.length) {
            this.labId = this.labList[0].id
            this.labName = this.labList[0].name
            this.getList()
          }
        })
    },
    getList() {
      this.listLoading = true
      labList({lab:this.labId, status: this.statusId})
        .then(response => {
          this.list = response.data.data.list
          this.total = response.data.data.total
          this.listLoading = false
        })
        .catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
    },
    statusChange (item){
      this.statusId = item
      this.getList()
    },
    labChange (item){
      let lab = this.labList.filter(it=>{
        return it.id === item
      })
      if (lab.length) {
        this.labName = lab[0].name || ''
      }
      this.getList()
    },
    searchTypeChange (item){
      let sel = this.searchTypeList.filter(it=>{
        return it.value === item
      })
      if (sel.length) {
        this.searchTypeValue = sel[0].label
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleBatchReject() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择至少一条记录')
        return
      }
      let checkList = this.multipleSelection.filter(it=>{
        return !it.weight
      })
      if (checkList.length) {
        this.$message.error('所有药剂重量必须填写！')
        return
      }
      const ids = []
      _.forEach(this.multipleSelection, function(item) {
        ids.push(item.id)
      })
      // saveStatus({ ids: ids })
      saveStatus(this.multipleSelection)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '保存成功'
          })
          this.getList()
        })
        .catch(response => {
          this.$notify.error({
            title: '失败',
            message: response.data.errmsg
          })
        })
    },
  }
}
</script>
