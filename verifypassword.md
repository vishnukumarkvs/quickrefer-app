```
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const history = useHistory();

  const handleEmailSubmit = async () => {
    // call api to send otp
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    // handle response
  };

  const handleOtpSubmit = async () => {
    // call api to verify otp
    const response = await fetch('/api/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    // redirect to password update page if otp is correct
    if (data.success) {
      history.push('/update-password');
    }
  };

  return (
    <div>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <button onClick={handleEmailSubmit}>Send OTP</button>
      <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="OTP" />
      <button onClick={handleOtpSubmit}>Verify OTP</button>
    </div>
  );
}

export default ResetPasswordPage;

```

```
const express = require('express');
const app = express();

// allow parsing json body
app.use(express.json());

app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  // here you will call the function to send the otp and respond accordingly
  // for now I'll just simulate this with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  res.json({ success: true });
});

app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  // here you will call the function to verify the otp and respond accordingly
  // for now I'll just simulate this with a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  res.json({ success: true });
});

app.listen(3000, () => console.log('Server listening on port 3000'));

```
