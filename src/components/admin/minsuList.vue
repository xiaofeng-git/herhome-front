<template>
  <div class="hello">
    <!-- 面包屑导航-->
    <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>日常管理</el-breadcrumb-item>
    <el-breadcrumb-item>民宿管理</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 列表主体部分-->
  <el-card>
    <el-row :gutter="25"><!-- 行内列之间的间隔 -->
      <!-- 搜索区域-->
      <el-col :span="10"><!-- 列宽 -->
        <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" :suffix-icon="Search" clearable @clear="getMinsuList">
          <template #append>
            <el-button @click="getMinsuList"><el-icon class="el-input__icon"><Search/></el-icon></el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible=true;console.log(addDialogVisible)">添加民宿</el-button>
      </el-col>
    </el-row>
    <!--一览 stripe隔行变色-->
    <el-table :data="minsuList" class="user_list" border stripe>
      <el-table-column prop="minsuId"  type="index" /><!-- 索引列-->
      <el-table-column prop="minsuName" label="民宿名称"/>
      <el-table-column prop="adderess" label="地址" />
      <el-table-column prop="capacity" label="容量（*室）"  />
      <el-table-column prop="price" label="月租金"  />
      <el-table-column prop="activeFlag" label="状态" width="50">
      <!-- switch开关 -->
        <template #default="scope"><!-- 不要使用slot-scope-->
          <!-- scope.row 当前行的数据-->
          <el-switch v-model.number="scope.row.activeFlag" @change="MinsuStateChanged(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" #default="scope">
        <el-button type="primary" class="mini" @click="showEditMinsuDialog(scope.row.minsuId, true)"><el-icon class="el-input__icon"><Edit/></el-icon></el-button>
        <el-button type="danger" class="mini" @click="deleteMinsu(scope.row.minsuId)"><el-icon class="el-input__icon"><Delete/></el-icon></el-button>
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
    </div>
    <!-- 添加  不要使用:visible.sync-->
    <el-dialog title="添加"  v-model="addDialogVisible" width="50%" align-center @closs="addDialogClosed">
      <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="120px">
        <el-form-item label="民宿名称" prop="minsuName" required>
          <el-input v-model="addForm.minsuName"></el-input>
        </el-form-item>
        <el-form-item label="民宿地址" prop="adderess" required>
          <el-input v-model="addForm.adderess"></el-input>
        </el-form-item>
        <el-form-item label="月租金" prop="price" required>
          <el-input v-model="addForm.price"></el-input>
        </el-form-item>
        <el-form-item label="民宿容量" prop="capacity" required>
          <el-input v-model="addForm.capacity">
            <template #append>室</template>
          </el-input>
        </el-form-item>
      </el-form>
      <!-- 添加操作按钮-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="addMinsu">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 更新  不要使用:visible.sync-->
    <el-dialog title="修改"  v-model="editDialogVisible" width="50%" align-center @closs="addDialogClosed">
      <el-form :model="updateForm" :rules="formRules" ref="updateFormRef" label-width="100px">
        <el-form-item label="民宿名称" prop="minsuName" required>
          <el-input v-model="updateForm.minsuName"></el-input>
        </el-form-item>
        <el-form-item label="月租金" prop="price" required>
          <el-input v-model="updateForm.price"></el-input>
        </el-form-item>
        <el-form-item label="民宿地址" prop="adderess" required>
          <el-input v-model="updateForm.adderess"></el-input>
        </el-form-item>
        <el-form-item label="民宿容量" prop="capacity" required>
          <el-input v-model="updateForm.capacity">
            <template #append>室</template></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加操作按钮-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="updateMinsu">确 定</el-button>
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
        date:null,
        minsuId:null,
        catogoryCode:null,
        pageNum:1, // 页数
        pageSize:5, // 每个页显示数
      },
      minsuList : [
      ],// 检索后的信息一览
      total:0,// 列表总检索数
      addDialogVisible: false, // 添加对话框显示或隐藏状态
      catogoryList:[],
      kindList:[],
      // form追加信息
      addForm:{
        minsuName:'',
        adderess:'',
        capacity:'',
        price:0.0,
        activeFlag:'',
      },
      // 修改信息
      updateForm:{
        minsuName:'',
        adderess:'',
        capacity:'',
        price:0.0,
        activeFlag:'',
      },

      // 修改信息对话框显示
      editDialogVisible: false,
      AuthDialogVisible: false, // 添加权限设定对话框显示或隐藏状态
      // 表单验证
      formRules:{
        minsuName: [
          { required: true, message: '请输入中文或英文民宿名称', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message: '民宿名称只能为中文或英文', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message: '地址只能为中文或英文', trigger: 'blur' }
        ],
        capacity: [
          { required: true, message: '请输入容量', trigger: 'blur' },
          { type: 'number', message: '容量必须为数字', trigger: 'blur',  transform: (value) => Number(value) }
        ],
        price: [
          { required: true, message: '请输入月租金', trigger: 'blur' },
          { type: 'number', message: '月租金必须为数字', trigger: 'blur', transform: (value) => Number(value) }
        ],
      },
    }
  },
  methods:{
    // 一览数据取得
    async getMinsuList(){
      this.minsuList=[];
      const {data:res} = await this.$http.get("allMinsu",{ params:this.queryInfo});
      
      if(res.MinsuCounts > 0){
        this.minsuList = res.data;
        res.data.forEach((item, index) => {
           
           if(item.activeFlag == "0"){
             this.minsuList[index].activeFlag = false;
           }else{
             this.minsuList[index].activeFlag = true;
           }
         })
        this.total = res.MinsuCounts;
      }
    },
    // 每页最大数变化处理
    handleSizeChange(newSize){
      this.queryInfo.pageSize = newSize;
      this.getMinsuList();
    },
    // 页数变化处理
    handleCurrentChange(newPage){
      this.queryInfo.pageNum = newPage;
      this.getMinsuList();
    },
    // 修改状态
    async MinsuStateChanged(minsuInfo){
      const {data:res} = await this.$http.put("updateMinsuState?id="+minsuInfo.minsuId+"&state=" +minsuInfo.activeFlag+"");
      if(res != "success"){
        minsuInfo.minsuId = !minsuInfo.minsuId;
        return this.$message.error("状态更新失败！！！");
      }
      this.$message.success("状态更新成功！！！");
    },
    // 监听添加对话框关闭
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();
    },
    // 追加操作
    async addMinsu(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid)return;
        const {data:res} = await this.$http.post("addMinsu",this.addForm); 
        if(res != "success"){
          return this.$message.error("追加失败！！！");
        }
        this.$message.success("追加成功！！！");
        this.addForm = {};
        this.addDialogVisible = false;
        this.getMinsuList();
      });
    },
    // 删除(根据主键)
    async deleteMinsu(id){
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
        const {data:res} = await this.$http.delete("deleteMinsu?id="+id);
        if(res != "success"){
          return this.$message.error("删除失败!");
        }else{
          this.$message.success("删除成功!");
          this.minsuList = [];
          this.getMinsuList();
        }
      }
    },
    // 获取要编辑的信息
    async showEditMinsuDialog(id, editFlg){
      const {data:res} = await this.$http.get("getMinsu?id="+id);

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
    async updateMinsu(){
      // 表单验证
       this.$refs.updateFormRef.validate(async valid =>{
        if(!valid) return;

        // 进行更新
        const {data:res} = await this.$http.put("updateMinsu", this.updateForm);
         if(res != "success"){
          return this.$message.error("更新失败!");
        }else{
          this.$message.success("更新成功!");
          this.editDialogVisible = false;
          this.getMinsuList();
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

</style>