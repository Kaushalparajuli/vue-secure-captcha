import SecureCaptcha from "./components/SecureCaptcha.vue";

export { SecureCaptcha };

export default {
  install: (app) => {
    app.component("SecureCaptcha", SecureCaptcha);
  },
};
