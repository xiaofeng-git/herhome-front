<template>
    <div class="login_container">
        <!-- 登录框-->
        <div class="login_box">
            <div class="avatar_box">
                <img class="logo" src="../assets/logo3.png" alt/>
            </div>
            <!-- 表单区域-->
            <el-form ref="loginFormRef" :rules="loginRules" :model="loginForm" class="login_form" label-width="0">
                <!-- 用户名-->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-yonghuming"  />
                </el-form-item>
                <!-- 密码-->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-mima3" />
                </el-form-item>
                <!-- 按钮-->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login()">登录</el-button>
                    <el-button type="info" @click="resetLoginForm()">重置</el-button>
                </el-form-item>
                
            </el-form>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                // 表单数据
                loginForm:{
                    username:"",
                    password: ""
                },
                // 表单验证
                loginRules:{
                    username :[
                        {required:true,message:'用户名为必填项', trigger:'blur'},   // 失去焦点进行必填项验证
                        {min:3,max:12,message:'用户名长度在 3 ~ 12 字符', trigger:'blur'}, //长度验证
                    ],
                    password: [
                        {required:true,message:'密码为必填项', trigger:'blur'},   // 失去焦点进行必填项验证
                        {min:3,max:10,message:'密码长度在 3 ~ 10 字符', trigger:'blur'}, //长度验证
                    ],

                }
            }
        },
        methods:{
            // 重置表单内容
            resetLoginForm(){
                this.$refs.loginFormRef.resetFields();
            },
            login(){
                // 验证校验规则
                this.$refs.loginFormRef.validate(async valid =>{
                    if( !valid ) return;
                    //post提交（访问后台）
                    const  {data:res} = await this.$http.post("login",this.loginForm);
                    if(res.flag == "ok"){
                        this.$message.success("登录成功！！！"); // 画面信息显示
                        this.$router.push({path:"/home"});// 迁移画面
                        console.log(res.user.id);
                        window.sessionStorage.setItem("user", (res.user.id));
                        
                    }else{
                        this.$message.error("登录失败！");
                    }
                });
            }
        }
    }
</script>
<style lang="less" scoped>
// 根节点样式
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.btns{
    display: flex;
    justify-content: flex-end;
    margin-left:30%
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar_box{
        width: 130px;
        height: 130px;
        border: 1px solid #eee;
        border-radius: 50%;/*边圆角*/
        padding: 5px;
        box-shadow: 0 0 2px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #0ee;
        .logo{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}

.login_form{
    position:absolute;
    bottom:0%;
    width:100%;
    padding: 0 10px;
    box-sizing: border-box;
}
</style>