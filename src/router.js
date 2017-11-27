import Main from './views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['./views/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error_404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['./views/error_page/404.vue'], resolve); }
};

export const page401 = {
    path: '/401',
    meta: {
        title: '401-权限不足'
    },
    name: 'error_401',
    component: resolve => { require(['./views/error_page/401.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error_500',
    component: resolve => { require(['./views/error_page/500.vue'], resolve); }
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: resolve => { require(['./views/form/article-publish/preview.vue'], resolve); }
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => { require(['./views/main_components/locking-page.vue'], resolve); }
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: resolve => { require(['./views/home/home.vue'], resolve); } },
        { path: 'ownspace', title: '个人中心', name: 'ownspace_index', component: resolve => { require(['./views/own-space/own-space.vue'], resolve); } },
        { path: 'order/:order_id', title: '订单详情', name: 'order_info', component: resolve => { require(['./views/advanced-router/component/order-info.vue'], resolve); } },  // 用于展示动态路由
        { path: 'shopping', title: '购物详情', name: 'shopping', component: resolve => { require(['./views/advanced-router/component/shopping-info.vue'], resolve); } },  // 用于展示带参路由
        { path: 'message', title: '消息中心', name: 'message_index', component: resolve => { require(['./views/message/message.vue'], resolve); } },
        { 
            path: 'punch', 
            title: '打卡记录',
            name: 'punch', 
            component: resolve => { 
                require([
                    './views/tables/components/punchTable.vue'
                ], resolve); 
            } 
        },
        { 
            path: 'friends', 
            title: '好友列表',
            name: 'friends', 
            component: resolve => { 
                require([
                    './views/tables/components/friendsTable.vue'
                ], resolve); 
            } 
        }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/component',
        icon: 'social-buffer',
        name: 'component',
        title: '早起提醒时间设置',
        component: Main,
        children: [
            {
                path: 'text-kefu',
                icon: 'compose',
                name: 'text-kefu',
                title: '早起提醒时间设置',
                component: resolve => { require(['./views/my_components/text-kefu/text-kefu.vue'], resolve); }
            }
        ]
    },
    {
        path: '/form',
        icon: 'android-checkbox',
        name: 'form',
        title: '基本配置',
        component: Main,
        children: [
            {
                path: 'image-yaoqing',
                icon: 'crop',
                name: 'image-yaoqing',
                title: '邀请卡',
                component: resolve => { require(['./views/my_components/image-yaoqing/image-yaoqing.vue'], resolve); }
            },
            {
                path: 'image-cardshow',
                icon: 'crop',
                name: 'image-cardshow',
                title: '打卡图',
                component: resolve => { require(['./views/my_components/image-cardshow/image-cardshow.vue'], resolve); }
            },
            {
                path: 'join-set',
                icon: 'compose',
                name: 'join-set',
                title: '参加活动页面配置',
                component: resolve => { require(['./views/my_components/join-set/join-set.vue'], resolve); }
            },
            {
                path: 'change-icon',
                icon: 'compose',
                name: 'change-icon',
                title: '更换客服头像',
                component: resolve => { require(['./views/my_components/change-icon/change-icon.vue'], resolve); }
            }
        ]
    },
    {
        path: '/tables',
        icon: 'ios-grid-view',
        name: 'tables',
        title: '数据展示',
        component: Main,
        children: [
            { path: 'exportableTable', title: '用户信息', name: 'exportable-table', icon: 'code-download', component: resolve => { require(['./views/tables/exportable-table.vue'], resolve); } },
            { path: 'table2image', title: '表格转图片', name: 'table-to-image', icon: 'images', component: resolve => { require(['./views/tables/table-to-image.vue'], resolve); } }
        ]
    },
    {
        path: '/advanced-router',
        icon: 'ios-infinite',
        name: 'advanced-router',
        title: '高级路由',
        component: Main,
        children: [
            { path: 'mutative-router', title: '动态路由', name: 'mutative-router', icon: 'link', component: resolve => { require(['./views/advanced-router/mutative-router.vue'], resolve); } },
            { path: 'argument-page', title: '带参页面', name: 'argument-page', icon: 'android-send', component: resolve => { require(['./views/advanced-router/argument-page.vue'], resolve); } }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    page500,
    page401,
    page404
];
