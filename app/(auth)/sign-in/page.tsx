'use client';
import FooterLink from '@/components/forms/FooterLink';
import InputField from '@/components/forms/InputField';
import { Button } from '@/components/ui/button';
import { signInWithEmail } from '@/lib/actions/auth.actions';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";


const SignIn = () => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
      } = useForm<SignInFormData>({
        defaultValues: {
          email: '',
          password: '',
        },
        mode: 'onBlur'
      })
      const onSubmit = async (data: SignInFormData) => {
        try {
          const res = await signInWithEmail(data)
          if(res.success) router.push('/')
        } catch (error) {
          console.log('Sign in failed', error)
        }
      }
  return (
    <>
      <h1 className="form-title">Log In Your Account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" >
        {/* Inputs */}
        {/* Email */}
        <InputField 
          name="email"
          label="email"
          type="email"
          placeholder="hi@johndoe.com"
          register={register}
          error={errors.email}
          validation={{ required: 'Email is required ', pattern: '/^\w+@\w+\.\w+$/', message: 'Email address is required'}}
        />
        {/* Password */}
        <InputField 
          name="password"
          label="password"
          type="password"
          placeholder="********"
          register={register}
          error={errors.password}
          validation={{ required: 'Password is required ', minLength: 8  }}
        />

        
        <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5" >
          {isSubmitting ? 'Signing In':'Sign In'}
        </Button>
        <FooterLink text="Don't have an account" linkText="Create an Account - Sign Up" href="/sign-up" />
      </form>

    </>
  )
}

export default SignIn