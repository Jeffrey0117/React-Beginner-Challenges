import React, { useState } from "react";

function Form() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <form>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="age"
        value={form.age}
        onChange={handleChange}
        placeholder="Age"
      />
    </form>
  );
}

export default Form;
