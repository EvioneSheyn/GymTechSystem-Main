module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"], // ✅ This sets the base directory
          alias: {
            root: "./",
            "@": "./src", // ✅ This makes `@` point to the project root
          },
        },
      ],
    ],
  };
};
