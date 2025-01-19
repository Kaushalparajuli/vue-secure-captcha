import SecureCaptcha from "./components/SecureCaptcha.vue";

// Named export
export { SecureCaptcha };

// Default export for Vue plugin
export default {
  install: (app) => {
    app.component("SecureCaptcha", SecureCaptcha);
  },
};
