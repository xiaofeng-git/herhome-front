<template>
  <div class="hello">
    <!-- 面包屑导航-->
    <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>日常管理</el-breadcrumb-item>
    <el-breadcrumb-item>订单管理</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 列表主体部分-->
  <el-card>
    <el-row :gutter="25"><!-- 行内列之间的间隔 -->
      <!-- 搜索区域-->
      <el-col :span="1" class="el-col-h4">
        <h4>民宿:</h4>  
      </el-col>
      <el-col :span="3"><!-- 列宽 -->
        <el-select v-model="queryInfo.minsuId" class="m-2" placeholder="选择民宿" size="large" clearable>
          <el-option
            v-for="item in minsuList"
            :key="item.minsuId"
            :label="item.minsuName"
            :value="item.minsuId"
          />
        </el-select>
      </el-col>
      <el-col :span="1.5" class="el-col-h4">
        <h4>订单开始日期:</h4>
      </el-col>
      <el-col :span="3.5">
        <el-date-picker v-model="queryInfo.startDate" type="date" placeholder="订单开始日期" :size="size"/>
      </el-col>
      <el-col :span="1.5" class="el-col-h4">
        <h4>订单终止日期:</h4>
      </el-col>
      <el-col :span="3.5">
        <el-date-picker v-model="queryInfo.endDate" type="date" placeholder="订单终了日期" :size="size"/>
      </el-col>
      <el-col :span="1.5">
          <el-button type="primary" @click="getBuyList">检索</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" @click="addDialogVisible=true;console.log(addDialogVisible)">新的订单</el-button>
      </el-col>
    </el-row>
    <!--一览 stripe隔行变色-->
    <el-table :data="buyList" class="user_list" border stripe>
      <el-table-column prop="id"  type="index" /><!-- 索引列-->
      <el-table-column prop="minsuName" label="订单发生的民宿"/>
      <el-table-column prop="userName" label="用户名称"/>
      <el-table-column prop="startDate" label="入住日期" />
      <el-table-column prop="endDate" label="退房日期" />
      <el-table-column prop="people" label="人数" />
      <el-table-column prop="money" label="订单金额"  />
      <el-table-column prop="platformName" label="平台" />
      <el-table-column label="操作" #default="scope">
        <el-button type="primary" class="mini" @click="showEditBuyDialog(scope.row.id, true)"><el-icon class="el-input__icon"><Edit/></el-icon></el-button>
        <el-button type="danger" class="mini" @click="deleteBuy(scope.row.id)"><el-icon class="el-input__icon"><Delete/></el-icon></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页区-->
    <div class="pageChange">
      <!-- size-change 每页最大个数变化 current-change 当前页数变化-->
      <el-pagination
      v-model:current-page="queryInfo.pageNum"
      v-model:page-size="queryInfo.pageSize"
      :page-sizes="[1, 2, 5, 100]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  <h2>总计：{{ sum }}元</h2>
    </div>
    <!-- 添加  不要使用:visible.sync-->
    <el-dialog title="添加"  v-model="addDialogVisible" width="50%" align-center @closs="addDialogClosed">
      <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="120px">
        <el-form-item label="民宿" prop="minsuId" required>
          <el-select v-model="addForm.minsuId" class="m-2" placeholder="选择民宿" size="large" clearable>
          <el-option
            v-for="item in minsuList"
            :key="item.minsuId"
            :label="item.minsuName"
            :value="item.minsuId"
          />
        </el-select>
        </el-form-item>
        <el-form-item label="客户名称" prop="userName" required>
        <el-input
          v-model="addForm.userName"
          placeholder="输入客户名称"
          class="input-with-select"
        />
        </el-form-item>
        <el-form-item label="入住日期" prop="startDate" required>
          <el-date-picker v-model="addForm.startDate" type="date" placeholder="入住日期" :size="size"/>
        </el-form-item>
        <el-form-item label="退房日期" prop="endDate" required>
          <el-date-picker v-model="addForm.endDate" type="date" placeholder="退房日期" :size="size"/>
        </el-form-item>
        <el-form-item label="订单金额" prop="money">
          <el-input v-model="addForm.money"></el-input>
        </el-form-item>
        <el-form-item label="人数" prop="people" >
          <el-input v-model="addForm.people"></el-input>
        </el-form-item>
        <el-form-item label="平台 " prop="platform" >
          <el-select v-model="addForm.platform" class="m-2" placeholder="选择平台" size="large" clearable>
          <el-option
            v-for="item in platformList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
        </el-form-item>
      </el-form>
      <!-- 添加操作按钮-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="addBuy">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 更新  不要使用:visible.sync-->
    <el-dialog title="修改"  v-model="editDialogVisible" width="50%" align-center @closs="addDialogClosed">
      <el-form :model="updateForm" :rules="formRules" ref="updateFormRef" label-width="100px">
        <el-form-item label="民宿" prop="minsuId" required>
          <el-select v-model="updateForm.minsuId" class="m-2" placeholder="选择民宿" size="large" clearable>
          <el-option
            v-for="item in minsuList"
            :key="item.minsuId"
            :label="item.minsuName"
            :value="item.minsuId"
          />
        </el-select>
        </el-form-item>
        <el-form-item label="客户名称" prop="userName" required>
        <el-input
          v-model="updateForm.userName"
          placeholder="输入客户名称"
          class="input-with-select"
        >
          </el-input>
        </el-form-item>
        <el-form-item label="入住日期" prop="startDate" required>
          <el-date-picker v-model="updateForm.startDate" type="date" placeholder="入住日期" :size="size"/>
        </el-form-item>
        <el-form-item label="退房日期" prop="endDate" required>
          <el-date-picker v-model="updateForm.endDate" type="date" placeholder="退房日期" :size="size"/>
        </el-form-item>
        <el-form-item label="订单金额" prop="money">
          <el-input v-model="updateForm.money"></el-input>
        </el-form-item>
        <el-form-item label="人数" prop="people" >
          <el-input v-model="updateForm.people"></el-input>
        </el-form-item>
        <el-form-item label="平台 " prop="platform" >
          <el-select v-model="updateForm.platform" class="m-2" placeholder="选择平台" size="large" clearable>
          <el-option
            v-for="item in platformList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
        </el-form-item>
      </el-form>
      <!-- 添加操作按钮-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="updateBuy">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
  </div>
