<template>
  <div class="hello">
    <!-- 面包屑导航-->
    <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>日常管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 用户列表主体部分-->
  <el-card>
    <el-row :gutter="25"><!-- 行内列之间的间隔 -->
      <!-- 搜索区域-->
      <el-col :span="10"><!-- 列宽 -->
        <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" :suffix-icon="Search" clearable @clear="getProfileList">
          <template #append>
            <el-button @click="getProfileList"><el-icon class="el-input__icon"><Search/></el-icon></el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="addDialogVisible=true;console.log(addDialogVisible)">添加用户</el-button>
      </el-col>
    </el-row>
    <!--用户一览 stripe隔行变色-->
    <el-table :data="profileList" class="user_list" border stripe>
      <el-table-column prop="id" type="index" /><!-- 索引列-->
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="name" label="昵称" />
      <el-table-column prop="genderName" label="性别"  />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="password" label="密码" />
      <el-table-column prop="role" label="角色" />
      <el-table-column prop="activeFlg" label="状态" width="50">
      <!-- switch开关 -->
        <template #default="scope"><!-- 不要使用slot-scope-->
          <!-- scope.row 当前行的数据-->
          <el-switch v-model.number="scope.row.activeFlg" @change="ProfileStateChanged(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" #default="scope">
        <el-button type="primary" class="mini" @click="showEditProfileDialog(scope.row.id, true)"><el-icon class="el-input__icon"><Edit/></el-icon></el-button>
        <el-button type="danger" class="mini" @click="deleteProfile(scope.row.id)"><el-icon class="el-input__icon"><Delete/></el-icon></el-button>
        <el-tooltip effect="dark" content="权限修改" placement="top-start" :enterable="false">
        <el-button type="warning" class="mini" @click="showAuthDialog(scope.row.id, scope.row.roleId)"><el-icon class="el-input__icon"><Setting/></el-icon></el-button>
        </el-tooltip>
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
    <!-- 添加用户  不要使用:visible.sync-->
    <el-dialog title="添加用户"  v-model="addDialogVisible" width="50%" align-center @closs="addDialogClosed">
      <el-form :model="addForm" :rules="formRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username" required>
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="name" required>
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender" required>
            <el-radio-group v-model="addForm.gender">
              <el-radio v-for="item in genderList" :key="item.code" :label="item.code"> {{ item.name }} </el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile" required>
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address" required>
          <el-input v-model="addForm.address"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" required>
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加用户操作按钮-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="addProfile">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 更新用户  不要使用:visible.sync-->
    <el-dialog title="修改用户"  v-model="editDialogVisible" width="50%" align-center @closs="addDialogClosed">
      <el-form :model="updateForm" :rules="formRules" ref="updateFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username" required>
          <el-input v-model="updateForm.username"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="name" required>
          <el-input v-model="updateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender" required>
            <el-radio-group v-model="updateForm.gender">
              <el-radio v-for="item in genderList" :key="item.code" :label="item.code"> {{ item.name }} </el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile" required>
          <el-input v-model="updateForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address" required>
          <el-input v-model="updateForm.address"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" required>
          <el-input v-model="updateForm.password"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加用户操作按钮-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="updateProfile">确 定</el-button>
      </span>
    </el-dialog>
    <!--权限设置-->
    <el-dialog title="权限设定"  v-model="AuthDialogVisible" width="35%" align-center @closs="authDialogClosed">
      <el-form :model="userAuth" label-width="100px" ref="authRef" >
        <el-form-item label="权限:  " prop="userAuth">
            <el-radio-group v-model="userAuth">
              <el-radio v-for="item in roleList" :key="item.code" :label="item.code"> {{ item.name }} </el-radio>
            </el-radio-group>
        </el-form-item>
        
      </el-form>
      <!-- 添加用户操作按钮-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="AuthDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="setAdmin">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
  </div>
</template>

