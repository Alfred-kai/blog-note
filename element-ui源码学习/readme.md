## element-ui 源码学习

### collapse 学习

- 加`el-collapse-transition`

```html
<div class="el-collapse-item is-active">
  <div
    role="tab"
    aria-expanded="true"
    aria-controls="el-collapse-content-4827"
    aria-describedby="el-collapse-content-4827"
  >
    <div
      role="button"
      id="el-collapse-head-4827"
      tabindex="0"
      class="el-collapse-item__header focusing"
    >
      <i class="el-collapse-item__arrow el-icon-arrow-right"></i>一致性
      Consistency
    </div>
  </div>
  <div
    role="tabpanel"
    aria-labelledby="el-collapse-head-4827"
    id="el-collapse-content-4827"
    class="el-collapse-item__wrap"
  >
    <div class="el-collapse-item__content">
      <div>
        与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
      </div>
      <div>
        在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
      </div>
    </div>
  </div>
</div>
```

- 不加`el-collapse-transition`

```html
<div data-v-39f14e7d="" class="el-collapse-item is-active">
  <div
    role="tab"
    aria-controls="el-collapse-content-9666"
    aria-describedby="el-collapse-content-9666"
    aria-expanded="true"
  >
    <div
      role="button"
      id="el-collapse-head-9666"
      tabindex="0"
      class="el-collapse-item__header is-active"
    >
      一致性 Consistency<i
        class="el-collapse-item__arrow el-icon-arrow-right is-active"
      ></i>
    </div>
  </div>
  <div>
    <div
      role="tabpanel"
      aria-labelledby="el-collapse-head-9666"
      id="el-collapse-content-9666"
      class="el-collapse-item__wrap"
      style=""
    >
      <div class="el-collapse-item__content">
        <div data-v-39f14e7d="">
          与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；
        </div>
        <div data-v-39f14e7d="">
          在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
        </div>
      </div>
    </div>
  </div>
</div>
```

### kjlakd

```javascript
componentName: 'ElMenu',

      mixins: [emitter_default.a, migrating_default.a],

      provide: function provide() {
        return {
          rootMenu: this
        };
      },


      components: {
        'el-menu-collapse-transition': {
          functional: true,
          render: function render(createElement, context) {
            var data = {
              props: {
                mode: 'out-in'
              },
              on: {
                beforeEnter: function beforeEnter(el) {
                  el.style.opacity = 0.2;
                },
                enter: function enter(el) {
                  Object(dom_["addClass"])(el, 'el-opacity-transition');
                  el.style.opacity = 1;
                },
                afterEnter: function afterEnter(el) {
                  Object(dom_["removeClass"])(el, 'el-opacity-transition');
                  el.style.opacity = '';
                },
                beforeLeave: function beforeLeave(el) {
                  if (!el.dataset) el.dataset = {};

                  if (Object(dom_["hasClass"])(el, 'el-menu--collapse')) {
                    Object(dom_["removeClass"])(el, 'el-menu--collapse');
                    el.dataset.oldOverflow = el.style.overflow;
                    el.dataset.scrollWidth = el.clientWidth;
                    Object(dom_["addClass"])(el, 'el-menu--collapse');
                  } else {
                    Object(dom_["addClass"])(el, 'el-menu--collapse');
                    el.dataset.oldOverflow = el.style.overflow;
                    el.dataset.scrollWidth = el.clientWidth;
                    Object(dom_["removeClass"])(el, 'el-menu--collapse');
                  }

                  el.style.width = el.scrollWidth + 'px';
                  el.style.overflow = 'hidden';
                },
                leave: function leave(el) {
                  Object(dom_["addClass"])(el, 'horizontal-collapse-transition');
                  el.style.width = el.dataset.scrollWidth + 'px';
                }
              }
            };
            return createElement('transition', data, context.children);
          }
        }
      },
```