</template>

<script>
// 使用element plus icon
import { Search,Edit,Delete,Setting } from '@element-plus/icons';
import { ref } from 'vue'

const size = ref<'default' | 'large' | 'small'>('default')
export default {
  // onload画面初期化
  created(){
    this.getBuyList();
    this.getProdList();
    this.getPlatformList("platform");
    this.getMinsuList();
  },
  components: { 
    Search,
    Edit,
    Delete,
    Setting
  },
  data(){
    // //验证邮箱
    // let validateEmail = (rule, value,callback) =>{
    //   const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    //   if(this.addForm.email != '' && !regEmail.test(this.addForm.email)) {
    //     callback(new Error('请输入有效的邮箱')); 
    //   }
    // }
    return{
      // 查询参数
      queryInfo :{
        query:null, // 名
        startDate:null,
        endDate:null,
        minsuId:null,
        catogoryCode:null,
        pageNum:1, // 页数
        pageSize:5, // 每个页显示数
      },
      buyList : [
      ],// 检索后的信息一览
      total:0,// 列表总检索数
      sum:0,//合计金额
      addDialogVisible: false, // 添加对话框显示或隐藏状态
      minsuList:[], // 民宿一览
      prodList:[],  // 产品列表
      platformList:[],
      // form追加信息
      addForm:{
        startDate:'',
        userId:'',
        userName:'',
        endDate:'',
        money:0.0,
        people:1,
        platform:'',
        minsuId:'',
        minsuName:'',
      },
      // 修改信息
      updateForm:{
        startDate:'',
        userId:'',
        userName:'',
        endDate:'',
        money:0.0,
        people:1,
        platform:'',
        minsuId:'',
        minsuName:'',
      },

      // 修改信息对话框显示
      editDialogVisible: false,
      AuthDialogVisible: false, // 添加权限设定对话框显示或隐藏状态
      // 表单验证
      formRules:{
        userName:[
          { required: true, message: '请输入中文或英文顾客名字', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message: '顾客名字只能为中文或英文', trigger: 'blur' }
        ],
        startDate:[
        { required: true, message: '请输入开始时间', trigger: 'blur' },
        ],
        endDate:[
          { required: true, message: '请输入日期', trigger: 'blur' },
        ],
        minsuId:[
          { required: true, message: '请选择民宿', trigger: 'blur' },
        ],
        content: [
          { required: true, message: '请输入中文或英文清洁内容', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message: '清洁内容只能为中文或英文', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '请输入中文或英文备注', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message: '备注只能为中文或英文', trigger: 'blur' }
        ],
        money: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { type: 'number', message: '金额必须为数字', trigger: 'blur' ,  transform: (value) => Number(value)}
        ],
        people: [
          { required: true, message: '请输入人数', trigger: 'blur' },
          { type: 'number', message: '金额必须为人数', trigger: 'blur' ,  transform: (value) => Number(value)}
        ]
      },
    }
  },
  methods:{
    // 一览数据取得
    async getBuyList(){
      this.buyList=[];
      this.sum = 0;
      const {data:res} = await this.$http.get("allBuy",{ params:this.queryInfo});
      if(res.BuyCounts > 0){
        this.buyList = res.data;
        this.buyList.forEach (item => {
          this.sum += item.money;
        });
        this.total = res.BuyCounts;
      }
    },
    // 每页最大数变化处理
    handleSizeChange(newSize){
      this.queryInfo.pageSize = newSize;
      this.getBuyList();
    },
    // 获取民宿一览
    async getMinsuList(){
      const {data:res} = await this.$http.get("allActiveMinsu",{ params:this.queryInfo});
      if(res.MinsuCounts > 0){
        this.minsuList = res.data;
      }
    },
    // 获取平台一览
    async getPlatformList(field){
      this.platformList=[];
      const {data:res} = await this.$http.get("getCodeName?tableName=Buy&field="+ field);
      if(res.codesCounts > 0){
        if(field == "platform"){
          this.platformList = res.data;
        }
      }
    },
    // 获取产品一览
    async getProdList(){
      const {data:res} = await this.$http.get("allProduct",{ params:this.queryInfo});
      if(res.ProductCounts > 0){
        this.prodList = res.data;
      }
    },
    // 页数变化处理
    handleCurrentChange(newPage){
      this.queryInfo.pageNum = newPage;
      this.getBuyList();
    },

    // 监听添加对话框关闭
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();
    },
    // 追加操作
    async addBuy(){
      this.$refs.addFormRef.validate(async valid=>{
        console.log(valid);
        if(!valid)return;
        const {data:res} = await this.$http.post("addBuy",this.addForm); 
        if(res != "success"){
          return this.$message.error("追加失败！！！");
        }
        this.$message.success("追加成功！！！");
        this.addDialogVisible = false;
        this.addForm = {};
        this.getBuyList();
      });
    },
    // 删除(根据主键)
    async deleteBuy(id){
      const confirmResult = await this.$confirm("此操作将永久删除，是否继续？","提示",{
        confirmButtonText:"确定",
        CancelButtonText:"取消",
        type: "warning"
      }).catch(() => {
          return this.$message({
            type: 'info',
            message: '已取消删除'
          });
      });     
      if(confirmResult == "confirm"){ // 确定
        const {data:res} = await this.$http.delete("deleteBuy?id="+id);
        if(res != "success"){
          return this.$message.error("删除失败!");
        }else{
          this.$message.success("删除成功!");
          this.getBuyList();
        }
      }
    },
    // 获取要编辑的信息
    async showEditBuyDialog(id, editFlg){
      const {data:res} = await this.$http.get("getBuy?id="+id);

      this.updateForm =res;
      if(editFlg){
        this.editDialogVisible = true;
      }
    },
    // 关闭更新窗口重置操作
    editDialogClosed(){
      this.$refs.updateFormRef.resetFields();//重置信息
    },
    // 关闭设置权限窗口重置操作
    authDialogClosed(){
      this.$refs.authRef.resetFields();//重置信息
    },
    async updateBuy(){
      // 表单验证
       this.$refs.updateFormRef.validate(async valid =>{
        if(!valid) return;
        this.updateForm.startTime = this.updateForm.startTimeDate;
        this.updateForm.endTime = this.updateForm.endTimeDate;
        // 进行更新
        const {data:res} = await this.$http.put("updateBuy", this.updateForm);
         if(res != "success"){
          return this.$message.error("更新失败!");
        }else{
          this.$message.success("更新成功!");
          this.editDialogVisible = false;
          this.getBuyList();
        }
      });
    },
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .el-breadcrumb{
    margin-bottom: 15px;
    font-size: 17px
  }
  .el-input {
    .el-input-group__append{
      background-color: #FFF;
    }
  }
  .user_list{
    margin-top: 15px;
  }
  .mini{
    min-height: 10px;
    padding: 1px 1px;
    font-size: 12px;
    border-radius: calc(var(--el-border-radius-base) - 1px);
  }
  .pageChange{
    margin-top:5px;
  }

.el-date-picker {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
.el-col-h4{
  margin-top: -15px;
}
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>