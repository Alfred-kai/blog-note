###

#### a

```javascript
import React, { PureComponent, Fragment } from "react";
import { connect } from "dva/index";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Icon,
  message,
  Modal,
  Table,
  Badge,
  Popconfirm,
  Dropdown,
  Divider,
  Menu,
} from "antd/lib/index";
import { router } from "umi";
import Panel from "../../../components/Panel";
import MyGrid from "../../../components/Sword/MyGrid";
import { fetchCommonSonDictListService } from "../../../services/dict/dict";
// import { DICT_LIST, CLEAR_USER, USER } from '../../../actions/dict';

const FormItem = Form.Item;
@connect(({ dict, loading }) => ({
  dict,
  loading: loading.models.dict,
}))
export default class ExpandedRowRender extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sonTableData: [],
    };
  }
  async componentWillMount() {
    const {
      record: { id },
    } = this.props;
    console.log("id", id);
    this.refreshSonTable(id);
    // const { data } = this.props;
    // console.log('hello component', data);
    // await this.setState({
    //   sonTableData: data,
    // });
  }

  // componentWillReceiveProps({ data }) {
  //   // console.log('nextProps', nextProps);
  //   this.setState({
  //     sonTableData: data,
  //   });
  // }

  refreshSonTable = (id) => {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'dict/fetchCommonSonDictList',
    //   payload: id,
    // });
    fetchCommonSonDictListService(id).then((res) => {
      console.log("res", res);
      this.setState({
        sonTableData: res,
      });
    });
  };
  render() {
    const { record, triggerEdit, triggerDel } = this.props;
    const { sonTableData } = this.state;
    console.log("sonTableData---nest", sonTableData);

    const columns = [
      { title: "名称", dataIndex: "value", key: "name" },
      { title: "英文名称", dataIndex: "key", key: "key" },
      {
        title: "权限类别",
        dataIndex: "scope",
        key: "scope",
      },
      { title: "所有者", dataIndex: "owner", key: "owner" },
      {
        title: "备注",
        dataIndex: "remark",
        key: "remark",
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
      },
      {
        title: "排序",
        dataIndex: "order",
        key: "order",
      },
      {
        title: "操作",
        dataIndex: "operate",
        render: (value, row, index) => {
          return (
            <span>
              <a onClick={() => triggerEdit("son", row, record)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm
                title="确定要删除吗？"
                onConfirm={() => triggerDel("son", row, record)}
                okText="是"
                cancelText="否"
              >
                <a href="#">删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    return (
      <div style={{ padding: 10 }}>
        <Table columns={columns} dataSource={sonTableData} pagination={false} />
      </div>
    );
  }
}
```

成功案例

```javascript
export default class ExpandedRowRender extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sonTableData: [],
    };
  }
  async componentWillMount() {
    const {
      record: { id },
    } = this.props;
    console.log("id", id);
    this.refreshSonTable(id);
  }

  refreshSonTable = (id) => {
    fetchCommonSonDictListService(id).then((res) => {
      console.log("res", res);
      this.setState({
        sonTableData: res,
      });
    });
  };
  render() {
    const { record, triggerEdit, triggerDel } = this.props;
    const { sonTableData } = this.state;
    console.log("sonTableData---nest", sonTableData);

    const columns = [
      { title: "名称", dataIndex: "value", key: "name" },
      { title: "英文名称", dataIndex: "key", key: "key" },
      {
        title: "权限类别",
        dataIndex: "scope",
        key: "scope",
      },
      { title: "所有者", dataIndex: "owner", key: "owner" },
      {
        title: "备注",
        dataIndex: "remark",
        key: "remark",
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
      },
      {
        title: "排序",
        dataIndex: "order",
        key: "order",
      },
      {
        title: "操作",
        dataIndex: "operate",
        render: (value, row, index) => {
          return (
            <span>
              <a onClick={() => triggerEdit("son", row, record)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm
                title="确定要删除吗？"
                onConfirm={() => triggerDel("son", row, record)}
                okText="是"
                cancelText="否"
              >
                <a href="#">删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    return (
      <div style={{ padding: 10 }}>
        <Table columns={columns} dataSource={sonTableData} pagination={false} />
      </div>
    );
  }
}
```

### 结论

说明 `componentWillReceiveProps`钩子函数 会触发所有的 class 实例；而 componentWillMount，在当前实例刚触发时，执行，不会一直触发；
