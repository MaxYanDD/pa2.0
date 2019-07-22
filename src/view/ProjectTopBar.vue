<template>
    <div class="topbar">
        <div class="tb-left">
            <a class="back fa fa-angle-left" href="###" title="返回"></a>
            <div class="project-info">
                <span>{{project.name}}</span>
                <i class="fa fa-edit"></i>
            </div>
            <div class="project-set">
                <el-dropdown @command="handleCommand" placement="bottom-start" size="mini" trigger="click">
                    <span class="el-dropdown-link">
                        设置
                        <i class="fa fa-angle-down"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="setProInfo">方案信息</el-dropdown-item>
                        <el-dropdown-item command="setComInfo">公司信息</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <div class="tb-right">
            <a @click="download" class="download" href="###">下载</a>
            <div class="user">
                <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                        <img :src="user.avatar" alt="头像" class="avatar-small"/>
                    </span>
                    <el-dropdown-menu class="user-drop-down" slot="dropdown">
                        <div class="user-info">
                            <p class="user-company">{{user.company}}</p>
                            <div class="user-avatar">
                                <img :src="user.avatar" alt="头像"/>
                            </div>
                            <p class="user-name">{{user.name}}</p>
                        </div>
                        <div class="user-menu">
                            <a class="menu-item" href="/">
                                <i class="fa fa-file"></i>
                                <span>我的方案</span>
                            </a>
                            <a class="menu-item" href="/account">
                                <i class="fa fa-user"></i>
                                <span>我的账号</span>
                            </a>
                            <a class="menu-item" href="javascript:;">
                                <i class="fa fa-key"></i>
                                <span>修改密码</span>
                            </a>
                        </div>
                        <div class="logout">
                            <a href="###">退出</a>
                        </div>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                project: {
                    name: "测试方案"
                },
                user: {
                    name: "皮卡丘",
                    avatar:
                        "http://cdn.lightank.com/images/2019/0531/be527bb515a582af5ef98b7b6feb75108f88afe4.png",
                    company: "大同有限公司"
                }
            };
        },
        methods: {
            handleCommand() {
                // TODO弹窗填写公司信息和方案信息
                console.log();
            },
            download() {
                // TODO下载
            }
        }
    };
</script>
<style lang="scss">
    .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 45px;
        border-bottom: 1px solid rgb(203, 203, 203);

        .tb-left {
            display: flex;
            align-items: center;

            .back {
                width: 44px;
                height: 44px;
                line-height: 42px;
                text-align: center;
                font-size: 28px;

                &:hover {
                    color: #3388ff;
                }
            }

            .project-info {
                height: 30px;
                padding: 0 10px;
                cursor: pointer;

                span {
                    font-size: 16px;
                    display: inline-block;
                    line-height: 30px;
                    margin-right: 5px;
                }

                i {
                    font-size: 14px;
                }

                &:hover {
                    background-color: rgba(96, 111, 123, 0.2);
                }
            }

            .project-set {
                span {
                    font-size: 12px;
                    margin-left: 10px;
                    color: #3388ff;
                    cursor: pointer;
                }
            }
        }

        .tb-right {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 20px;

            .download {
                display: block;
                padding: 0 20px;
                height: 44px;
                line-height: 44px;
                text-align: center;
                color: #3388ff;

                &:hover {
                    background-color: #eff8ff;
                }
            }

            .user {
                .el-dropdown-link {
                    display: block;
                    height: 44px;
                    line-height: 44px;
                    padding: 0 20px;
                    cursor: pointer;

                    &:hover {
                        background-color: #eff8ff;
                    }

                    img {
                        vertical-align: middle;
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                    }
                }
            }
        }
    }

    .user-info {
        width: 270px;
        padding: 15px;
        border-bottom: 1px solid #eaeaea;

        .user-company {
            text-align: center;
            font-weight: 700;
            font-size: 12px;
            margin-bottom: 10px;
        }

        .user-avatar {
            margin: 0 auto;
            width: 60px;
            height: 60px;
            margin-bottom: 10px;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }

        .user-name {
            text-align: center;
            color: #777;
        }
    }

    .user-drop-down {
        .user-menu {
            padding: 20px 0;
            display: flex;
            justify-content: center;

            .menu-item {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 80px;
                height: 80px;
                color: #333;

                i {
                    color: #888;
                    font-size: 20px;
                    margin-bottom: 10px;
                }

                &:hover {
                    background-color: #eff8ff;

                    i {
                        color: #3388ff;
                    }

                    span {
                        color: #3388ff;
                    }
                }
            }
        }

        .logout {
            display: flex;
            margin-bottom: -10px;
            justify-content: center;
            align-items: center;
            height: 50px;
            border-top: 1px solid #eaeaea;
            background-color: #f5f5f6;

            a {
                &:hover {
                    color: #3388ff;
                }
            }
        }
    }
</style>