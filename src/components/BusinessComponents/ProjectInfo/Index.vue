<template>
  <div class="project-title-wrap">
    <div>
      <span class="label-text">项目编码/申办方编号：</span>
      <span>
        {{projectInfo.matchId}}
      </span>
    </div>
    <div>
      <span class="label-text">项目名称：</span>
      <Tooltip >
        <p slot="content" style="white-space: normal">{{projectInfo.name}}</p>
        <span>{{projectInfo.name}}</span>
      </Tooltip>
    </div>
  </div>
</template>
<script>
import api from '@/api/project';

const { selectProjectInfo } = api;
export default {
  data() {
    return {
      projectInfo: {},
    };
  },
  methods: {
    async getProjInfo(id) {
      const res = await selectProjectInfo(id);
      if (res) {
        this.projectInfo = res.data;
      }
    },
  },
  created() {
    if (this.$route.params.projId) {
      this.getProjInfo(this.$route.params.projId);
    }
  },
};
</script>
<style lang="less">
  .project-title-wrap {
    padding: 5px 0 10px;
    margin-left: 10px;
    border-bottom: 1px dashed #ccc;
    .ivu-tooltip{
      flex: 1;
    }
    >div{
      margin-bottom: 8px;
      color: #797979;
      font-size: 14px;
      display: flex;
      span{
        display: inline-block;
      }
      span:last-child{
        flex: 1;
        word-break: break-all;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      span.label-text {
        width: 150px;
        text-align: right;
        color: #2c3e50;
      }
    }
  }
</style>
