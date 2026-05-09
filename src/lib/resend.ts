import { Resend } from 'resend';

// On crée une fonction pour récupérer le client Resend au besoin
// Cela évite de faire planter le build si la clé est absente au démarrage.
let resendInstance: Resend | null = null;

export const getResend = () => {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('RESEND_API_KEY is missing');
      // On retourne une instance avec une clé bidon pour éviter le crash 
      // si la fonction est appelée par erreur, mais normalement le build passera.
      return new Resend('re_placeholder_for_build');
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
};

// On exporte un objet "mock" qui appelle getResend() pour rester compatible
// avec le reste du code sans tout changer.
export const resend = {
  get emails() {
    return getResend().emails;
  }
};