<script>
// 使用element plus icon
import { Search,Edit,Delete,Setting } from '@element-plus/icons';
export default {
  // onload画面初期化
  created(){
    this.getProfileList();
    this.getCodeAndName('gender');
    this.getCodeAndName('roleId');
  },
  components: { 
    Search,
    Edit,
    Delete,
    Setting
  },
  data(){
    //验证邮箱
    let validateEmail = (rule, value,callback) =>{
      const regEmail = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
      if(this.addForm.email != '' && !regEmail.test(this.addForm.email)) {
        callback(new Error('请输入有效的邮箱')); 
      }
    }
    return{
      // 查询参数
      queryInfo :{
        query:null, // 名
        startDate:null,
        endDate:null,
        minsuId:null,
        catogoryCode:null,
        pageNum:1, // 页数
        pageSize:5, // 每个页显示用户数
      },
      profileList : [
      ],// 检索后的用户信息一览
      total:0,// 用户列表总检索数
      addDialogVisible: false, // 添加用户对话框显示或隐藏状态
      // form追加用户信息
      addForm:{
        username: '',
        name:'',
        gender:'',
        mobile:'',
        address:'',
        password: '',
      },
      // 修改用户信息
      updateForm:{
        username: '',
        name:'',
        gender:'',
        mobile:'',
        address:'',
        password: '',
        roleId: '',
      },
      // 用户角色权限临时存储。权限设置画面绑定用
      userAuth: '3',
      // 用户角色临时存储。权限设置画面绑定用
      authUserId: 999,
      genderList: [],
      roleList: [],
      // 修改用户信息对话框显示
      editDialogVisible: false,
      AuthDialogVisible: false, // 添加权限设定对话框显示或隐藏状态
      // 表单验证
      formRules:{
        username:[
        { required: true, message: '请输入英文用户名', trigger: 'blur' },
          { pattern: /^[a-zA-Z]+$/, message: '用户名只能为英文', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入中文或英文姓名', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message: '姓名只能为中文或英文', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
            {min:11,max:14,message:'手机号码长度在 11 ~ 14 字符', trigger:'blur'}, //长度验证
        ],
        password: [
          { required: true, message: '请输入英文或数字密码', trigger: 'blur' },
          { pattern: /^[1-9a-zA-Z]+$/, message: '密码只能为英文或数字', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message: '地址只能为中文或英文', trigger: 'blur' }
        ],
      },
    }
  },
  methods:{
    // 用户一览数据取得
    async getProfileList(){
      this.profileList=[];
      
      const {data:res} = await this.$http.get("allProfile",{ params:this.queryInfo});
      
      if(res.ProfileCounts > 0){
        this.profileList = res.data;
        res.data.forEach((item, index) => {
           
            if(item.activeFlg == "0"){
              this.profileList[index].activeFlg = false;
            }else{
              this.profileList[index].activeFlg = true;
            }
          })
        this.total = res.ProfileCounts;
      }
    },
    // 每页最大数变化处理
    handleSizeChange(newSize){
      this.queryInfo.pageSize = newSize;
      this.getProfileList();
    },
    // 页数变化处理
    handleCurrentChange(newPage){
      this.queryInfo.pageNum = newPage;
      this.getProfileList();
    },
    // 修改用户状态
    async ProfileStateChanged(userInfo){
      const {data:res} = await this.$http.put("updateState?id="+userInfo.id+"&state=" +userInfo.activeFlg+"");
      if(res != "success"){
        userInfo.id = !userInfo.id;
        return this.$message.error("用户状态更新失败！！！");
      }
      this.$message.success("用户状态更新成功！！！");
    },
    // 监听添加用户对话框关闭
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();
    },
    // 用户追加操作
    async addProfile(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid)return;
        const {data:res} = await this.$http.post("addProfile",this.addForm); 
        if(res != "success"){
          return this.$message.error("用户追加失败！！！");
        }
        this.$message.success("用户追加成功！！！");
        this.addForm = {};
        this.addDialogVisible = false;
        this.getProfileList();
      });
    },
    // 用户删除(根据主键)
    async deleteProfile(id){
      const confirmResult = await this.$confirm("此操作将永久删除用户，是否继续？","提示",{
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
        const {data:res} = await this.$http.delete("deleteProfile?id="+id);
        if(res != "success"){
          return this.$message.error("删除用户失败!");
        }else{
          this.$message.success("删除用户成功!");
          this.getProfileList();
        }
      }
    },
    // 获取要编辑的用户信息
    async showEditProfileDialog(id, editFlg){
      const {data:res} = await this.$http.get("getProfile?id="+id);

      this.updateForm =res;
      if(editFlg){
        this.editDialogVisible = true;
      }
    },
    // 修改用户状态
    async getCodeAndName(field){
      const {data:res} = await this.$http.get("getCodeName?tableName=Profile&field="+ field);
      if(res.codesCounts > 0){
        if(field == "gender"){
          this.genderList = res.data;
        }else if(field == "roleId"){
          this.roleList = res.data;
        }
      }
    },
    // 关闭更新用户窗口重置操作
    editDialogClosed(){
      this.$refs.updateFormRef.resetFields();//重置信息
    },
    // 关闭设置用户权限窗口重置操作
    authDialogClosed(){
      this.$refs.authRef.resetFields();//重置信息
    },
    async updateProfile(){
      // 表单验证
       this.$refs.updateFormRef.validate(async valid =>{
        if(!valid) return;

        // 进行用户更新
        const {data:res} = await this.$http.put("updateProfile", this.updateForm);
         if(res != "success"){
          return this.$message.error("更新用户失败!");
        }else{
          this.$message.success("更新用户成功!");
          this.editDialogVisible = false;
          this.getProfileList();
        }
      });
    },
    async showAuthDialog(id, roleId){
      // 进行用户更新
      this.userAuth = roleId + "";
      this.showEditProfileDialog(id,false);
      this.authUserId = id;
      this.AuthDialogVisible = true;

    },
    async setAdmin(){
         // 修改用户权限
      const {data:res} = await this.$http.put("updateProfileRole?id="+this.authUserId +"&roleId=" +this.userAuth+"");
        if(res != "success"){
        return this.$message.error("用户权限设置失败,请先刷新页面再次尝试!");
      }else{
        this.$message.success("用户权限设置成功!");
        this.AuthDialogVisible = false;
        this.getProfileList();
      }
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
</style>