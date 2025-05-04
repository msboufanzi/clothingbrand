import { getBrowserClient } from "./supabase-browser"

export async function signIn(email: string, password: string) {
  const supabase = getBrowserClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Error signing in:", error)
      return { user: null, error: error.message }
    }

    return { user: data.user, error: null }
  } catch (err: any) {
    console.error("Exception during sign in:", err)
    return { user: null, error: err.message || "An unexpected error occurred" }
  }
}

export async function signOut() {
  const supabase = getBrowserClient()

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Error signing out:", error)
      return { error: error.message }
    }

    return { error: null }
  } catch (err: any) {
    console.error("Exception during sign out:", err)
    return { error: err.message || "An unexpected error occurred during sign out" }
  }
}

export async function resetPassword(email: string) {
  const supabase = getBrowserClient()

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    })

    if (error) {
      console.error("Error resetting password:", error)
      return { error: error.message }
    }

    return { error: null }
  } catch (err: any) {
    console.error("Exception during password reset:", err)
    return { error: err.message || "An unexpected error occurred" }
  }
}

export async function updatePassword(password: string) {
  const supabase = getBrowserClient()

  try {
    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      console.error("Error updating password:", error)
      return { error: error.message }
    }

    return { error: null }
  } catch (err: any) {
    console.error("Exception during password update:", err)
    return { error: err.message || "An unexpected error occurred" }
  }
}

export async function getSession() {
  const supabase = getBrowserClient()

  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Error getting session:", error)
      return { session: null, error: error.message }
    }

    return { session: data.session, error: null }
  } catch (err: any) {
    console.error("Exception getting session:", err)
    return { session: null, error: err.message || "An unexpected error occurred" }
  }
}

export async function getUser() {
  const supabase = getBrowserClient()

  try {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.error("Error getting user:", error)
      return { user: null, error: error.message }
    }

    return { user: data.user, error: null }
  } catch (err: any) {
    console.error("Exception getting user:", err)
    return { user: null, error: err.message || "An unexpected error occurred" }
  }
}
