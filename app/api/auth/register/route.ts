const handleRegister = async () => {
  if (!email || !password) {
    alert('Email and password required');
    return;
  }

  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      email: email.toLowerCase().trim(), 
      password 
    }),
  });
  
  const data = await res.json();
  
  if (data.success) {
    alert('Account ban gaya! Welcome to Velrya AI');
    router.push('/login');
  } else {
    alert(data.error || 'Something went wrong');
  }
};
