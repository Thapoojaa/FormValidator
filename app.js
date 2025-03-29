document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('success-message');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordStrength = document.querySelector('.password-strength');
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', () => {
            const input = button.parentElement.querySelector('input');
            const eyeIcon = button.querySelector('.eye-icon');
            const eyeOffIcon = button.querySelector('.eye-off-icon');

            if (input.type === 'password') {
                input.type = 'text';
                eyeIcon.classList.add('hidden');
                eyeOffIcon.classList.remove('hidden');
            } else {
                input.type = 'password';
                eyeIcon.classList.remove('hidden');
                eyeOffIcon.classList.add('hidden');
            }
        });
    });

    // Validation functions
    const validators = {
        username: (value) => {
            if (!value) return 'Username is required';
            if (!/^[a-zA-Z0-9]{3,15}$/.test(value)) {
                return 'Username must be 3-15 characters and contain only letters and numbers';
            }
            return '';
        },
        email: (value) => {
            if (!value) return 'Email is required';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return 'Please enter a valid email address';
            }
            return '';
        },
        password: (value) => {
            if (!value) return 'Password is required';
            if (value.length < 8) return 'Password must be at least 8 characters';
            if (!/[A-Z]/.test(value)) return 'Password must contain an uppercase letter';
            if (!/[0-9]/.test(value)) return 'Password must contain a number';
            if (!/[!@#$%^&*]/.test(value)) return 'Password must contain a special character';
            return '';
        },
        confirmPassword: (value) => {
            if (!value) return 'Please confirm your password';
            if (value !== passwordInput.value) return 'Passwords do not match';
            return '';
        }
    };

    // Calculate password strength
    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*]/.test(password)) strength++;
        return strength;
    };

    // Update password strength indicator
    const updatePasswordStrength = (password) => {
        if (!password) {
            passwordStrength.classList.add('hidden');
            return;
        }

        passwordStrength.classList.remove('hidden');
        const strength = calculatePasswordStrength(password);
        strengthFill.className = 'strength-fill';

        if (strength <= 1) {
            strengthFill.classList.add('weak');
            strengthText.textContent = 'Weak';
        } else if (strength <= 2) {
            strengthFill.classList.add('medium');
            strengthText.textContent = 'Medium';
        } else {
            strengthFill.classList.add('strong');
            strengthText.textContent = 'Strong';
        }
    };

    // Handle input validation
    const handleInput = (input) => {
        const field = input.name;
        const value = input.value;
        const errorMessage = validators[field](value);
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector(`[data-error="${field}"]`);

        if (errorMessage) {
            formGroup.classList.add('error');
            errorElement.textContent = errorMessage;
        } else {
            formGroup.classList.remove('error');
            errorElement.textContent = '';
        }

        if (field === 'password') {
            updatePasswordStrength(value);
        }
    };

    // Add input event listeners
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => handleInput(input));
        input.addEventListener('blur', () => handleInput(input));
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let hasErrors = false;
        let firstError = null;

        // Validate all fields
        form.querySelectorAll('input').forEach(input => {
            const error = validators[input.name](input.value);
            if (error) {
                hasErrors = true;
                if (!firstError) firstError = input;
            }
            handleInput(input);
        });

        if (hasErrors) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Save to localStorage
        localStorage.setItem('userData', JSON.stringify({
            username: form.elements['username'].value,
            email: form.elements['email'].value
        }));

        // Show success message
        successMessage.classList.remove('hidden');
        successMessage.classList.add('fade-in');

        // Reset form after delay
        setTimeout(() => {
            form.reset();
            successMessage.classList.add('hidden');
            passwordStrength.classList.add('hidden');
        }, 3000);
    });
});