<template>
  <div class="hello">
    <!-- 面包屑导航-->
    <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>日常管理</el-breadcrumb-item>
    <el-breadcrumb-item>采购管理</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 列表主体部分-->
  <el-card>
    <el-row :gutter="25"><!-- 行内列之间的间隔 -->
      <!-- 搜索区域-->
     <el-col :span="1" class="el-col-h4">
        <h4>分类:</h4>  
      </el-col>
      <el-col :span="3"><!-- 列宽 -->
        <el-select v-model="queryInfo.catogoryCode" class="m-2" placeholder="选择分类" size="large" clearable>
          <el-option
            v-for="item in catogoryList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-col>
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
        <h4>采购开始日期:</h4>
      </el-col>
      <el-col :span="3.5">
        <el-date-picker v-model="queryInfo.startDate" type="date"  placeholder="采购开始日期" :size="size"/>
      </el-col>
      <el-col :span="1.5" class="el-col-h4">
        <h4>采购终止日期:</h4>
      </el-col>
      <el-col :span="3.5">
        <el-date-picker v-model="queryInfo.endDate" type="date"  placeholder="采购终止日期" :size="size"/>
      </el-col>
      <el-col :span="1.5">
          <el-button type="primary" @click="getProductList">检索</el-button>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" @click="addDialogVisible=true;console.log(addDialogVisible)">新的采购</el-button>
      </el-col>
    </el-row>
    <!--一览 stripe隔行变色-->
    <el-table :data="productList" class="user_list" border stripe>
      <el-table-column prop="prodId"  type="index" /><!-- 索引列-->
      <el-table-column prop="minsuName" label="民宿"/>
      <el-table-column prop="prodName" label="产品名称"/>
      <el-table-column prop="catogoryName" label="分类" />
      <el-table-column prop="kindName" label="消费种别"  />
      <el-table-column prop="origin" label="产地" />
      <el-table-column prop="buyDate" label="购买时间" />
      <el-table-column prop="prodCount" label="数量" />
      <el-table-column prop="price" label="价格" />
      <el-table-column prop="property" label="规格"/>
      <el-table-column prop="brand" label="品牌"/>
      <el-table-column prop="buyWay" label="渠道"/>
      <el-table-column label="操作" #default="scope">
        <el-button type="primary" class="mini" @click="showEditProductDialog(scope.row.prodId, true)"><el-icon class="el-input__icon"><Edit/></el-icon></el-button>
        <el-button type="danger" class="mini" @click="deleteProduct(scope.row.prodId)"><el-icon class="el-input__icon"><Delete/></el-icon></el-button>
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
        <el-form-item label="产品名称" prop="prodName" required>
          <el-input v-model="addForm.prodName"></el-input>
        </el-form-item>
        <el-form-item label="类目编号" prop="catogoryCode" required>
          <el-select v-model="addForm.catogoryCode" class="m-2" placeholder="选择类别" size="large" clearable>
          <el-option
            v-for="item in catogoryList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
        </el-form-item>
        <el-form-item label="消费种别" prop="kindCode" required>
            <el-radio-group v-model="addForm.kindCode">
              <el-radio v-for="item in kindList" :key="item.code" :label="item.code"> {{ item.name }} </el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="采购日期" prop="buyDate" required>
          <el-date-picker v-model="addForm.buyDate" type="date" placeholder="选择日期" :size="size"/>
        </el-form-item>
        <el-form-item label="数量" prop="prodCount" required>
          <el-input v-model="addForm.prodCount"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price" required>
          <el-input v-model="addForm.price"></el-input>
        </el-form-item>
        <el-form-item label="规格" prop="property">
          <el-input v-model="addForm.property"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="addForm.brand"></el-input>
        </el-form-item>
        <el-form-item label="渠道" prop="buyWay">
          <el-input v-model="addForm.buyWay"></el-input>
        </el-form-item>
        <el-form-item label="产地" prop="origin">
          <el-input v-model="addForm.origin"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加操作按钮-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="addProduct">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 更新  不要使用:visible.sync-->
    <el-dialog title="修改"  v-model="editDialogVisible" width="50%" align-center @closs="addDialogClosed">
      <el-form :model="updateForm" :rules="formRules" ref="updateFormRef" label-width="120px">
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
        <el-form-item label="产品名称" prop="prodName" required>
          <el-input v-model="updateForm.prodName"></el-input>
        </el-form-item>
        <el-form-item label="类目编号" prop="catogoryCode" required>
          <el-select v-model="updateForm.catogoryCode" class="m-2" placeholder="选择类别" size="large" clearable>
          <el-option
            v-for="item in catogoryList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
        </el-form-item>
        <el-form-item label="消费种别" prop="kindCode" required>
            <el-radio-group v-model="updateForm.kindCode">
              <el-radio v-for="item in kindList" :key="item.code" :label="item.code"> {{ item.name }} </el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="采购日期" prop="buyDate" required>
          <el-date-picker v-model="updateForm.buyDate" type="date" placeholder="选择日期" :size="size"/>
        </el-form-item>
        <el-form-item label="数量" prop="prodCount" required>
          <el-input v-model="updateForm.prodCount"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price" required>
          <el-input v-model="updateForm.price"></el-input>
        </el-form-item>
        <el-form-item label="规格" prop="property">
          <el-input v-model="updateForm.property"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-input v-model="updateForm.brand"></el-input>
        </el-form-item>
        <el-form-item label="渠道" prop="buyWay">
          <el-input v-model="updateForm.buyWay"></el-input>
        </el-form-item>
        <el-form-item label="产地" prop="origin"  >
          <el-input v-model="updateForm.origin"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加操作按钮-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="updateProduct">确 定</el-button>
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
    this.getProductList();
    this.getCodeAndName('catogoryCode');
    this.getCodeAndName('kindCode');
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
      productList : [
      ],// 检索后的信息一览
      total:0,// 列表总检索数
      sum:0,
      addDialogVisible: false, // 添加对话框显示或隐藏状态
      catogoryList:[],
      kindList:[],
      minsuList:[],
      // form追加信息
      addForm:{
        prodName:'',
        catogoryCode:'',
        catogoryName:'',
        kindCode:'',
        kindName:'',
        origin:'',
        buyDate:'',
        prodCount:'',
        price:'',
        property:'',
        brand:'',
        buyWay:'',
        minsuId:'',
      },
      // 修改信息
      updateForm:{
        prodId:'',
        prodName:'',
        catogoryCode:'',
        catogoryName:'',
        kindCode:'',
        kindName:'',
        origin:'',
        buyDate:'',
        prodCount:'',
        price:'',
        property:'',
        brand:'',
        buyWay:'',
        minsuId:'',
      },

      // 修改信息对话框显示
      editDialogVisible: false,
      AuthDialogVisible: false, // 添加权限设定对话框显示或隐藏状态
      // 表单验证
      formRules:{
        prodName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' },
        ],
        catogoryCode:[
        { required: true, message: '请选择分类', trigger: 'blur' },
        ],
        kindCode:[
        { required: true, message: '请选择消费种别', trigger: 'blur' },
        ],
        buyDate:[
          { required: true, message: '请输入日期', trigger: 'blur' },
        ],
        minsuId:[
          { required: true, message: '请选择民宿', trigger: 'blur' },
        ],
        origin: [
          { pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message: '产地只能为中文或英文', trigger: 'blur' }
        ],
        property: [
          { pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message: '产地只能为中文或规格', trigger: 'blur' }
        ],
        brand: [
          { pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message: '渠道只能为中文或品牌', trigger: 'blur' }
        ],
        buyWay: [
          { pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message: '渠道只能为中文或英文', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
            {min:11,max:14,message:'手机号码长度在 11 ~ 14 字符', trigger:'blur'}, //长度验证
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' },
          { pattern: /^[\u4e00-\u9fa5a-zA-Z]+$/, message: '地址只能为中文或英文', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入金额', trigger: 'blur' },
          { type: 'number', message: '金额必须为数字', trigger: 'blur', transform: (value) => Number(value) }
        ],
        prodCount: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { type: 'number', message: '数量必须为数字', trigger: 'blur',  transform: (value) => Number(value) }
        ]
      },
    }
  },
  methods:{
    // 一览数据取得
    async getProductList(){
      this.productList=[];
      this.sum = 0;
      const {data:res} = await this.$http.get("allProduct",{ params:this.queryInfo});
      
      if(res.ProductCounts > 0){        
        this.productList = res.data;
        this.productList.forEach (item => {
          this.sum += item.price;
        });
        this.total = res.ProductCounts;
      }
    },
    // 每页最大数变化处理
    handleSizeChange(newSize){
      this.queryInfo.pageSize = newSize;
      this.getProductList();
    },
    // 获取页面显示单选框内容
    async getCodeAndName(field){
      const {data:res} = await this.$http.get("getCodeName?tableName=Product&field="+ field);
      if(res.codesCounts > 0){
        if(field == "catogoryCode"){
          this.catogoryList = res.data;
        }else if(field == "kindCode"){
          this.kindList = res.data;
        }
      }
    },
    // 获取民宿一览
    async getMinsuList(field){
      const {data:res} = await this.$http.get("allMinsu",{ params:this.queryInfo});
      if(res.MinsuCounts > 0){
        this.minsuList = res.data;
      }
    },
    // 页数变化处理
    handleCurrentChange(newPage){
      this.queryInfo.pageNum = newPage;
      this.getProductList();
    },
    // 修改状态
    async ProductStateChanged(userInfo){
      const {data:res} = await this.$http.put("updateState?id="+userInfo.id+"&state=" +userInfo.activeFlg+"");
      if(res != "success"){
        userInfo.id = !userInfo.id;
        return this.$message.error("状态更新失败！！！");
      }
      this.$message.success("状态更新成功！！！");
    },
    // 监听添加对话框关闭
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();
    },
    // 追加操作
    async addProduct(){
      this.$refs.addFormRef.validate(async valid=>{
        console.log(valid);
        if(!valid)return;
        const {data:res} = await this.$http.post("addProduct",this.addForm); 
        if(res != "success"){
          return this.$message.error("追加失败！！！");
        }
        this.$message.success("追加成功！！！");
        this.addForm = {};
        this.addDialogVisible = false;
        this.getProductList();
      });
    },
    // 删除(根据主键)
    async deleteProduct(id){
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
        const {data:res} = await this.$http.delete("deleteProduct?id="+id);
        if(res != "success"){
          return this.$message.error("删除失败!");
        }else{
          this.$message.success("删除成功!");
          this.getProductList();
        }
      }
    },
    // 获取要编辑的信息
    async showEditProductDialog(id, editFlg){
      const {data:res} = await this.$http.get("getProduct?id="+id);

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
    async updateProduct(){
      // 表单验证
       this.$refs.updateFormRef.validate(async valid =>{
        if(!valid) return;

        // 进行更新
        const {data:res} = await this.$http.put("updateProduct", this.updateForm);
         if(res != "success"){
          return this.$message.error("更新失败!");
        }else{
          this.$message.success("更新成功!");
          this.editDialogVisible = false;
          this.getProductList();
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