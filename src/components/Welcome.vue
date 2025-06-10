<template>
  <div class="box">
    <div ref="vantaRef" style="width: 100%; height: 600px"></div>
    <div class="banner">
      <h1>欢迎使用herhome民宿管理平台</h1>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import BIRDS from "vanta/src/vanta.birds";

export default {
  data() {
    return {};
  },
  mounted() {
    this.vantaEffect = BIRDS({
      el: this.$refs.vantaRef,
      THREE: THREE,
    });
    // 修改颜色时 cells 需要全大写字母 可生效
    VANTA.BIRDS({
      el: this.$refs.vantaRef,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      color1: 14381274,
      color2: 16443110,
    });
  },
  beforeDestroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.box {
  position: relative;
  .banner {
    z-index: 999;
    position: absolute;
    top: 5%;
    left: 1%;
    color: #fff;
  }
}
h1 {
  font-size: 20px;
}
p {
  margin-top: 60px;
  font-size: 18px;
}
</style>