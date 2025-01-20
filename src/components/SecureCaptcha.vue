<!-- components/SecureCaptcha.vue -->
<template>
  <div style="width: 100%">
    <!-- CAPTCHA Image -->
    <div
      style="
        position: relative;
        background-color: #f3f4f6;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        border: 1px solid #e5e7eb;
      "
    >
      <img
        :src="captchaImage"
        alt="CAPTCHA"
        style="width: 100%; height: 96px; object-fit: contain; display: block"
      />
      <button
        v-if="canReset"
        style="
          position: absolute;
          top: 8px;
          right: 8px;
          color: #6b7280;
          cursor: pointer;
          background: none;
          border: none;
          font-size: 20px;
          padding: 4px;
        "
        @click="regenerateCaptcha"
      >
        ↺ Reset
      </button>
    </div>

    <!-- Input field -->
    <div style="position: relative; margin-bottom: 16px">
      <input
        v-model="userInput"
        :disabled="isVerified"
        :maxlength="length"
        :placeholder="`Enter ${length} characters`"
        :style="{
          width: '100%',
          padding: '8px 40px 8px 12px',
          border: `2px solid ${
            isVerified ? '#10b981' : showError ? '#ef4444' : '#e5e7eb'
          }`,
          borderRadius: '8px',
          fontSize: '16px',
          lineHeight: 1.5,
          outline: 'none',
          transition: 'all 0.2s',
        }"
        type="text"
        @input="handleInputChange"
      />

      <!-- Success Check Icon -->
      <div
        v-if="isVerified"
        style="
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: #10b981;
        "
      >
        ✓
      </div>

      <!-- Error Cross Icon -->
      <div
        v-if="showError"
        style="
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: #ef4444;
        "
      >
        ✕
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  length: {
    type: Number,
    default: 6,
    validator: (value) => value > 0 && value <= 12,
  },
  charset: {
    type: String,
    default: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  },
  width: {
    type: Number,
    default: 300,
  },
  height: {
    type: Number,
    default: 100,
  },
  canReset: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["verified", "failed"]);

const captchaImage = ref("");
const captchaText = ref("");
const userInput = ref("");
const isVerified = ref(false);
const showError = ref(false);

// Generate random captcha text
const generateCaptchaText = () => {
  let result = "";
  for (let i = 0; i < props.length; i++) {
    result += props.charset.charAt(
      Math.floor(Math.random() * props.charset.length)
    );
  }
  return result;
};

// Generate captcha image with increased rotation
const generateCaptchaImage = (text) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = props.width;
  canvas.height = props.height;

  // Fill background
  ctx.fillStyle = "#f3f4f6";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add noise (random dots)
  for (let i = 0; i < (props.width * props.height) / 30; i++) {
    ctx.fillStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${
      Math.random() * 255
    },0.15)`;
    ctx.fillRect(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      2,
      2
    );
  }

  // Add random lines
  for (let i = 0; i < props.length + 3; i++) {
    ctx.strokeStyle = `rgba(${Math.random() * 255},${Math.random() * 255},${
      Math.random() * 255
    },0.3)`;
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }

  // Add text with increased random rotations
  const chars = text.split("");
  const spacing = props.width / (text.length + 1);
  const fontSize = Math.min(
    props.height * 0.6,
    (props.width * 0.8) / text.length
  );

  chars.forEach((char, index) => {
    ctx.font = `bold ${fontSize}px monospace`;
    ctx.fillStyle = "#374151";

    // Increased rotation up to 45 degrees (π/4 radians)
    const rotation = ((Math.random() - 0.5) * Math.PI) / 4;
    const x = spacing * (index + 1);
    const y = props.height / 2 + Math.random() * 10 - 5;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Random vertical offset
    const yOffset = Math.random() * 10 - 5;
    ctx.fillText(char, 0, yOffset);

    ctx.restore();
  });

  return canvas.toDataURL("image/png");
};

// Regenerate captcha
const regenerateCaptcha = () => {
  const newText = generateCaptchaText();
  captchaText.value = newText;
  captchaImage.value = generateCaptchaImage(newText);
};

// Handle incorrect attempt
const handleIncorrectAttempt = () => {
  emit("failed");
  showError.value = true;
  userInput.value = "";

  setTimeout(() => {
    regenerateCaptcha();
  }, 100);

  setTimeout(() => {
    showError.value = false;
  }, 3000);
};

// Handle input change
const handleInputChange = () => {
  userInput.value = userInput.value.toUpperCase();

  if (userInput.value.length === props.length) {
    if (userInput.value === captchaText.value) {
      isVerified.value = true;
      emit("verified", true);
    } else {
      handleIncorrectAttempt();
    }
  }
};

// Initialize captcha on mount
onMounted(() => {
  regenerateCaptcha();
});
</script>

<style>
.vue-captcha-captcha-container {
  width: 100%;
  font-family: sans-serif;
}

.vue-captcha-captcha-image-container {
  position: relative;
  background-color: #f3f4f6;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.vue-captcha-captcha-image {
  width: 100%;
  height: 96px;
  object-fit: contain;
}

.vue-captcha-reset-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: #6b7280;
  cursor: pointer;
  background: none;
  border: none;
  font-size: 1.25rem;
  padding: 0.25rem;
  transition: color 0.2s;
}

.vue-captcha-reset-button:hover {
  color: #374151;
}

.vue-captcha-input-container {
  position: relative;
  margin-bottom: 1rem;
}

.vue-captcha-input-field {
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
}

.vue-captcha-input-field:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.vue-captcha-input-success {
  border-color: #10b981;
}

.vue-captcha-input-success:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.vue-captcha-input-error {
  border-color: #ef4444;
}

.vue-captcha-input-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.vue-captcha-status-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  animation: fadeScale 0.2s ease-in-out;
}

.vue-captcha-success-icon {
  color: #10b981;
}

.vue-captcha-error-icon {
  color: #ef4444;
}

.vue-captcha-error-message {
  background-color: #fef2f2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #fee2e2;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeScale {
  from {
    opacity: 0;
    transform: translateY(-50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
