/**
 * Cryptographically Secure Password Generator
 * Generates random strings using window.crypto.getRandomValues.
 * Supports customizable character sets and ambiguous character exclusion.
 */

export interface PasswordGeneratorOptions {
  length?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
  excludeAmbiguous?: boolean;
  count?: number;
}

export interface PasswordResult {
  passwords: string[];
  strength: "very-weak" | "weak" | "medium" | "strong" | "very-strong";
  entropyBits: number;
}

const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const NUMBER_CHARS = "0123456789";
const SYMBOL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?~";
const AMBIGUOUS_SET = new Set(["i", "l", "1", "L", "o", "0", "O", "I"]);

/**
 * Generates one or more cryptographically secure passwords.
 */
export function generatePasswords(
  options: PasswordGeneratorOptions = {}
): PasswordResult {
  const {
    length = 16,
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = true,
    excludeAmbiguous = false,
    count = 1,
  } = options;

  const validLength = Math.max(4, Math.min(128, length));
  const validCount = Math.max(1, Math.min(50, count));

  let pool = "";
  const guaranteedPools: string[] = [];

  const filterAmbiguous = (chars: string) => {
    if (!excludeAmbiguous) return chars;
    return chars
      .split("")
      .filter((c) => !AMBIGUOUS_SET.has(c))
      .join("");
  };

  if (uppercase) {
    const chars = filterAmbiguous(UPPERCASE_CHARS);
    if (chars) {
      pool += chars;
      guaranteedPools.push(chars);
    }
  }

  if (lowercase) {
    const chars = filterAmbiguous(LOWERCASE_CHARS);
    if (chars) {
      pool += chars;
      guaranteedPools.push(chars);
    }
  }

  if (numbers) {
    const chars = filterAmbiguous(NUMBER_CHARS);
    if (chars) {
      pool += chars;
      guaranteedPools.push(chars);
    }
  }

  if (symbols) {
    const chars = filterAmbiguous(SYMBOL_CHARS);
    if (chars) {
      pool += chars;
      guaranteedPools.push(chars);
    }
  }

  // Fallback if no sets selected
  if (!pool) {
    pool = filterAmbiguous(LOWERCASE_CHARS + NUMBER_CHARS);
    guaranteedPools.push(pool);
  }

  const poolLength = pool.length;
  const passwords: string[] = [];

  for (let i = 0; i < validCount; i++) {
    const charArray: string[] = [];

    // Ensure at least one character from each active category
    for (const subPool of guaranteedPools) {
      const randIndex = getRandomInt(subPool.length);
      charArray.push(subPool[randIndex]);
    }

    // Fill remaining length from combined pool
    while (charArray.length < validLength) {
      const randIndex = getRandomInt(poolLength);
      charArray.push(pool[randIndex]);
    }

    // Cryptographically shuffle the array
    shuffleArray(charArray);
    passwords.push(charArray.join(""));
  }

  // Calculate entropy: E = L * log2(poolSize)
  const entropyBits = Math.round(validLength * (Math.log(poolLength) / Math.log(2)));

  let strength: PasswordResult["strength"] = "weak";
  if (entropyBits < 36) strength = "very-weak";
  else if (entropyBits < 60) strength = "weak";
  else if (entropyBits < 80) strength = "medium";
  else if (entropyBits < 100) strength = "strong";
  else strength = "very-strong";

  return {
    passwords,
    strength,
    entropyBits,
  };
}

/**
 * Returns a cryptographically secure random integer in [0, max - 1].
 */
function getRandomInt(max: number): number {
  const cryptoObj = globalThis.crypto;
  if (!cryptoObj?.getRandomValues) {
    // Math.random fallback only if crypto is somehow unavailable
    return Math.floor(Math.random() * max);
  }

  const randomBuffer = new Uint32Array(1);
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % max);

  let rand: number;
  do {
    cryptoObj.getRandomValues(randomBuffer);
    rand = randomBuffer[0];
  } while (rand >= limit);

  return rand % max;
}

/**
 * Fisher-Yates shuffle using crypto random values.
 */
function shuffleArray<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = getRandomInt(i + 1);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}
