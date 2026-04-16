import Google from "@auth/core/providers/google";
import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";
import { convexAuth } from "@convex-dev/auth/server";
import { createAccount, retrieveAccount } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { Scrypt } from "lucia";

const scrypt = new Scrypt();
const phonePasswordProvider = "phone-password";

const allowedRedirectOrigins = new Set(
  [
    process.env.SITE_URL,
    "http://localhost:3000",
    "https://localhost:3000",
    "http://localhost:5173",
    "https://localhost:5173",
    "https://academic-dodo-992.convex.site",
  ].filter((value): value is string => Boolean(value)),
);

function isAllowedWebRedirect(redirectTo: string) {
  if (redirectTo.startsWith("/") || redirectTo.startsWith("?")) {
    return true;
  }

  try {
    const url = new URL(redirectTo);
    return allowedRedirectOrigins.has(url.origin);
  } catch {
    return false;
  }
}

function normalizeEmail(value: unknown) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Enter a valid email address");
  }

  return value.trim().toLowerCase();
}

function normalizePhone(value: unknown) {
  if (typeof value !== "string") {
    throw new Error("Enter a valid mobile number");
  }

  const trimmed = value.trim();
  const hasPlusPrefix = trimmed.startsWith("+");
  const digitsOnly = trimmed.replace(/\D/g, "");

  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    throw new Error("Enter a valid mobile number");
  }

  return `${hasPlusPrefix ? "+" : ""}${digitsOnly}`;
}

function normalizeName(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

const PhonePassword = ConvexCredentials({
  id: phonePasswordProvider,
  authorize: async (credentials, ctx) => {
    const flow = credentials.flow as string | undefined;
    const phone = normalizePhone(credentials.phone);
    const accountId = `phone:${phone}`;
    const secret = credentials.password as string | undefined;

    if (flow === "signUp") {
      const name = normalizeName(credentials.name);

      if (!name) {
        throw new Error("Please enter your full name");
      }

      if (!secret || secret.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      const { user } = await createAccount(ctx, {
        provider: phonePasswordProvider,
        account: { id: accountId, secret },
        profile: {
          name,
          phone,
          role: "patient",
        },
        shouldLinkViaEmail: false,
        shouldLinkViaPhone: false,
      });

      return { userId: user._id };
    }

    if (flow === "signIn") {
      if (!secret) {
        throw new Error("Missing `password` param for `signIn` flow");
      }

      const retrieved = await retrieveAccount(ctx, {
        provider: phonePasswordProvider,
        account: { id: accountId, secret },
      });

      if (retrieved === null) {
        throw new Error("Invalid credentials");
      }

      return { userId: retrieved.user._id };
    }

    throw new Error('Missing `flow` param, it must be one of "signUp" or "signIn"!');
  },
  crypto: {
    async hashSecret(secret: string) {
      return await scrypt.hash(secret);
    },
    async verifySecret(secret: string, hash: string) {
      return await scrypt.verify(hash, secret);
    },
  },
});

/**
 * Convex Auth configuration.
 *
 * Uses Google OAuth plus email/password and phone/password sign-in.
 */
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Google({
      profile(googleProfile) {
        return {
          id: googleProfile.sub,
          name: googleProfile.name,
          email: googleProfile.email,
          image: googleProfile.picture,
          googleId: googleProfile.sub,
          givenName: googleProfile.given_name,
          familyName: googleProfile.family_name,
        };
      },
    }),
    Password({
      profile(params) {
        const name = normalizeName(params.name);

        return {
          email: normalizeEmail(params.email),
          name: name || undefined,
          role: "patient",
        };
      },
    }),
    PhonePassword,
  ],
  callbacks: {
    async redirect({ redirectTo }) {
      if (isAllowedWebRedirect(redirectTo)) {
        return redirectTo;
      }

      // Allow mobile app redirects (exp:// for Expo development)
      // You may need to add your specific mobile app URIs here
      if (redirectTo.startsWith('exp://') || 
          redirectTo.startsWith('myapp://')) {
        return redirectTo;
      }

      throw new Error(`Invalid redirectTo URI ${redirectTo}`);
    },
  },
});
