import api from './api';

class User {
    constructor(opts = null) {
        this.opts = opts || {};
    }

    hasRole(role) {
        if (!this.opts.roles) {
            return false;
        }
        return this.opts.roles.indexOf(role) > -1;
    }

    hasAccess(access) {
        if (!this.opts.accesses) {
            return false;
        }
        return this.opts.accesses.indexOf(access) > -1;
    }

    hasSignature() {
        if (!this.opts.eds || !this.opts.eds.has_signature) {
            return false;
        }
        return !!this.opts.eds.has_signature;
    }

    hasOpts() {
        return !!(this.opts?.id && this.opts.id > 0);
    }
}

class Config {
    constructor() {
        this.params = {
            user: null,
            systemConfig: {}
        };
        this.settings = {
            appBar: 'modern',
        };
    }

    reload() {
        return api.get('/initialize')
            .then(response => {
                this.params = response;
                return response;
            })
            .catch(error => {
                console.error('Initialize error:', error);
                // Fallback для разработки
                this.params = {
                    user: null,
                    systemConfig: {}
                };
                return this.params;
            });
    }

    get(name) {
        return this.params[name];
    }

    set(name, value) {
        return (this.params[name] = value);
    }

    getUser() {
        return new User(this.get('user'));
    }

    isGuest() {
        return !this.getUser()?.hasOpts();
    }

    getConfig(code) {
        return this.get('systemConfig')[code];
    }

    getSettings() {
        return this.settings;
    }
}

export default new Config();
