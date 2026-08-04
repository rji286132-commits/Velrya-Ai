  const handleRegister = async () => {
    if (!email || !password) {
      alert("Email and password required");
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    // DIRECT SUPABASE - API BYPASS
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("✅ Account ban gaya! Ab login karo");
      router.push("/login");
    }
  };
