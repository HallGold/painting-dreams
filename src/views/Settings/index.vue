<template>
  <div class="settings-content">
    <view class="header-content">
      <div class="tabs-content">
        <d-tab
          v-for="tab in tabs"
          @click="changeTab(tab.id)"
          :key="tab.id"
          :text="tab.text"
          :active="tab.id === tabIndex"
          :mr="10"
        />
      </div>
      <div class="right-bts">
        <d-tab @click="openRule" text="查看规则" :width="100" :mr="10" />
        <el-button size="large" v-permission="'add'" v-if="tabIndex === 0" @click="addCompany" :icon="CirclePlus"
          >新建公司</el-button
        >
      </div>
    </view>
    <div class="content">
      <operating-company ref="operating" v-if="tabIndex === 0" />
      <company-cancelled ref="cancelled" v-if="tabIndex === 1" />
    </div>
        <!-- 查看规则弹窗 -->
    <el-dialog
      v-model="showRuleModal"
      top="55px"
      title="后台设置说明"
      width="60%"
      center
    >
      <div class="rule-modal scrollbar">
        <p>
          {画师薪水+公司支出五险一金+{（总房租+总水电费+总管理成本）÷在职画师数量}]÷画师该月过稿收入
          说明：指数越小画师效率越高，指数越大画师效率越低，
        </p>
        <p>指数0.7以下正常，</p>
        <p>0.7~0.8背景框为警示色，</p>
        <p>0.8~0.9提示画师留职察看，</p>
        <p>0.9~1，PM会找画师谈话，连续两个月负数就会劝退画师，。</p>
        <p>指数大于1，公司亏损，公司可以当月辞退画师。</p>
        <p>
          初始公司纯利润率：【10】% （只能填10-90整数数字） 那么初始指数就是0.9
        </p>
        <p>【外发画师】绩效指数核算公式： 画师外发价 ÷ 税后接价</p>
        <p>画师年终奖核算公式：</p>
        <p>（0.9-1月绩效指数）x1月薪水</p>
        <p>+（0.9-2月绩效指数）x2月薪水</p>
        <p>+（0.9-3月绩效指数）x3月薪水</p>
        <p>+（0.9-4月绩效指数）x4月薪水</p>
        <p>+（0.9-5月绩效指数）x5月薪水</p>
        <p>+（0.9-6月绩效指数）x6月薪水</p>
        <p>+（0.9-7月绩效指数）x7月薪水</p>
        <p>+（0.9-8月绩效指数）x8月薪水</p>
        <p>+（0.9-9月绩效指数）x9月薪水</p>
        <p>+（0.9-10月绩效指数）x10月薪水</p>
        <p>+（0.9-11月绩效指数）x11月薪水</p>
        <p>+（0.9-12月绩效指数）x12月薪水</p>

        <p>
          薪水是指：工资表一栏的【实发工资】的最终金额。（比如有全勤或者其他奖金填进去了，那么也要加进去计算）
        </p>
        <p>
          例：也就是说，如果画师某个月的0.9减去绩效指数为负，那么这个月的月奖励也是负数。
          PM会找画师谈话，连续两个月负数就会劝退画师。
        </p>
        <p>商务奖金率：【5】% （只能填1-10数字,最多到小数点后1位）</p>
        <p>项目经理监督奖金率：【2.5】% （只能填1-10数字,最多到小数点后1位）</p>
        <p>主美监督奖金率：【1】% （只能填1-10数字,最多到小数点后1位）</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="showRuleModal = false"
            >我知道了</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { CirclePlus } from '@element-plus/icons-vue'
import { defineComponent, ref, Ref } from 'vue'
import CompanyCancelled from './components/CompanyCancelled.vue'
import OperatingCompany from './components/OperatingCompany.vue'
export default defineComponent({
  name: 'settings',
  components: {
    'company-cancelled': CompanyCancelled,
    'operating-company': OperatingCompany
  },
  setup () {
    const tabIndex: Ref<number> = ref(0)
    const operating: Ref<HTMLElement | null> = ref(null)
    const showRuleModal: Ref<boolean> = ref(false)
    const cancelled = ref(null)
    const tabs = ref([
      {
        text: '营运中公司',
        id: 0
      },
      {
        text: '已注销公司',
        id: 1
      }
    ])
    const changeTab = (index: number): void => {
      if (tabIndex.value === index) return
      tabIndex.value = index
    }
    const openRule = () => {
      // if (operating.value !== null) {
      //   (operating.value as any).showRuleModal = true
      // }
      showRuleModal.value = true
    }
    const addCompany = () => {
      if (operating.value !== null) {
        (operating.value as any).operatingCompany.addModal = true
      }
    }
    return {
      CirclePlus,
      tabIndex,
      openRule,
      changeTab,
      operating,
      cancelled,
      tabs,
      addCompany,
      showRuleModal
    }
  }
})
</script>

<style lang="less" scoped>
.settings-content {
  .header-content {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .tabs-content,
    .right-bts {
      display: flex;
      align-items: center;
    }
  }
  .content {
    margin-top: 20px;
  }
}
.rule-modal {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
  div {
    margin: 0;
    padding: 0;
  }
  p {
    padding: 0;
  }
}
</style>
