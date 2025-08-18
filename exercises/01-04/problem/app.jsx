import React, { useState } from "react";

function Form() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
  });

  function handleNameChange(e) {
    setForm((prev) => ({ ...prev, name: e.target.value }));
  }
  function handleEmailChange(e) {
    setForm((prev) => ({ ...prev, email: e.target.value }));
  }
  function handleAgeChange(e) {
    setForm((prev) => ({ ...prev, age: e.target.value }));
  }

  return (
    <form>
      <input
        name="name"
        value={form.name}
        onChange={handleNameChange}
        placeholder="Name"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleEmailChange}
        placeholder="Email"
      />
      <input
        name="age"
        value={form.age}
        onChange={handleAgeChange}
        placeholder="Age"
      />
    </form>
  );
}

import React, { useState } from "react";

function Form() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
  });

  function handleNameChange(e) {
    setForm((prev) => ({ ...prev, name: e.target.value }));
  }
  function handleEmailChange(e) {
    setForm((prev) => ({ ...prev, email: e.target.value }));
  }
  function handleAgeChange(e) {
    setForm((prev) => ({ ...prev, age: e.target.value }));
  }

  return (
    <form>
      <input
        name="name"
        value={form.name}
        onChange={handleNameChange}
        placeholder="Name"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleEmailChange}
        placeholder="Email"
      />
      <input
        name="age"
        value={form.age}
        onChange={handleAgeChange}
        placeholder="Age"
      />
    </form>
  );
}

export default Form;
