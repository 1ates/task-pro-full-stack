import { sendHelpEmail } from '../utils/sendEmail.js';

export const sendHelpController = async (req, res) => {
  const { email, comment } = req.body;
  await sendHelpEmail({ email, comment });

  res.status(200).json({ status: 200, message: 'Your message has been sent' });
};
