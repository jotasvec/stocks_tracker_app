'use client';
import CountrySelectField from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import { Button } from "@/components/ui/button";
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from "@/lib/constants";
import { useForm } from "react-hook-form";


const SignUp = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {

      fullName: '',
      email: '',
      password: '',
      country: 'US',
      investmentGoals: 'Growth',
      riskTolerance: 'Medium',
      preferredIndustry: 'Technology',
    },
    mode: 'onBlur'
  })
  const onSubmit = async (data: SignUpFormData) => {
    try {
      console.log('data', data)
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <>
      <h1 className="form-title">Sign Up & Personalize</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" >
        {/* Inputs */}
        {/* Full Name */}
        <InputField 
          name="fullName"
          label="Full Name"
          placeholder="John Doe"
          register={register}
          error={errors.fullName}
          validation={{ required: 'Full name is required ', minLength: 2}}
        />
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

        {/* Select Fields */}
        {/* country */}
        <CountrySelectField
          name="country"
          label="Country"
          control={control}
          error={errors.country}
          required
        />
        {/* Investment Goals */}
        <SelectField 
          name="investmentsGoals"
          label="Investment Goals"
          placeholder="Select your investment goal"
          options={INVESTMENT_GOALS}
          control={control}
          error={errors.investmentGoals}
          required
        />
        {/* Risk Tolerance */}
        <SelectField 
          name="riskTolerance"
          label="Risk Tolerance"
          placeholder="Select your Risk Tolerance"
          options={RISK_TOLERANCE_OPTIONS}
          control={control}
          error={errors.riskTolerance}
          required
        />

        {/* Preferred Industry */}
        <SelectField 
          name="preferredIndustry"
          label="Preferred Industry"
          placeholder="Select your Preferred Industry"
          options={PREFERRED_INDUSTRIES}
          control={control}
          error={errors.preferredIndustry}
          required
        />

        <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5" >
          {isSubmitting ? 'create Account':'Start Your Investment Journey'}
        </Button>
        <FooterLink text="Already have an account" linkText="Sign in" href="/sign-in" />
      </form>

    </>
  )
}

export default SignUp