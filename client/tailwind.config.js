/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // src 폴더 안의 모든 .js, .jsx 파일을 스캔
  ],
  theme: {
    extend: {
      // (선택사항) 경북대 색상 등 커스텀 색상을 여기서 추가할 수 있습니다.
      colors: {
        'knu-blue': '#003A7C',
        'knu-blue-light': '#E6F2FF',
      }
    },
  },
  plugins: [],
}