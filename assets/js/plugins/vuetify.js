import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

export const registerVuetify = (app, themeData = {}) => {
    const vuetify = createVuetify({
        theme: {
            themes: {
                light: {
                    colors: {
                        background: '#f5f5f5',
                        primary: '#5FA897',
                        secondary: '#F6F3D6',
                    },
                },
            },
        },
    });

    app.use(vuetify);
    return vuetify;
};
