// Client-side API function
export const sendEmailViaAPI = (to, subject, text) => {
  // Fire and forget - don't await the result
  fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ to, subject, text }),
  })
    .catch(error => console.error('Error sending email:', error));
}; 