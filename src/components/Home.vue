<template>
    <el-container class="home-container">
      <el-header class="header">
        <div>
            <img src="../assets/logo3.png" class="logo-image" alt />
        </div>
        
            <span>民宿管理平台</span>
        <el-button type="info" @click="logout">安全退出</el-button></el-header>
     <!-- 主体 -->   
      <el-container>
        <el-aside :width="isCollapse?'64px':'200px'">
            <div class="toggle-button" @click="toggleCollapase">|||</div>
        <!--unique-opened 展开一个的时候另一个关闭-->
            <el-menu active-text-color="#409eff" background-color="#545c64" text-color="#fff" unique-opened :collapse="isCollapse" :collapse-transition="false"
             :router="true" :default-active="activePath">
                <!-- 1级菜单-->
                <el-submenu :index="menu.id+''" v-for="menu in menuList" :key="menu.id">
                    <template #title>
                        <el-icon :class="iconProject[menu.id]"><location /></el-icon>
                        <span>{{menu.title}}</span>
                    </template>
                    <!-- 2级菜单-->
                    <el-menu-item :index="item.path"  v-for="item in menu.sList" :key="item.id" @click="saveActive(item.path)">
                         <template #title>
                            <el-icon :class="iconProject[item.id]"><location /></el-icon>
                            <span>{{item.title}}</span>
                        </template>
                    </el-menu-item>
                    <!--
                    <el-menu-item-group title="Group One">
                        <el-menu-item index="1-1">项目一</el-menu-item>
                        <el-menu-item index="1-2">项目二</el-menu-item>
                    </el-menu-item-group>
                    <el-submenu index="1-3">
                        <template #title>项目三</template>
                        <el-menu-item index="1-3-1">项目三-一</el-menu-item>
                    </el-submenu>
                    -->
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <router-view>
            </router-view>
          </el-main>
          <el-footer>
                <span>法律声明</span>
                <el-divider direction="vertical"></el-divider>
                <span>友情链接</span>
                <el-divider direction="vertical"></el-divider>
                <span @click="drawer = true">联系我</span>
                <br/>
                <br/>
                <span class="copyright">版权所有</span>
                <el-drawer
                    title="联系我"
                    v-model="drawer">
                    <p class='info'>
                    <i class="el-icon-phone"></i>电话：15504245996<br/>
                    <i class="el-icon-message"></i>邮箱：wangyuf@cn.ibm.com<br/>
                    </p>
                </el-drawer>
          </el-footer>
        </el-container>
      </el-container>
    </el-container>
</template>
<script>
export default {
    data(){
        return{
            // 菜单列表
            menuList:[],
            // 左侧菜单栏伸缩属性
            isCollapse:true,
            // 图标集合
            iconProject: {
                '0':'iconfont icon-guanliyuan',
                '1':'iconfont icon-yundongbisai',
                '0':'iconfont icon-dengluzhanghao',
                '1':'iconfont icon-mima3',
                '2':'iconfont icon-yundongAPP',
                '3':'iconfont icon-shangpinguanli',
                '4':'iconfont icon-shuji',
                '5':'iconfont icon-qialuli',
                '6':'iconfont icon-shiwu',
                '7':'iconfont icon-dengluzhuce',
            },
            activePath: "/welcome",// 默认路径
            drawer:false,// 联系我 点击
        }
    },
    // 页面加载
    created(){
        // 查询menu 列表
        this.getMenuList();
        this.activePath = window.sessionStorage.getItem("activePath");
        this.isCollapse = window.sessionStorage.getItem("isCollapse");
    },
    methods: {
        async　logout(){
            window.sessionStorage.clear();// 清除session
            await this.$http.get("logout");
            this.$router.push({path:"/login"});
        },
        
        // 获取左侧导航菜单
        async getMenuList(){
            //post提交（访问后台）
            const  {data:res} = await this.$http.get("menu");
            if(res.flag == 200){
                //this.$message.success("操作成功！！！"); // 画面信息显示
                this.menuList = res.menus;
                //this.$router.push({path:"/home"});// 迁移画面
                //window.sessionStorage.setItem("user", res.user);
                console.log(res.menus);
            }else{
                this.$message.error("获取菜单列表失败！");
            }
        },
        // 控制左侧菜单栏伸缩
        toggleCollapase(){
            this.isCollapse = !this.isCollapse;
        },
        // 保存实时路径
        saveActive(activePath){
            window.sessionStorage.setItem("activePath",activePath);
            this.activePath = activePath;
            //window.sessionStorage.setItem("isCollapse",this.isCollapse);
        }
    }
}
</script>
<style lang="less" scoped>
    .home-container {
        height:100%;
    }
    .el-header {
        display:flex;
        justify-content: space-between; // 左右贴边
        padding-left:0%; 
        color:#fff;
        font-size:20px;
        align-items: center;
        background-color: #46644f;
        span{
            margin-left:15px;
        }
    }
    .el-aside {
        .el-menu{
            border-right: none;
        }
        background-color: #333744;
    }
    .el-main {
        background-color: #eaedf1;
    }
    img{
        width: 85px;
        height: 60px;
        opacity: 0.5;
    }
    // toggle按钮
    .toggle-button{
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
    .el-footer{
        text-align: center;
        font-size: 12px;
        padding: 0px 0px;
        cursor: pointer;
        background-color: #eff;
    }
    .copyright{
      font-size: 12px;
    }
    .info{
      font-size: 14px;
      color: #72767b;
      line-height: 25px;
    }
    
</style>