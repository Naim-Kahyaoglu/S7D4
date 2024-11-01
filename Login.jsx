import React, { useEffect, useState } from 'react';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const initialForm = {
  email: '',
  password: '',
  terms: false, // Kullanıcının onay durumunu tutmak için
};

export default function Login() {
  const [form, setForm] = useState(initialForm);
  const history = useHistory();

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    const newValue = type === 'checkbox' ? checked : value; // Checkbox için value'yu checked'den al
    setForm({ ...form, [name]: newValue }); // Form durumunu güncelle
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .get('https://6540a96145bedb25bfc247b4.mockapi.io/api/login')
      .then((res) => {
        const user = res.data.find(
          (item) => item.password === form.password && item.email === form.email
        );
        if (user) {
          setForm(initialForm); // Başarılı girişten sonra formu sıfırla
          history.push('/main'); // Ana sayfaya yönlendir
        } else {
          history.push('/error'); // Hata sayfasına yönlendir
        }
      });
  };

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
          value={form.email} // Email girdisini formdan al
        />
      </FormGroup>
      <FormGroup>
        <Label for="examplePassword">Password</Label>
        <Input
          id="examplePassword"
          name="password"
          placeholder="Enter your password "
          type="password"
          onChange={handleChange}
          value={form.password} // Şifre girdisini formdan al
        />
      </FormGroup>

      {/* Checkbox Ekle */}
      <FormGroup check>
        <Label check>
          <Input
            type="checkbox"
            name="terms" // Checkbox için name
            id="terms" // Checkbox için id
            checked={form.terms} // Checkbox'ın onay durumunu formdan al
            onChange={handleChange} // Checkbox durumu değiştiğinde handleChange'i çağır
          />
          {' I agree to terms of service and privacy policy'}{' '}
          {/* Checkbox etiket metni */}
        </Label>
      </FormGroup>

      <FormGroup className="text-center p-4">
        <Button color="primary" disabled={!form.terms}>
          Sign In
        </Button>{' '}
        {/* Checkbox onaylı değilse butonu devre dışı bırak */}
      </FormGroup>
    </Form>
  );
}
//Login Dosyası açıldı. Tekrar- Commit ismi düzenlee.
