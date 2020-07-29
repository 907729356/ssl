<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <!-- <el-select v-model="schoolId" clearable placeholder="请选择学校" @change="schoolChange"> -->
      <el-select v-model="schoolId" placeholder="请选择学校" @change="schoolChange">
        <el-option v-for="item in schoolList" :key="item.value" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="zoneId" placeholder="请选择校区" @change="zoneChange">
        <el-option v-for="item in zoneList" :key="item.value" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="labId" placeholder="请选择实验室" @change="labChange">
        <el-option v-for="item in labList" :key="item.value" :label="item.name" :value="item.id" />
      </el-select>
     </div>

    <div class="operator-container" style="dispaly:flex;justify-content:space-between;">     
      <el-button v-permission="['POST /admin/drug/application/add']" class="filter-item" type="success" @click="handleAdd">新增</el-button>
      <div>
        <el-button v-permission="['POST /admin/drug/application/commit']" class="filter-item" type="success" @click="handleBatchRecept">提交</el-button>
        <el-button v-permission="['POST /admin/drug/application/add']" class="filter-item" type="success" @click="handleBatchReject">保存</el-button>
      </div>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      
      <el-table-column align="center" label="品名" prop="name" />
      <el-table-column align="center" label="cas号" prop="cas" />
      <el-table-column align="center" label="重量" prop="weight">
        <template slot-scope="scope">
          <el-input v-model="scope.row.weight" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="分类" prop="name" show-overflow-tooltip/>
      <el-table-column align="center" label="备注" prop="remark" >
          <template slot-scope="scope">
            <el-input v-model="scope.row.remark" />
          </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/drug/application/delete']" type="danger" size="mini" @click="deleteRow(scope.$index, scope.row, list)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 添加或修改对话框 -->
    <el-dialog :title="dialogStatus?'添加':'编辑'" style="minWidth:600px;" :destroy-on-close="true" :visible.sync="dialogFormVisible" width="80%">
          <div style="widht:100%;text-align:center;minWidth:400px;">
            
          <el-select v-model="searchType" placeholder="请选搜索类型" style="width:120px;" @change="searchTypeChange">
            <el-option v-for="item in searchTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
           <el-input style="width:200px;" :placeholder="`请输入${searchTypeValue}`" v-model.trim="searchName"/>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          </div>
          <div style="minWidth:400px;">
            <el-table
              ref="multipleTable"
              :data="tableData"
              v-loading="listLoading"
              element-loading-text="正在搜索中。。。"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="dialohandleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                label="cas号"
                width="120">
                <template slot-scope="scope">{{ scope.row.cas }}</template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="品名"
                width="120">
              </el-table-column>
              <el-table-column
                prop="otherName"
                label="别名"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="engName"
                label="英文名"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="otherEngName"
                label="英文别名"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="formula"
                label="化学分子式"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="type"
                label="处置分类"
                width="120"
                show-overflow-tooltip>
              </el-table-column>
            </el-table>
          </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">添加</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibility-height="100" />
    </el-tooltip>

  </div>
</template>

<script>

import { schoolList, schoolZone, laboratoryList, queryList, searchList, drugCommit, saveStatus, delRowData } from '@/api/materiel'
import BackToTop from '@/components/BackToTop'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import _ from 'lodash'

export default {
  name: 'materielcreate',
  components: { BackToTop, Pagination },
  data() {
    return {
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
      searchType: '',
      searchTypeValue: '',
      searchName: '',
      searchTypeList: [],
      contentDialogVisible: false,
      downloadLoading: false
    }
  },
  created() {
    this.getSchool()
    this.getZone()
    this.getBrand()
    this.getList()
    this.searchTypeList =[
      {value:'cas',label:'cas号'},
      {value:'name',label:'中文名/中文别名'},
      {value:'engName',label:'英文名/英文别名'},
      {value:'formula',label:'化学分支式'},
    ]
    this.searchType = this.searchTypeList[0].value
    this.searchTypeValue = this.searchTypeList[0].label
  },
  methods: {
    getSchool() {
      schoolList({})
        .then(response => {
          this.schoolList = response.data.data.list
          if (this.schoolList.length) {
            this.schoolId = this.schoolList[0].id
            this.schoolName = this.schoolList[0].name
          }
        })
    },
    getZone() {
      schoolZone({})
        .then(response => {
          this.zoneList = response.data.data.list
          if (this.zoneList.length) {
            this.zoneId = this.zoneList[0].id
            this.zoneName = this.zoneList[0].name
          }
        })
    },
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
      queryList({lab:this.labId})
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
    createData(){//添加
      if (this.dialogmultipleSelection.length === 0) {
        this.$message.error('请选择至少一条记录')
        return
      }
      let addlist = []
      this.dialogmultipleSelection.filter( (item)=> {
        let it = {...item}
        it.schoolId = this.schoolId
        it.schoolName = this.schoolName
        it.zoneId = this.zoneId
        it.zoneName = this.zoneName

        it.labId = this.labId
        it.labName = this.labName
        it.weight = ''
        it.remark = ''
        it.drugId = item.id
        delete it.id
        addlist.push(it)
      })
      // console.log("this.addlist",addlist)
      this.list = this.list.concat(addlist)
      // this.list = this.list.concat(this.dialogmultipleSelection)
      this.dialogFormVisible = false
      this.searchName = ''
      this.tableData = []
    },
    schoolChange (item){
      let school = this.schoolList.filter(it=>{
        return it.id === item
      })
      if (school.length) {
        this.schoolName = school[0].name || ''
      }
    },
    zoneChange (item){
      let zone = this.zoneList.filter(it=>{
        return it.id === item
      })
      if (zone.length) {
        this.zoneName = zone[0].name || ''
      }
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
    deleteRow(index, row, rows){
      if (row.id) {
        this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          
            this.listLoading = true
            delRowData({id:row.id})
            // delRowData(row.id)
            .then(response => {
              this.$notify.success({
                title: '成功',
                message: '删除成功'
              })
              this.getList()
              this.listLoading = false
            })
            .catch(() => {
              this.listLoading = false
            })
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });          
        });
      } else {
         rows.splice(index, 1);
         this.$notify.success({
           title: '成功',
           message: '删除成功'
         })
      }
    },
    updateData(){},
    handleFilter() {//搜索
      if (!this.searchName) {
        this.$message.error('请输入搜索内容')
        return
      }
      this.getSearchData()
    },
    getSearchData() {
      this.listLoading = true
      let inpName = this.searchName.toString().replace(/，/ig,',')//全角逗号转半角
      searchList({[this.searchType]:inpName})
        .then(response => {
          this.tableData = response.data && response.data.data && response.data.data.list
          this.listLoading = false
        })
        .catch(() => {
          this.tableData = []
          // this.total = 0
          this.listLoading = false
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    dialohandleSelectionChange(val) {
      this.dialogmultipleSelection = val
    },
    handleAdd(){
      if (!this.labId || !this.zoneId ||  !this.schoolId) {
        this.$message.error('请选择所在的学校、校区和实验室')
        return
      }
      this.dialogFormVisible = true
      // this.$router.push({ path: '/profile/create' })  

    },
    handleBatchRecept() {
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
      // _.forEach(this.multipleSelection, function(item) {
      //   ids.push(item.id)
      // })
      drugCommit(this.multipleSelection)
        .then(response => {
          this.$notify.success({
            title: '成功',
            message: '批量提交操作成功'
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
