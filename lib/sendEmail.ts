// lib/sendEmail.js
import SibApiV3Sdk from 'sib-api-v3-sdk';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

export const sendResetPasswordEmail = async (email:any, resetLink:any) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = {
    to: [{ email }],
    sender: { email: 'bossds2002@gmail.com', name: 'ENT' },
    subject: 'Réinitialisation de votre mot de passe',
    htmlContent: `<p>Bonjour,</p><p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien suivant :</p><a href="${resetLink}">Réinitialiser le mot de passe</a>`,
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('E-mail de réinitialisation envoyé avec succès.');
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail de réinitialisation :', error);
  }
};
