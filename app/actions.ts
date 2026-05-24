'use server'

export type BookingState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Record<string, string>
  values?: Record<string, string>
}

const EVENT_TYPES = [
  'Wedding',
  'Corporate event',
  'Private party',
  'Birthday celebration',
  'Anniversary',
  'Bar / restaurant / venue',
  'Festival / public event',
  'Other',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function field(formData: FormData, name: string) {
  return (formData.get(name) ?? '').toString().trim()
}

export async function submitBooking(
  _prevState: BookingState,
  formData: FormData
): Promise<BookingState> {
  const values = {
    name: field(formData, 'name'),
    email: field(formData, 'email'),
    phone: field(formData, 'phone'),
    eventType: field(formData, 'eventType'),
    eventDate: field(formData, 'eventDate'),
    eventTime: field(formData, 'eventTime'),
    duration: field(formData, 'duration'),
    location: field(formData, 'location'),
    guests: field(formData, 'guests'),
    budget: field(formData, 'budget'),
    referral: field(formData, 'referral'),
    details: field(formData, 'details'),
  }

  const errors: Record<string, string> = {}

  if (!values.name) errors.name = 'Please tell us your name.'
  if (!values.email) {
    errors.email = 'An email is required so we can reply.'
  } else if (!EMAIL_RE.test(values.email)) {
    errors.email = 'That email address doesn’t look right.'
  }
  if (!values.eventType || !EVENT_TYPES.includes(values.eventType)) {
    errors.eventType = 'Pick the type of event.'
  }
  if (!values.eventDate) {
    errors.eventDate = 'Let us know the date you have in mind.'
  } else {
    const date = new Date(values.eventDate + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (Number.isNaN(date.getTime())) {
      errors.eventDate = 'That date doesn’t look valid.'
    } else if (date < today) {
      errors.eventDate = 'Please choose a date in the future.'
    }
  }
  if (!values.location) {
    errors.location = 'Where is the event? A city or venue is fine.'
  }

  if (Object.keys(errors).length > 0) {
    return {
      status: 'error',
      message: 'Please fix the highlighted fields and try again.',
      errors,
      values,
    }
  }

  // Booking request is valid. Wire up email/DB delivery here.
  console.log('New booking request:', values)

  return {
    status: 'success',
    message: `Thanks, ${values.name}! Your request for ${values.eventDate} is in. I’ll get back to you within 48 hours.`,
  }
}
