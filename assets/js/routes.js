import { createRouter, createWebHashHistory } from 'vue-router';
import Config from './config';

// Layouts
import AnonLayout from './layouts/AnonLayout.vue';
import AuthedLayout from './layouts/AuthedLayout.vue';

// Pages
import Login from './pages/public/Login.vue';
import Home from './pages/Home.vue';
import ViewDatabasePage from "@/pages/ViewDatabasePage.vue";

const menu = [
    {
        name: 'Процедуры',
        path: '/procedures',
        icon: 'file-document-multiple-outline',
        requireAccreditation: true
    }
];

const adminMenu = [
    {
        name: 'Процедуры',
        path: '/procedures',
        icon: 'file-document-multiple-outline',
    }
];

const adminRoutes = {
    component: AuthedLayout,
    path: '/admin',
    name: 'admin-parent',
    meta: {
        allowedRoles: ['ROLE_ADMIN'],
        redirectForbiddenTo: (user) => `/procedures`
    },
    children: [
        {
            path: '/admin/procedures',
            name: 'admin.procedures.all',
            component: Home,
            meta: {
                title: 'Все процедуры',
                requiresAuth: true,
            },
        }
    ]
};

/**
 * Роуты под компонент с авторизированным доступом
 */
const protectedRoute = {
    path: '/',
    name: 'procedures-parent',
    component: AuthedLayout,
    meta: {
        title: 'Процедуры',
        requiresAuth: true,
    },
    redirect: () => {
        return Config.isGuest() ? '/auth/login' : '/procedures';
    },
    guestRedirect: '/auth/login',
    children: [
        {
            path: '/procedures',
            name: 'procedures.all',
            component: Home,
            meta: {
                title: 'Все процедуры',
                requiresAuth: true,
            },
        },
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: {
                title: 'Главная',
                requiresAuth: true,
            },
        }
    ]
};

/**
 * Роуты под компонент с анонимным доступом.
 * Без меню и информации о пользователе.
 */
const publicRoute = {
    path: '/auth',
    name: 'auth-parent',
    component: AnonLayout,
    children: [
        {
            path: '/auth/login',
            name: 'login',
            component: Login,
            meta: {
                requiresAuth: false,
            },
        },
        {
            path: '/viewDatabase',
            name: 'viewDatabase',
            component: ViewDatabasePage,
            meta: {
                requiresAuth: false,
            },
        },
    ],
};

function makeRouter(user = null) {
    const router = createRouter({
        history: createWebHashHistory(),
        routes: [protectedRoute, publicRoute, adminRoutes],
    });

    router.beforeEach((to, from, next) => {
        if (to.matched.some((route) => route.meta.requiresAuth)) {
            // const user = Config.getUser();
            //
            // if (!user || !user.hasOpts()) {
            //     sessionStorage.setItem('redirectUrlAfterLogin', to.fullPath);
            //     next({
            //         path: '/auth/login',
            //     });
            // } else {
            //     const routeWithRoles = to.matched.find(route => route.meta.allowedRoles);
            //     if (routeWithRoles) {
            //         // const hasAccess = routeWithRoles.meta.allowedRoles.some(role => user.hasRole(role));
            //         // if (!hasAccess) {
            //         //     return next({path: routeWithRoles.meta.redirectForbiddenTo(user)});
            //         // } else {
            //         return next()
            //         // }
            //     } else {
            //         return next()
            //     }
            // }
            next();
        } else {
            next();
        }
    });

    return router;
}

/**
 *
 * @param {User} user
 */
function makeMenu(user) {
    if (user.hasRole('ROLE_ADMIN')) {
        return adminMenu;
    }

    return menu;
}

export { makeRouter, makeMenu };
