<template>
    <div class="ctms-data-grid">
        <Table v-bind="tableProps" v-on="$listeners" ref="pubTable">
          <template v-for="item in tableProps.columns"
                    slot-scope="{ row, index, columns }"
                    :slot="item.slot">
            <template v-if="item.slot">
              <slot :name="item.slot" v-bind="{ row, index, columns }"></slot>
            </template>
          </template>
        </Table>
        <div class="ctms-data-grid__page" v-if="page">
            <Page v-bind="pageProps"
                  @on-change="pageEventProps['on-change']"
                  @on-page-size-change="pageEventProps['on-page-size-change']"
                  show-sizer
                  show-elevator
                  show-total/>
        </div>
    </div>
</template>

<script>
import './style.less';
import { humpToLine } from '@/utils/util';

// 生成按钮list
const generateButtonList = (h, item, params) => {
  const { index, row } = params;
  // 兼容renderButton是方法的情况
  const renderButton = typeof item.renderButton === 'function'
    ? item.renderButton({ index, row })
    : [...item.renderButton];

  if (!renderButton) {
    return [];
  }
  // 未渲染之前的按钮
  const buttonList = [];

  // 如果按钮多于两个，则显示更多
  if (renderButton.length > 2) {
    const firstButton = renderButton[0];
    buttonList.push(
      h('a', {
        props: {},
        style: firstButton.style ? firstButton.style : {},
        on: (() => {
          // 绑定按钮事件
          const eventsObj = {};
          if (firstButton.on && Object.keys(firstButton.on).length) {
            Object.keys(firstButton.on).forEach((event) => {
              const fn = firstButton.on[event];
              Object.assign(eventsObj, {
                [event]: (e) => {
                  fn({ index, row }, e);
                },
              });
            });
          }
          return eventsObj;
        })(),
      }, firstButton.label),
    );
    buttonList.push(
      h('span', {
        props: {
          type: 'text',
        },
        class: 'divider',
      }, ''),
    );
    const dropDownList = [];
    renderButton.forEach((button, i) => {
      if (i !== 0) {
        dropDownList.push(
          h('DropdownItem', {
            props: {
              name: `${i}_${button.label}`,
            },
            style: button.style ? button.style : {},
          }, button.label),
        );
      }
    });
    buttonList.push(
      h('Dropdown', {
        props: {
          transfer: true,
        },
        on: {
          'on-click': (name) => {
            const i = name.split('_')[0];
            renderButton[i].on.click({ index, row });
          },
        },
      }, [
        h('a', [
          h('span', '更多'),
          h('Icon', {
            props: {
              type: 'ios-arrow-down',
            },
          }),
        ]),
        h('DropdownMenu', {
          slot: 'list',
        }, dropDownList),
      ]),
    );
  } else {
    renderButton.forEach((button, i) => {
      // 增加分割线
      if (i !== 0) {
        buttonList.push(
          h('span', {
            props: {
              type: 'text',
            },
            class: 'divider',
          }, ''),
        );
      }
      // 绑定按钮事件
      if (button.on && Object.keys(button.on).length) {
        Object.keys(button.on).forEach((event) => {
          const fn = button.on[event];
          Object.assign(button, {
            on: {
              [event]: (e) => {
                fn({ index, row }, e);
              },
            },
          });
        });
      }
      // 渲染按钮
      if (button.confirm) {
        // 判断是否需要二次确认
        const poptipProps = (props = {}) => {
          const {
            title = '您确认禁用这条数据吗？',
            okText = '确认',
            cancelText = '取消',
          } = props;
          return {
            transfer: true,
            confirm: true,
            placement: 'top-end',
            title,
            okText,
            cancelText,
          };
        };
        // 如果为true，则使用默认提示
        if (typeof button.confirm === 'boolean' && button.confirm) {
          buttonList.push(
            h('Poptip', {
              props: poptipProps({}),
              on: {
                'on-ok': button.on.click,
              },
            }, [
              h('a', {
                props: {},
                style: button.style ? button.style : {},
              }, button.label),
            ]),
          );
        } else {
          buttonList.push(
            h('Poptip', {
              props: poptipProps(button.confirm),
              on: {
                'on-ok': button.on.click,
              },
            }, [
              h('a', {
                props: {},
                style: button.style ? button.style : {},
              }, button.label),
            ]),
          );
        }
      } else {
        buttonList.push(
          h('a', {
            props: {},
            style: button.style ? button.style : {},
            on: button.on,
          }, button.label),
        );
      }
    });
  }
  return buttonList;
};
// page事件列表
const pageEventFnList = ['on-change', 'on-page-size-change'];

