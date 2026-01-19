const socket = io("http://localhost:3000", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InByb2ZpbGVQaWN0dXJlIjp7InB1YmxpY19pZCI6IiIsInNlY3VyZV91cmwiOiJodHRwczovL3VwbG9hZC53aWtpbWVkaWEub3JnL3dpa2lwZWRpYS9jb21tb25zL2EvYWMvRGVmYXVsdF9wZnAuanBnPzIwMjAwNDE4MDkyMTA2In0sIl9pZCI6IjY5NjRjYTNlZmZlZjA2YzUzNzk3N2RmMiIsInVzZXJuYW1lIjoiQWxpIEZvdWRhIiwiZW1haWwiOiJhbGlmb3VkYTE0NzRAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkSFFmQU9vUnIybERYZmI2WWJELnpBT2ZQRy9hRnM4akZ5SENrQnJrOTJWbE1tMHpWQlNqUWUiLCJyb2xlIjpbInVzZXIiLCJhZG1pbiJdLCJwYXNzd29yZE90cCI6IiIsInZlcmlmaWNhdGlvbk90cCI6IiIsImlzVmVyaWZpZWQiOmZhbHNlLCJjcmVhdGVkQXQiOiIyMDI2LTAxLTEyVDEwOjE3OjM0LjU4N1oiLCJ1cGRhdGVkQXQiOiIyMDI2LTAxLTEyVDEwOjE3OjM0LjU4N1oiLCJfX3YiOjB9LCJpYXQiOjE3Njg3NzIyMTQsImV4cCI6MjAyNzk3MjIxNH0.HBXxlwq-yl8_cU8omMYFk_SAsHqDzIuLMtDZBV5BjGQ",
  },
});

socket.on("connect", () => {
  console.log(`User Connected: ${socket.id}`);
  console.log(socket.user);
});

socket.on("createOrder", (data) => console.log(data));
