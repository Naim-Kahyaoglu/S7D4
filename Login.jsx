import React, { useEffect, useState } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const initialForm = {
  email: '',
  password: '',
  terms: false,
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

export default function Login() {
  const [form, setForm] = useState(initialForm);
  const history = useHistory();

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    const newValue = type === 'checkbox' ? checked : value;
    setForm({ ...form, [name]: newValue });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!emailRegex.test(form.email)) {
      alert("Geçerli bir e-posta adresi girin.");
      return;
    }
    
    if (!passwordRegex.test(form.password)) {
      alert("Şifre en az 8 karakter, bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir.");
      return;
    }

    if (!form.terms) {
      alert("Şartları kabul etmelisiniz.");
      return;
    }

    axios
      .get('https://6540a96145bedb25bfc247b4.mockapi.io/api/login')
      .then((res) => {
        const user = res.data.find(
          (item) => item.password === form.password && item.email === form.email
        );
        if (user) {
          setForm(initialForm);
          history.push('/main');
        } else {
          history.push('/error');
        }
      });
  };

  const isFormValid = emailRegex.test(form.email) && passwordRegex.test(form.password) && form.terms;

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label for="exampleEmail">Email</Label>
        <Input
          id="exampleEmail"
          name="email"
          placeholder="Enter your email"
          type="email"
          onChange={handleChange}
          value={form.email}
        />
      </FormGroup>
      <FormGroup>
        <Label for="examplePassword">Password</Label>
        <Input
          id="examplePassword"
          name="password"
          placeholder="Enter your password"
          type="password"
          onChange={handleChange}
          value={form.password}
        />
      </FormGroup>

      <FormGroup check>
        <Label check>
          <Input
            type="checkbox"
            name="terms"
            id="terms"
            checked={form.terms}
            onChange={handleChange}
          />
          {' I agree to terms of service and privacy policy'}
        </Label>
      </FormGroup>

      <FormGroup className="text-center p-4">
        <Button color="primary" disabled={!isFormValid}>
          Sign In
        </Button>
      </FormGroup>
    </Form>
  );
}
