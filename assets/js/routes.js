import { createRouter, createWebHashHistory } from 'vue-router';
import Config from './config';

import AnonLayout from './layouts/AnonLayout.vue';
import AuthedLayout from './layouts/AuthedLayout.vue';

import Login from './pages/public/Login.vue';
import Register from './pages/public/Register.vue';
import Home from './pages/Home.vue';
import PublicHome from './pages/Home.vue';
import ViewDatabasePage from "@/pages/ViewDatabasePage.vue";
import Profile from '@/pages/Profile.vue'

/**
 * Роуты под компонент с авторизированным доступом
 */
const protectedRoute = {
    path: '/',
    name: 'procedures-parent',
    component: AuthedLayout,
    meta: {
        title: '',
        requiresAuth: true,
    },
    children: [
        {
            path: '/profile',
            name: 'profile',
            component: Profile,
            meta: {
                title: 'Профиль',
                requiresAuth: true,
            }
        },
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: {
                title: 'Главная',
                requiresAuth: true,
            },
        },
        {
            path: '/viewDatabase',
            name: 'viewDatabase',
            component: ViewDatabasePage,
            meta: {
                requiresAuth: true,
            },
        },
    ]
};

/**
 * Роуты под компонент с анонимным доступом.
 */
const publicRoute = {
    path: '/',
    name: 'auth-parent',
    component: AnonLayout,
    meta: {
        requiresAuth: false,
    },
    children: [
        {
            path: '/',
            name: 'public-home',
            component: PublicHome,
            meta: {
                title: 'Главная',
                requiresAuth: false,
            },
        },
        {
            path: '/auth/login',
            name: 'login',
            component: Login,
            meta: {
                requiresAuth: false,
            },
        },
        {
            path: '/auth/register',
            name: 'register',
            component: Register,
            meta: {
                requiresAuth: false,
            },
        },
    ],
};

function makeRouter(user = null) {
    const router = createRouter({
        history: createWebHashHistory(),
        routes: [protectedRoute, publicRoute],
    });

    router.beforeEach((to, from, next) => {
        const user = Config.getUser();
        const isAuthenticated = user && user.hasOpts();

        if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
            next('/auth/login');
        }
        else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
            next('/');
        }
        else if (to.name === 'public-home') {
            next();
        }
        else {
            next();
        }
    });

    return router;
}

export { makeRouter };
