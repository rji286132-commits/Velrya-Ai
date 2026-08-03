const handleRegister = async () => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.success) {
    alert('Account ban gaya! Role: ' + data.user.role);
    router.push('/login');
  } else {
    alert(data.error);
  }
};
