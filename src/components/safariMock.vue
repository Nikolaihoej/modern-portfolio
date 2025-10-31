<template>
  <!-- NOT MY COMPONENT - https://github.com/Inspirational-UI/Inspirational-UI/blob/main/src/components/SafariMock.vue -->
  <svg
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 1203 753"
    style="display: block;"
  >
    <g clip-path="url(#path0)">
      <!-- Safari browser frame paths and circles (copy from inspira-ui SVG) -->
      <path
        d="M0 52H1202V741C1202 747.627 1196.63 753 1190 753H12C5.37258 753 0 747.627 0 741V52Z"
        fill="#262626"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0 12C0 5.37258 5.37258 0 12 0H1190C1196.63 0 1202 5.37258 1202 12V52H0L0 12Z"
        fill="#404040"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M1.06738 12C1.06738 5.92487 5.99225 1 12.0674 1H1189.93C1196.01 1 1200.93 5.92487 1200.93 12V51H1.06738V12Z"
        fill="#262626"
      />
      <circle cx="27" cy="25" r="6" fill="#404040" />
      <circle cx="47" cy="25" r="6" fill="#404040" />
      <circle cx="67" cy="25" r="6" fill="#404040" />
      <path
        d="M286 17C286 13.6863 288.686 11 292 11H946C949.314 11 952 13.6863 952 17V35C952 38.3137 949.314 41 946 41H292C288.686 41 286 38.3137 286 35V17Z"
        fill="#404040"
      />
      <!-- Address bar text -->
      <text
        x="580"
        y="30"
        fill="#A3A3A3"
        font-size="12"
        font-family="Arial, sans-serif"
      >
        {{ url }}
      </text>
      <!-- Your image inside the browser mock -->
      <image
        width="1200"
        height="700"
        x="1"
        y="52"
        preserveAspectRatio="xMidYMid slice"
        :href="src"
        style="clip-path: url(#roundedBottom)"
      />
    </g>
    <defs>
      <clipPath id="path0">
        <rect width="1203" height="753" fill="white" />
      </clipPath>
      <clipPath id="roundedBottom">
        <path
          d="M1 52H1201V741C1201 747.075 1196.08 752 1190 752H12C5.92486 752 1 747.075 1 741V52Z"
          fill="white"
        />
      </clipPath>
    </defs>
  </svg>
</template>

<script setup lang="ts">
defineProps({
  url: String,
  src: String
});
</script>