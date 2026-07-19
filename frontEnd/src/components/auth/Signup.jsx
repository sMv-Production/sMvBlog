import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import authService from '../../services/auth'
import { Button, Input, Logo } from '../index'

function Signup() {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [error, setError] = useState("")
    const [isCooldown, setIsCooldown] = useState(false) // New state for cooldown

    const createAccount = async (data) => {
        setError("")
        setIsCooldown(true) // Disable the button immediately on click

        // Start a 60-second timer to re-enable the button
        setTimeout(() => {
            setIsCooldown(false)
        }, 60000)

        try {
            const response = await authService.createAccount(data)
            if (response?.success) {
                navigate("/verify-email")
            } else {
                setError("Account creation failed.")
            }
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "An error occurred during signup")
        }
    }

    return (
        <div className="flex items-center justify-center w-full">
            <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
                <div className="mb-2 flex justify-center">
                    <Logo width="100px" />
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>

                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(createAccount)} className="mt-8">
                    <div className='space-y-5'>
                        <div>
                            <Input
                                label="Full Name: "
                                placeholder="Enter your full name"
                                {...register("name", {
                                    required: "Name is required",
                                    pattern: {
                                        value: /^[A-Za-z\s]+$/,
                                        message: "Name must only contain letters and spaces"
                                    }
                                })}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <Input
                                label="Email: "
                                placeholder="Enter your email"
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    validate: {
                                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                            "Email address must be a valid address",
                                    }
                                })}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <Input
                                label="Password: "
                                type="password"
                                placeholder="Enter your password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters long"
                                    },
                                    validate: {
                                        hasUppercase: (value) => /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
                                        hasLowercase: (value) => /[a-z]/.test(value) || "Password must contain at least one lowercase letter",
                                        hasNumber: (value) => /[0-9]/.test(value) || "Password must contain at least one numeric digit",
                                    }
                                })}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        {/* Pass the disabled prop to your custom Button component */}
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isCooldown}
                        >
                            {isCooldown ? "Please wait..." : "Create Account"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup
