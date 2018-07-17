<template>
  <div class="dw-ugerAndExport">
      <div>
          <group>
            <x-input title="收件人：" v-model="recipient" :label-width="'100%'" :show-clear="false" required></x-input>
            <x-input title="抄&emsp;送：" v-model="duplicate" :label-width="'100%'" :show-clear="false" required></x-input>
            <x-input title="主&emsp;题：" v-model="subject" :label-width="'100%'" :show-clear="false" required></x-input>
            <x-input title="附&emsp;件：" v-model="attachment" :label-width="'100%'" :show-clear="false" required disabled v-if="attachShow"></x-input>
            <x-textarea :title="'正&emsp;文：'" :max="200" :show-counter="false" :height="200" :rows="8" :cols="30" v-model="mainText"></x-textarea>
         </group>
      </div>
      <box gap="30px 10px">
        <flexbox>
          <flexbox-item>
            <x-button type="primary" >{{pageType}}</x-button>
          </flexbox-item>
        </flexbox>
      </box>
  </div>
</template>

<script>
import {
  XButton,
  XTextarea,
  Group,
  XInput,
  Flexbox,
  FlexboxItem,
  Box
} from "vux";

export default {
  name: "urgeAndExport",
  components: {
    XButton,
    XTextarea,
    Group,
    XInput,
    Flexbox,
    FlexboxItem,
    Box
  },
  data() {
    let type = this.$route.params.type == 1 ? true :false;
    return {
      recipient: "123456@qq.com",
      duplicate: "asdfjl@163.com",
      subject: "抄送文档",
      attachment: "sadfdsfasdf",
      mainText: "请尽快处理！",
      attachShow: type,
      pageType: type ? "导出" : "发送"
    };
  },
  computed: {},
  methods: {
    onEvent(event) {
      console.log("on", event);
    }
  }
};
</script>

<style lang="less">
.dw-ugerAndExport {
  font-family: "PingFang SC Regular";
  .weui-cells {
    margin: 0px;
    font-size: 15px;
    .disabled{
      color: initial;
    }
    .weui-cell {
      padding: 1.8vh 3%;
      &::before {
        width: 100%;
        height: 1px;
        background-color: #c5c5c5;
      }
      .weui-textarea,.weui-input{
        font-family: "PingFang SC Regular";
      }
      .weui-label{
        width: 100% !important;
      }
    }
  }
  .weui-btn {
    width: 91%;
    font-family: "PingFang SC Medium";

  }
}
</style>