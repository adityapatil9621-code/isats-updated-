// Single source of truth for ISATS contact details.
// Change values here and every page (Contact, WhatsApp button, map) updates.

export const CONTACT = {
  address:
    'Makhija Royale Building, 404, Swami Vivekanand Rd, above Noble Chemist, Govind Dham, Ram Krishna Nagar, Khar West, Mumbai, Maharashtra 400052',
  phoneDisplay: '+91 98674 20241',
  // Digits only, with country code (used by wa.me)
  whatsappNumber: '919867420241',
  whatsappMessage: 'Hello ISATS, I would like to know more about your courses.',
  email: 'isats.sales1@gmail.com',
  hours: 'Monday - Saturday: 9:00 AM - 6:00 PM',
};

export const whatsappLink = (message = CONTACT.whatsappMessage) =>
  `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;

// Opens Gmail's compose window with the To address and subject pre-filled
export const gmailComposeLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  CONTACT.email
)}&su=${encodeURIComponent('Course enquiry - ISATS')}`;

// Opens the location in the Google Maps app / website
export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  'ISATS ' + CONTACT.address
)}`;

export const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  CONTACT.address
)}`;

// WhatsApp chat pre-filled with the course the visitor is interested in
export const courseEnquiryMessage = (course) => {
  const title = course.title || course.name;
  return (
    `Hello ISATS, I would like to know more about the "${title}" course` +
    (course.duration ? ` (${course.duration})` : '') +
    `. Please share the fees, upcoming batch dates, eligibility and admission process.`
  );
};

export const courseEnquiryLink = (course) => whatsappLink(courseEnquiryMessage(course));
