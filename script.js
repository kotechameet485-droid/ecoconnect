/* ===================================================
   EcoConnect – Food Waste Management System
   Open Source Technologies (OST) Practical Project
   Author: B.Tech 3rd Year CS Student
   File: script.js (Vanilla JavaScript Validation & Full-Stack API Integration)
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===================================================
    // HELPER VALIDATION FUNCTIONS
    // ===================================================
    
    // Function to set error state and message
    function setError(input, errorElement, message) {
        if (input) {
            input.classList.add('invalid');
        }
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('visible');
        }
    }

    // Function to clear error state and message
    function clearError(input, errorElement) {
        if (input) {
            input.classList.remove('invalid');
        }
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('visible');
        }
    }

    // Regex Patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const phoneRegex = /^\d{10}$/;
    const pinRegex = /^\d{6}$/;

    // ===================================================
    // PAGE 1: REGISTER FORM VALIDATION & API INTEGRATION (register.html)
    // ===================================================
    const registerForm = document.getElementById('registerForm');
    const registerBtn = document.getElementById('registerBtn');

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // 1. Full Name Validation
            const fullName = document.getElementById('fullName');
            const errFullName = document.getElementById('errFullName');
            if (!fullName.value.trim()) {
                setError(fullName, errFullName, 'Full Name is required.');
                isValid = false;
            } else {
                clearError(fullName, errFullName);
            }

            // 2. Email Validation
            const email = document.getElementById('email');
            const errEmail = document.getElementById('errEmail');
            if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
                setError(email, errEmail, 'Please enter a valid email address.');
                isValid = false;
            } else {
                clearError(email, errEmail);
            }

            // 3. Password Validation
            const password = document.getElementById('password');
            const errPassword = document.getElementById('errPassword');
            if (!password.value || !passwordRegex.test(password.value)) {
                setError(password, errPassword, 'Password must be min 8 chars with 1 uppercase, 1 lowercase, 1 number & 1 special character.');
                isValid = false;
            } else {
                clearError(password, errPassword);
            }

            // 4. Confirm Password Validation
            const confirmPassword = document.getElementById('confirmPassword');
            const errConfirmPassword = document.getElementById('errConfirmPassword');
            if (!confirmPassword.value || confirmPassword.value !== password.value) {
                setError(confirmPassword, errConfirmPassword, 'Passwords do not match.');
                isValid = false;
            } else {
                clearError(confirmPassword, errConfirmPassword);
            }

            // 5. Role Validation
            const role = document.getElementById('role');
            const errRole = document.getElementById('errRole');
            if (!role.value) {
                setError(role, errRole, 'Please select your role.');
                isValid = false;
            } else {
                clearError(role, errRole);
            }

            // If Valid: Send API Request to POST /register
            if (isValid) {
                if (registerBtn) {
                    registerBtn.textContent = 'Registering...';
                    registerBtn.disabled = true;
                }

                const alertBox = document.getElementById('registerSuccessAlert');

                fetch('/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fullName: fullName.value.trim(),
                        email: email.value.trim(),
                        password: password.value,
                        confirmPassword: confirmPassword.value,
                        role: role.value
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        if (alertBox) {
                            alertBox.style.display = 'block';
                            alertBox.style.backgroundColor = '#d4edda';
                            alertBox.style.color = '#155724';
                            alertBox.style.padding = '12px';
                            alertBox.style.borderRadius = '6px';
                            alertBox.style.marginBottom = '15px';
                            alertBox.textContent = data.message || 'Registration Successful! Redirecting to Login...';
                        }
                        setTimeout(() => {
                            window.location.href = 'login.html';
                        }, 1200);
                    } else {
                        if (registerBtn) {
                            registerBtn.textContent = 'Register';
                            registerBtn.disabled = false;
                        }
                        if (alertBox) {
                            alertBox.style.display = 'block';
                            alertBox.style.backgroundColor = '#f8d7da';
                            alertBox.style.color = '#721c24';
                            alertBox.style.padding = '12px';
                            alertBox.style.borderRadius = '6px';
                            alertBox.style.marginBottom = '15px';
                            alertBox.textContent = data.message || 'Registration failed';
                        }
                    }
                })
                .catch(err => {
                    console.error('Registration Error:', err);
                    if (registerBtn) {
                        registerBtn.textContent = 'Register';
                        registerBtn.disabled = false;
                    }
                    if (alertBox) {
                        alertBox.style.display = 'block';
                        alertBox.style.backgroundColor = '#f8d7da';
                        alertBox.style.color = '#721c24';
                        alertBox.style.padding = '12px';
                        alertBox.style.borderRadius = '6px';
                        alertBox.style.marginBottom = '15px';
                        alertBox.textContent = 'Unable to connect to server. Please ensure the backend is running.';
                    }
                });
            }
        });
    }

    // ===================================================
    // PAGE 2: LOGIN FORM VALIDATION & API INTEGRATION (login.html)
    // ===================================================
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // 1. Email Validation
            const email = document.getElementById('email');
            const errEmail = document.getElementById('errEmail');
            if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
                setError(email, errEmail, 'Please enter a valid email address.');
                isValid = false;
            } else {
                clearError(email, errEmail);
            }

            // 2. Password Validation (Min 8 chars, 1 upper, 1 lower, 1 number, 1 special char)
            const password = document.getElementById('password');
            const errPassword = document.getElementById('errPassword');
            if (!password.value || !passwordRegex.test(password.value)) {
                setError(password, errPassword, 'Password must be min 8 chars with 1 uppercase, 1 lowercase, 1 number & 1 special character.');
                isValid = false;
            } else {
                clearError(password, errPassword);
            }

            // 3. Role Dropdown Validation
            const role = document.getElementById('role');
            const errRole = document.getElementById('errRole');
            if (!role.value) {
                setError(role, errRole, 'Please select your role.');
                isValid = false;
            } else {
                clearError(role, errRole);
            }

            // If valid: Call Express /login Backend API
            if (isValid) {
                if (loginBtn) {
                    loginBtn.textContent = 'Logging in...';
                    loginBtn.disabled = true;
                }

                const alertBox = document.getElementById('loginSuccessAlert');

                fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email.value.trim(),
                        password: password.value,
                        role: role.value
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        if (alertBox) {
                            alertBox.style.display = 'block';
                            alertBox.style.backgroundColor = '#d4edda';
                            alertBox.style.color = '#155724';
                            alertBox.style.padding = '12px';
                            alertBox.style.borderRadius = '6px';
                            alertBox.style.marginBottom = '15px';
                            alertBox.textContent = data.message || 'Login Successful! Redirecting...';
                        }
                        if (data.user) {
                            localStorage.setItem('user', JSON.stringify(data.user));
                        }
                        setTimeout(() => {
                            window.location.href = 'donation.html';
                        }, 1000);
                    } else {
                        if (loginBtn) {
                            loginBtn.textContent = 'Login';
                            loginBtn.disabled = false;
                        }
                        if (alertBox) {
                            alertBox.style.display = 'block';
                            alertBox.style.backgroundColor = '#f8d7da';
                            alertBox.style.color = '#721c24';
                            alertBox.style.padding = '12px';
                            alertBox.style.borderRadius = '6px';
                            alertBox.style.marginBottom = '15px';
                            alertBox.textContent = data.message || 'Invalid email or password';
                        }
                    }
                })
                .catch(err => {
                    console.error('Login Error:', err);
                    if (loginBtn) {
                        loginBtn.textContent = 'Login';
                        loginBtn.disabled = false;
                    }
                    if (alertBox) {
                        alertBox.style.display = 'block';
                        alertBox.style.backgroundColor = '#f8d7da';
                        alertBox.style.color = '#721c24';
                        alertBox.style.padding = '12px';
                        alertBox.style.borderRadius = '6px';
                        alertBox.style.marginBottom = '15px';
                        alertBox.textContent = 'Unable to connect to server. Please ensure the backend is running.';
                    }
                });
            }
        });
    }

    // ===================================================
    // PAGE 3: DONATION FORM VALIDATION & API INTEGRATION (donation.html)
    // ===================================================
    const donationForm = document.getElementById('donationForm');
    const submitBtn = document.getElementById('submitBtn');

    if (donationForm) {

        // Description Character Counter
        const descriptionInput = document.getElementById('description');
        const charCounter = document.getElementById('charCount');
        if (descriptionInput && charCounter) {
            descriptionInput.addEventListener('input', () => {
                const currentLength = descriptionInput.value.length;
                charCounter.textContent = `${currentLength} / 200`;
                if (currentLength > 200) {
                    descriptionInput.value = descriptionInput.value.substring(0, 200);
                    charCounter.textContent = '200 / 200';
                }
            });
        }

        // Food Image Validation & Live Preview
        const foodImageInput = document.getElementById('foodImage');
        const imagePreview = document.getElementById('imagePreview');
        const errFoodImage = document.getElementById('errFoodImage');

        if (foodImageInput) {
            foodImageInput.addEventListener('change', () => {
                const file = foodImageInput.files[0];
                if (file) {
                    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
                    const maxSize = 2 * 1024 * 1024; // 2MB

                    if (!validTypes.includes(file.type)) {
                        setError(foodImageInput, errFoodImage, 'Only JPG, JPEG, and PNG images are allowed.');
                        foodImageInput.value = '';
                        if (imagePreview) imagePreview.style.display = 'none';
                        return;
                    }

                    if (file.size > maxSize) {
                        setError(foodImageInput, errFoodImage, 'Image file size must be maximum 2MB.');
                        foodImageInput.value = '';
                        if (imagePreview) imagePreview.style.display = 'none';
                        return;
                    }

                    clearError(foodImageInput, errFoodImage);

                    // FileReader Preview
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        if (imagePreview) {
                            imagePreview.src = e.target.result;
                            imagePreview.style.display = 'block';
                        }
                    };
                    reader.readAsDataURL(file);
                } else {
                    if (imagePreview) imagePreview.style.display = 'none';
                }
            });
        }

        // Form Submission Handler
        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const today = new Date().toISOString().split('T')[0];

            // List of basic text/select required fields
            const requiredFields = [
                { id: 'restaurantName', errId: 'errRestaurantName', msg: 'Restaurant Name is required.' },
                { id: 'ownerName', errId: 'errOwnerName', msg: 'Owner Name is required.' },
                { id: 'foodName', errId: 'errFoodName', msg: 'Food Name is required.' },
                { id: 'category', errId: 'errCategory', msg: 'Please select a food category.' },
                { id: 'foodType', errId: 'errFoodType', msg: 'Please select a food type.' },
                { id: 'foodCondition', errId: 'errFoodCondition', msg: 'Please select food condition.' },
                { id: 'unit', errId: 'errUnit', msg: 'Please select a quantity unit.' },
                { id: 'pickupTime', errId: 'errPickupTime', msg: 'Pickup Time is required.' },
                { id: 'city', errId: 'errCity', msg: 'City is required.' },
                { id: 'address', errId: 'errAddress', msg: 'Pickup Address is required.' }
            ];

            // Validate standard required text/select fields
            requiredFields.forEach(field => {
                const el = document.getElementById(field.id);
                const errEl = document.getElementById(field.errId);
                if (!el.value.trim()) {
                    setError(el, errEl, field.msg);
                    isValid = false;
                } else {
                    clearError(el, errEl);
                }
            });

            // Food Quantity Validation (> 0)
            const quantity = document.getElementById('quantity');
            const errQuantity = document.getElementById('errQuantity');
            if (!quantity.value || parseFloat(quantity.value) <= 0) {
                setError(quantity, errQuantity, 'Quantity must be greater than zero.');
                isValid = false;
            } else {
                clearError(quantity, errQuantity);
            }

            // People Served Validation (> 0)
            const peopleServed = document.getElementById('peopleServed');
            const errPeopleServed = document.getElementById('errPeopleServed');
            if (!peopleServed.value || parseInt(peopleServed.value) <= 0) {
                setError(peopleServed, errPeopleServed, 'People served must be greater than zero.');
                isValid = false;
            } else {
                clearError(peopleServed, errPeopleServed);
            }

            // Cooking Date Validation (Cannot be after today)
            const cookingDate = document.getElementById('cookingDate');
            const errCookingDate = document.getElementById('errCookingDate');
            if (!cookingDate.value) {
                setError(cookingDate, errCookingDate, 'Cooking date is required.');
                isValid = false;
            } else if (cookingDate.value > today) {
                setError(cookingDate, errCookingDate, 'Cooking date cannot be after today.');
                isValid = false;
            } else {
                clearError(cookingDate, errCookingDate);
            }

            // Pickup Date Validation (Cannot be before today)
            const pickupDate = document.getElementById('pickupDate');
            const errPickupDate = document.getElementById('errPickupDate');
            if (!pickupDate.value) {
                setError(pickupDate, errPickupDate, 'Pickup date is required.');
                isValid = false;
            } else if (pickupDate.value < today) {
                setError(pickupDate, errPickupDate, 'Pickup date cannot be before today.');
                isValid = false;
            } else {
                clearError(pickupDate, errPickupDate);
            }

            // Expiry Date Validation (Must be after cooking date)
            const expiryDate = document.getElementById('expiryDate');
            const errExpiryDate = document.getElementById('errExpiryDate');
            if (!expiryDate.value) {
                setError(expiryDate, errExpiryDate, 'Expiry date is required.');
                isValid = false;
            } else if (cookingDate.value && expiryDate.value <= cookingDate.value) {
                setError(expiryDate, errExpiryDate, 'Expiry date must be after cooking date.');
                isValid = false;
            } else {
                clearError(expiryDate, errExpiryDate);
            }

            // Contact Number Validation (Exactly 10 digits)
            const phone = document.getElementById('phone');
            const errPhone = document.getElementById('errPhone');
            if (!phone.value || !phoneRegex.test(phone.value.trim())) {
                setError(phone, errPhone, 'Contact number must be exactly 10 digits.');
                isValid = false;
            } else {
                clearError(phone, errPhone);
            }

            // Pin Code Validation (Exactly 6 digits)
            const pincode = document.getElementById('pincode');
            const errPincode = document.getElementById('errPincode');
            if (!pincode.value || !pinRegex.test(pincode.value.trim())) {
                setError(pincode, errPincode, 'Pin code must be exactly 6 digits.');
                isValid = false;
            } else {
                clearError(pincode, errPincode);
            }

            // Description Validation (Max 200 chars)
            const description = document.getElementById('description');
            const errDescription = document.getElementById('errDescription');
            if (!description.value.trim()) {
                setError(description, errDescription, 'Description is required.');
                isValid = false;
            } else if (description.value.length > 200) {
                setError(description, errDescription, 'Description cannot exceed 200 characters.');
                isValid = false;
            } else {
                clearError(description, errDescription);
            }

            // Food Image Upload Check
            if (!foodImageInput.files || foodImageInput.files.length === 0) {
                setError(foodImageInput, errFoodImage, 'Food image upload is required.');
                isValid = false;
            }

            // Terms and Conditions Checkbox
            const terms = document.getElementById('terms');
            const errTerms = document.getElementById('errTerms');
            if (!terms.checked) {
                setError(terms, errTerms, 'You must declare terms and conditions.');
                isValid = false;
            } else {
                clearError(terms, errTerms);
            }

            // Confirmation Dialog & Asynchronous Submission to Express Backend
            if (isValid) {
                const isConfirmed = confirm('Are you sure you want to submit this donation?');
                if (isConfirmed) {
                    if (submitBtn) {
                        submitBtn.textContent = 'Submitting...';
                        submitBtn.disabled = true;
                    }

                    const alertBox = document.getElementById('donationSuccessAlert');

                    // Construct FormData for multipart image & text submission
                    const formData = new FormData(donationForm);

                    // Add logged in user ID if available in localStorage
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        try {
                            const parsedUser = JSON.parse(storedUser);
                            if (parsedUser && parsedUser.id) {
                                formData.append('user_id', parsedUser.id);
                            }
                        } catch (err) {
                            console.error('Error parsing stored user:', err);
                        }
                    }

                    fetch('/donations', {
                        method: 'POST',
                        body: formData
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            if (alertBox) {
                                alertBox.style.display = 'block';
                                alertBox.style.backgroundColor = '#d4edda';
                                alertBox.style.color = '#155724';
                                alertBox.style.padding = '12px';
                                alertBox.style.borderRadius = '6px';
                                alertBox.style.marginBottom = '15px';
                                alertBox.textContent = data.message || 'Donation Saved';
                            }
                            setTimeout(() => {
                                window.location.href = 'thankyou.html';
                            }, 1000);
                        } else {
                            if (submitBtn) {
                                submitBtn.textContent = 'Submit Donation';
                                submitBtn.disabled = false;
                            }
                            if (alertBox) {
                                alertBox.style.display = 'block';
                                alertBox.style.backgroundColor = '#f8d7da';
                                alertBox.style.color = '#721c24';
                                alertBox.style.padding = '12px';
                                alertBox.style.borderRadius = '6px';
                                alertBox.style.marginBottom = '15px';
                                alertBox.textContent = data.message || 'Database Error';
                            }
                        }
                    })
                    .catch(err => {
                        console.error('Submission Error:', err);
                        if (submitBtn) {
                            submitBtn.textContent = 'Submit Donation';
                            submitBtn.disabled = false;
                        }
                        if (alertBox) {
                            alertBox.style.display = 'block';
                            alertBox.style.backgroundColor = '#f8d7da';
                            alertBox.style.color = '#721c24';
                            alertBox.style.padding = '12px';
                            alertBox.style.borderRadius = '6px';
                            alertBox.style.marginBottom = '15px';
                            alertBox.textContent = 'Unable to submit. Please ensure backend server is running.';
                        }
                    });
                }
            }
        });
    }

    // ===================================================
    // GLOBAL NAVBAR AUTH STATE MANAGER
    // ===================================================
    function setupNavAuth() {
        const storedUser = localStorage.getItem('user');
        const donateItems = document.querySelectorAll('.nav-donate-item, a[href="donation.html"]');
        const authButtons = document.querySelectorAll('.btn-nav-login, .btn-nav-logout, .auth-nav-btn');

        if (storedUser) {
            // User IS logged in: Show 'Donate Food' and 'Logout'
            donateItems.forEach(el => {
                const li = el.tagName === 'LI' ? el : el.closest('li');
                if (li) li.style.display = 'inline-block';
            });
            authButtons.forEach(btn => {
                btn.textContent = 'Logout';
                btn.className = 'btn-nav-logout auth-nav-btn';
                btn.href = '#';
                btn.onclick = (e) => {
                    e.preventDefault();
                    localStorage.removeItem('user');
                    window.location.href = 'login.html';
                };
            });
        } else {
            // User is NOT logged in: Hide 'Donate Food', Show 'Login'
            donateItems.forEach(el => {
                const li = el.tagName === 'LI' ? el : el.closest('li');
                if (li) li.style.display = 'none';
            });
            authButtons.forEach(btn => {
                btn.textContent = 'Login';
                btn.className = 'btn-nav-login auth-nav-btn';
                btn.href = 'login.html';
                btn.onclick = null;
            });
        }
    }

    setupNavAuth();

});

