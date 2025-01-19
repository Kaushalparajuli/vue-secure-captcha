# Vue Secure CAPTCHA

A secure, customizable CAPTCHA component for Vue.js applications.

## Installation

```bash
npm install vue-secure-captcha
```

Code Implementation

```javascript
<template>
    <SecureCaptcha
    :length="6"
    @verified="handleVerification"
    />
</template>

<script setup>
    import {SecureCaptcha} from 'vue-secure-captcha'

    const handleVerification = (verified) => {
    if (verified) {
    console.log('CAPTCHA verified!')
}
}
</script>
```

```html
Props

length (Number, default: 6): Number of characters in CAPTCHA
charset (String, default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'): Characters to use
width (Number, default: 300): Canvas width
height (Number, default: 100): Canvas height

Events

@verified: Emitted when CAPTCHA is correctly verified
@failed: Emitted when verification fails
```
# vue-secure-captcha
# vue-secure-captcha
