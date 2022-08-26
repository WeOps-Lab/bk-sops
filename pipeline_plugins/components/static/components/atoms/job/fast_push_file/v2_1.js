/**
 * Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community
 * Edition) available.
 * Copyright (C) 2017 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */
(function () {
    $.atoms.job_fast_push_file = [
        {
            tag_code: "biz_cc_id",
            type: "select",
            attrs: {
                name: gettext("业务"),
                allowCreate: true,
                hookable: true,
                remote: true,
                remote_url: $.context.get('site_url') + 'pipeline/cc_get_business_list/',
                remote_data_init: function (resp) {
                    if (resp.result === false) {
                        show_msg(resp.message, 'error');
                    }
                    return resp.data;
                },
                disabled: !$.context.canSelectBiz(),
                validation: [
                    {
                        type: "required"
                    }
                ]
            },
            methods: {
                _tag_init: function () {
                    if (this.value) {
                        return
                    }
                    this._set_value($.context.getBkBizId())
                }
            }
        },
        {
            tag_code: "job_source_files",
            type: "datatable",
            attrs: {
                name: gettext("源文件"),
                editable: true,
                add_btn: true,
                columns: [
                    {
                        tag_code: "ip",
                        type: "input",
                        attrs: {
                            name: gettext("IP"),
                            placeholder: gettext("【IP】"),
                            width: '170px',
                            editable: true,
                            validation: [
                                {
                                    type: "required"
                                }
                            ]
                        }
                    },
                    {
                        tag_code: "files",
                        type: "textarea",
                        attrs: {
                            name: gettext("文件路径"),
                            placeholder: gettext("多个用换行分隔"),
                            editable: true,
                            validation: [
                                {
                                    type: "required"
                                }
                            ]
                        }
                    },
                    {
                        tag_code: "account",
                        type: "input",
                        attrs: {
                            name: gettext("执行账户"),
                            editable: true,
                            validation: [
                                {
                                    type: "required"
                                }
                            ]
                        }
                    }
                ],
                hookable: true,
                validation: [
                    {
                        type: "required"
                    }
                ]
            }
        },
        {
            tag_code: "upload_speed_limit",
            type: "input",
            attrs: {
                name: gettext("上传限速"),
                placeholder: gettext("MB/s 若不限速则不填写"),
                hookable: true,
            }
        },
        {
            tag_code: "download_speed_limit",
            type: "input",
            attrs: {
                name: gettext("下载限速"),
                placeholder: gettext("MB/s 若不限速则不填写"),
                hookable: true,
            }
        },
        {
            tag_code: "select_method",
            type: "radio",
            attrs: {
                name: gettext("填参方式"),
                hookable: false,
                items: [
                    {value: "manual", name: gettext("手动填写")},
                    {value: "auto", name: gettext("单行自动扩展")},
                ],
                default: "manual",
                validation: [
                    {
                        type: "required"
                    }
                ],
            },
            events: [
                {
                    source: "select_method",
                    type: "init",
                    action: function () {
                        this.emit_event(this.tagCode, "change", this.value)
                    }
                },
            ]
        },
        {
            tag_code: "job_dispatch_attr",
            type: "datatable",
            attrs: {
                name: gettext("分发配置"),
                add_btn: true,
                hookable: true,
                columns: [
                    {
                        tag_code: "job_ip_list",
                        type: "textarea",
                        attrs: {
                            name: gettext("IP"),
                            placeholder: gettext("【IP】"),
                            hookable: true,
                            validation: [
                                {
                                    type: "required"
                                }
                            ]
                        }
                    },
                    {
                        tag_code: "job_target_path",
                        type: "input",
                        attrs: {
                            name: gettext("目标路径"),
                            placeholder: gettext("请输入绝对路径（可用[FILESRCIP]代替源IP）"),
                            hookable: true,
                            validation: [
                                {
                                    type: "required"
                                }
                            ]
                        }
                    },
                    {
                        tag_code: "job_account",
                        type: "input",
                        attrs: {
                            name: gettext("执行账户"),
                            placeholder: gettext("请输入在蓝鲸作业平台上注册的账户名"),
                            hookable: true,
                            validation: [
                                {
                                    type: "required"
                                }
                            ]
                        }
                    },
                ],
                validation: [
                    {
                        type: "required"
                    }
                ]
            },
            events: [],
            methods: {
                _tag_init: function () {
                    if (this.value) {
                        return
                    }
                    this._set_value($.context.getBkBizId())
                }
            }
        },
        {
            tag_code: "break_line",
            type: "input",
            attrs: {
                name: gettext("自动扩展分隔符"),
                placeholder: gettext("可为空，单行自动扩展模式下每一行的换行符，默认使用 ,"),
                hookable: true
            },
            events: [
                {
                    source: "select_method",
                    type: "change",
                    action: function (value) {
                        var self = this;
                        if (value === "auto") {
                            self.show();
                        } else {
                            self._set_value('');
                            self.hide();
                        }
                    }
                }
            ],
        },
        {
            tag_code: "job_timeout",
            type: "input",
            attrs: {
                name: gettext("超时时间"),
                placeholder: gettext("单位为秒(60 - 86400)，为空时使用JOB默认值"),
                hookable: true,
                validation: [
                    {
                        type: "custom",
                        args: function (value) {
                            let result = {
                                result: true,
                                error_message: ""
                            };
                            if (!value) {
                                return result
                            }
                            if (+value < 60 || +value > 86400) {
                                result.result = false;
                                result.error_message = gettext("超时时间必须在 60 - 86400 范围内")
                            }
                            return result
                        }
                    }
                ]
            }
        },
        {
            tag_code: "job_rolling_execute",
            type: "radio",
            attrs: {
                name: gettext("滚动执行"),
                hookable: true,
                items: [
                    {value: false, name: gettext("否")},
                    {value: true, name: gettext("是")},
                ],
                default: false,
                validation: [
                    {
                        type: "required"
                    }
                ]
            }
        },
         {
            tag_code: "job_rolling_expression",
            type: "input",
            attrs: {
                name: gettext("滚动策略"),
                placeholder: gettext("详情请查看JOB使用指引"),
                hookable: true,
                validation: [
                    {
                        type: "custom",
                        args: function (value) {
                            let self = this
                            let result = {
                                result: true,
                                error_message: ""
                            }
                            if (!self.get_parent) {
                                return result
                            } else if (self.get_parent().get_child('job_rolling_execute')) {
                                if (self.get_parent().get_child('job_rolling_execute').value && !value.toString()) {
                                    result.result = false;
                                    result.error_message = gettext("滚动执行开启时滚动策略为必填项");
                                }
                            }
                            return result
                        }
                    }
                ]
            },
            events: [
                {
                    source: "job_rolling_execute",
                    type: "change",
                    action: function (value) {
                        var self = this
                        console.log(value);
                        if (value) {
                            self.show()
                        } else {
                            self.hide()
                        }
                    }
                },
                {
                    source: "job_rolling_execute",
                    type: "init",
                    action: function () {
                        const job_rolling_execute = this.get_parent && this.get_parent().get_child('job_rolling_execute')._get_value();
                        if (job_rolling_execute) {
                            this.show()
                        } else {
                            this.hide()
                        }
                    }
                },
            ]
        },
        {
            tag_code: "job_rolling_mode",
            type: "select",
            attrs: {
                name: gettext("滚动机制"),
                hookable: true,
                default: 1,
                validation: [
                    {
                        type: "custom",
                        args: function (value) {
                            let self = this
                            let result = {
                                result: true,
                                error_message: ""
                            }
                            if (!self.get_parent) {
                                return result
                            } else if (self.get_parent().get_child('job_rolling_execute')) {
                                if (self.get_parent().get_child('job_rolling_execute').value && !value.toString()) {
                                    result.result = false;
                                    result.error_message = gettext("滚动执行开启时滚动机制为必填项");
                                }
                            }
                            return result
                        }
                    }
                ],
                items: [
                    {text: '执行失败则暂停', value: 1},
                    {text: '忽略失败，自动滚动下一批', value: 2},
                    {text: '人工确认', value: 3},
                ]
            },
            events: [
                {
                    source: "job_rolling_execute",
                    type: "change",
                    action: function (value) {
                        var self = this
                        if (value) {
                            self.show()
                        } else {
                            self.hide()
                        }
                    }
                },
                {
                    source: "job_rolling_execute",
                    type: "init",
                    action: function () {
                        const job_rolling_execute = this.get_parent && this.get_parent().get_child('job_rolling_execute')._get_value();
                        if (job_rolling_execute) {
                            this.show()
                        } else {
                            this.hide()
                        }
                    }
                },
            ]
        },
    ]
})();
