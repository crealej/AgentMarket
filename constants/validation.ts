// Validation rules and constraints

export const VALIDATION = {
  // Listing validation
  listing: {
    title: {
      minLength: 5,
      maxLength: 100,
    },
    description: {
      maxLength: 500,
    },
    price: {
      min: 0,
      max: 10000000, // 10M DKK
    },
  },

  // Agent validation
  agent: {
    name: {
      minLength: 2,
      maxLength: 30,
    },
    id: {
      minLength: 3,
      maxLength: 50,
      pattern: /^[a-z0-9-]+$/,
    },
  },

  // User validation
  user: {
    username: {
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_]+$/,
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },

  // Message validation
  message: {
    content: {
      maxLength: 5000,
    },
  },

  // Distance filter
  distance: {
    min: 1,
    max: 1000,
    default: 15,
  },
}

// Error messages (bilingual)
export const ERROR_MESSAGES = {
  en: {
    titleTooShort: 'Title must be at least 5 characters',
    titleTooLong: 'Title must be less than 100 characters',
    descriptionTooLong: 'Description must be less than 500 characters',
    priceInvalid: 'Price must be a positive number',
    priceTooHigh: 'Price exceeds maximum allowed',
    agentNameTooShort: 'Agent name must be at least 2 characters',
    agentNameTooLong: 'Agent name must be less than 30 characters',
    agentIdInvalid: 'Agent ID can only contain lowercase letters, numbers, and hyphens',
    agentIdDuplicate: 'This agent ID is already linked',
    usernameInvalid: 'Username can only contain letters, numbers, and underscores',
    emailInvalid: 'Please enter a valid email address',
    messageTooLong: 'Message must be less than 5000 characters',
    required: 'This field is required',
    networkError: 'Network error. Please try again.',
    unknownError: 'An unknown error occurred',
  },
  da: {
    titleTooShort: 'Titlen skal være mindst 5 tegn',
    titleTooLong: 'Titlen skal være under 100 tegn',
    descriptionTooLong: 'Beskrivelsen skal være under 500 tegn',
    priceInvalid: 'Prisen skal være et positivt tal',
    priceTooHigh: 'Prisen overstiger maksimum',
    agentNameTooShort: 'Agent-navnet skal være mindst 2 tegn',
    agentNameTooLong: 'Agent-navnet skal være under 30 tegn',
    agentIdInvalid: 'Agent-ID må kun indeholde små bogstaver, tal og bindestreger',
    agentIdDuplicate: 'Denne agent-ID er allerede linket',
    usernameInvalid: 'Brugernavnet må kun indeholde bogstaver, tal og understreger',
    emailInvalid: 'Indtast en gyldig e-mailadresse',
    messageTooLong: 'Beskeden skal være under 5000 tegn',
    required: 'Dette felt er påkrævet',
    networkError: 'Netværksfejl. Prøv igen.',
    unknownError: 'Der opstod en ukendt fejl',
  },
}

// Success messages
export const SUCCESS_MESSAGES = {
  en: {
    listingCreated: 'Listing created successfully',
    agentLinked: 'Agent linked successfully',
    messageSent: 'Message sent',
    settingsSaved: 'Settings saved',
    negotiationStarted: 'Negotiation started',
  },
  da: {
    listingCreated: 'Annoncen er oprettet',
    agentLinked: 'Agenten er linket',
    messageSent: 'Besked sendt',
    settingsSaved: 'Indstillinger gemt',
    negotiationStarted: 'Forhandling startet',
  },
}

// Validation helper functions
export function validateListingTitle(title: string, lang: 'en' | 'da' = 'en'): string | null {
  if (!title || title.trim().length === 0) {
    return ERROR_MESSAGES[lang].required
  }
  if (title.length < VALIDATION.listing.title.minLength) {
    return ERROR_MESSAGES[lang].titleTooShort
  }
  if (title.length > VALIDATION.listing.title.maxLength) {
    return ERROR_MESSAGES[lang].titleTooLong
  }
  return null
}

export function validateListingPrice(price: string | number, lang: 'en' | 'da' = 'en'): string | null {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(numPrice)) {
    return ERROR_MESSAGES[lang].priceInvalid
  }
  if (numPrice < VALIDATION.listing.price.min) {
    return ERROR_MESSAGES[lang].priceInvalid
  }
  if (numPrice > VALIDATION.listing.price.max) {
    return ERROR_MESSAGES[lang].priceTooHigh
  }
  return null
}

export function validateAgentName(name: string, lang: 'en' | 'da' = 'en'): string | null {
  if (!name || name.trim().length === 0) {
    return ERROR_MESSAGES[lang].required
  }
  if (name.length < VALIDATION.agent.name.minLength) {
    return ERROR_MESSAGES[lang].agentNameTooShort
  }
  if (name.length > VALIDATION.agent.name.maxLength) {
    return ERROR_MESSAGES[lang].agentNameTooLong
  }
  return null
}

export function validateAgentId(id: string, lang: 'en' | 'da' = 'en'): string | null {
  if (!id || id.trim().length === 0) {
    return ERROR_MESSAGES[lang].required
  }
  if (!VALIDATION.agent.id.pattern.test(id)) {
    return ERROR_MESSAGES[lang].agentIdInvalid
  }
  return null
}

export function validateEmail(email: string, lang: 'en' | 'da' = 'en'): string | null {
  if (!email || email.trim().length === 0) {
    return ERROR_MESSAGES[lang].required
  }
  if (!VALIDATION.user.email.pattern.test(email)) {
    return ERROR_MESSAGES[lang].emailInvalid
  }
  return null
}
