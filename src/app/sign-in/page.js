'use client'

import Image from 'next/image'
import Link from 'next/link'
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">
            <Image src="/logo.png" alt="GoTravel logo" fill sizes="52px" />
          </div>
          <div>
            <p className="auth-overline">GoTravel</p>
            <p className="auth-copy">Secure travel booking made simple.</p>
          </div>
        </div>

        <div className="auth-intro">
          <p className="auth-eyebrow">Welcome back</p>
          <h1 className="auth-heading">Sign in to manage your trips</h1>
          <p className="auth-text">
            Access your dashboard, bookings, and payment details with a smooth, trusted sign-in experience.
          </p>
        </div>

        <div className="auth-form">
          <SignIn
            routing="hash"
            signUpUrl="/sign-up"
            forceRedirectUrl="/dashboard"
          />
        </div>

        <p className="auth-footer">
          New to GoTravel?{' '}
          <Link href="/sign-up">Create your account</Link>
        </p>
      </div>
    </main>
  )
}