export default {
  name: 'CtmsDataGrid',
  props: {
    page: {
      type: [Boolean, Object],
      required: true,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    // table属性处理
    tableProps() {
      const tableProps = this._.defaultsDeep({}, this.$attrs);

      // 表格高度
      if (tableProps.height) {
        tableProps.height = this.page ? tableProps.height - 50 : tableProps.height;
      }
      if (tableProps.columns && tableProps.columns.length) {
        // 添加序号头
        const columnsIndex = {
          title: '序号',
          key: '_columnsIndex',
          width: 70,
        };
        if (tableProps.columns[0].type === 'selection') {
          tableProps.columns.splice(1, 0, columnsIndex);
        } else {
          tableProps.columns.unshift(columnsIndex);
        }

        // 增加序号
        let pageSize = 10;
        let current = 1;
        if (this.page) {
          pageSize = this.page.pageSize || 10;
          current = this.page.current || 1;
        }
        tableProps.data.forEach((item, index) => {
          Object.assign(item, {
            _columnsIndex: pageSize * (current - 1) + index + 1,
          });
        });

        // 保存需要处理链式调用的属性
        const chainNameArr = [];

        // 处理columns
        tableProps.columns.forEach((item) => {
          // 单行省略号，并在鼠标移入展示内容
          if (item.nowrap) {
            Object.assign(item, {
              render: (h, params) => h('Tooltip', {
                props: {
                  placement: 'top-start',
                  transfer: true,
                  maxWidth: 200,
                  content: params.row[item.key] || '--',
                },
              }, [
                h('p', {
                  class: 'text-wrap',
                }, params.row[item.key] || '--'),
              ]),
            });
          }
          // 按钮事件
          if (item.renderButton) {
            Object.assign(item, {
              render: (h, params) => h('div', generateButtonList(h, item, params)),
            });
          }
          // 链式调用
          const keyArr = item.key ? item.key.split('.') : [];
          if (keyArr.length > 1) {
            chainNameArr.push(keyArr);
            Object.assign(item, {
              key: keyArr.join('_'),
            });
          }
        });

        // 更新链式调用的数据
        if (tableProps.data && tableProps.data.length && chainNameArr.length) {
          tableProps.data.forEach((item) => {
            chainNameArr.forEach((keyArr) => {
              Object.assign(item, {
                [keyArr.join('_')]: keyArr.reduce((total, key) => total[key], item),
              });
            });
          });
        }
      }
      return tableProps;
    },
    // page属性处理
    pageProps() {
      const pageProps = {};
      if (this.page && Object.keys(this.page).length) {
        Object.keys(this.page).forEach((item) => {
          pageProps[humpToLine(item)] = this.page[item];
        });
      }
      if (!pageProps.total) {
        pageProps.total = this.$attrs.data.length || 0;
      }
      return pageProps;
    },
    // pageEvent属性处理
    pageEventProps() {
      const pageEventProps = {};
      // 首先将默认的event事件加到pageEventProps中
      pageEventFnList.forEach((item) => {
        pageEventProps[item] = this.defaultPageFn;
      });
      // 然后将外面传进来的方法进行替换
      if (this.page && this.page.on && Object.keys(this.page.on).length) {
        Object.keys(this.page.on).forEach((item) => {
          pageEventProps[humpToLine(item)] = this.page.on[item];
        });
      }
      return pageEventProps;
    },
  },
  created() {},
  methods: {
    defaultPageFn() {},
  },
};
</script>
