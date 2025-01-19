# Vue Secure CAPTCHA

A secure, customizable CAPTCHA component for Vue.js applications with no external dependencies.

## Features

- 🔒 Secure image generation
- 🎨 Customizable appearance
- 📱 Mobile-friendly
- 🎯 Easy to implement
- ⚡ Lightweight
- 🔄 Auto-regeneration on failed attempts
- ✨ Smooth animations and transitions

## Installation

```bash
npm install vue-secure-captcha
```

## Quick Start

```js
// main.js - Global registration
import {createApp} from 'vue'
import VueCaptcha from 'vue-secure-captcha'

const app = createApp(App)
app.use(VueCaptcha)
```

```vue
<!-- YourComponent.vue -->
<template>
  <SecureCaptcha
      :length="6"
      @verified="handleVerification"
      @failed="handleFailure"
  />
</template>

<script setup>
// Local registration
import {SecureCaptcha} from 'vue-secure-captcha'

const handleVerification = (verified) => {
  if (verified) {
    console.log('CAPTCHA verified!')
  }
}

const handleFailure = () => {
  console.log('CAPTCHA verification failed')
}
</script>
```

## Props

| Prop    | Type   | Default                                | Description                     |
|---------|--------|----------------------------------------|---------------------------------|
| length  | Number | 6                                      | Number of characters in CAPTCHA |
| charset | String | 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' | Characters to use               |
| width   | Number | 300                                    | Canvas width in pixels          |
| height  | Number | 100                                    | Canvas height in pixels         |

## Events

| Event    | Payload | Description                                |
|----------|---------|--------------------------------------------|
| verified | Boolean | Emitted when CAPTCHA is correctly verified |
| failed   | void    | Emitted when verification fails            |

## Examples

### Numbers Only CAPTCHA

```vue
<SecureCaptcha 
  :length="4"
  charset="0123456789"
