export default defineAppConfig({
  ui: {
    colors: {
      main: "main",
    },
    button: {
      slots: {
        base: "rounded-none hover:cursor-pointer duration-300",
      },
    },
    pagination: {
      slots: {
        item: "ring-0",
        first: "ring-0",
        last: "ring-0",
        next: "ring-0",
        prev: "ring-0",
      },
    },
    fileUpload: {
      slots: {
        base: "border-none! rounded-none!",
      },
    },
    progress: {
      slots: {
        base: "rounded-none",
        indicator: "rounded-none",
      },
    },
    form: {
      base: "flex flex-col items-center justify-center",
    },
    modal: {
      slots: {
        content: "rounded-none!",
      },
    },
  },
});
