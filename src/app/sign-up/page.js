'use client'

import Image from 'next/image'
import Link from 'next/link'
import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">
            <Image src="/logo.png" alt="GoTravel logo" fill sizes="52px" />
          </div>
          <div>
            <p className="auth-overline">GoTravel</p>
            <p className="auth-copy">Book with confidence for every destination.</p>
          </div>
        </div>

        <div className="auth-intro">
          <p className="auth-eyebrow">Create your account</p>
          <h1 className="auth-heading">Start planning your next journey</h1>
          <p className="auth-text">
            Join GoTravel and unlock fast booking, secure payments, and a travel dashboard tailored to your adventures.
          </p>
        </div>

        <div className="auth-form">
          <SignUp
            routing="hash"
            signInUrl="/sign-in"
            afterSignUpUrl="/dashboard"
          />
        </div>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link href="/sign-in">Sign in</Link>
        </p>
      </div>
    </main>
  )
}
