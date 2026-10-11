export const CSV_GUIDE_EXAMPLE = {
  input: "name,age\nAlice,28\nBob,31",
  output: '[\n  {\n    "name": "Alice",\n    "age": "28"\n  },\n  {\n    "name": "Bob",\n    "age": "31"\n  }\n]',
};
export const HTML_GUIDE_EXAMPLE = {
  input: `<div   class="container"   id="main"  >
  <!-- Main Heading Comment -->
  <h1>   Welcome to AI Text Utility   </h1>
  <p>Fast, private text tools.</p>
</div>`,
  output: `<div class="container" id="main" >
\x20\x20
  <h1>   Welcome to AI Text Utility   </h1>
  <p>Fast, private text tools.</p>
</div>`,
};
