/* ============================================================
   TALA MENU – FICHIER DE CONFIGURATION
   Siège : Lubumbashi, Centre ville – RDC
   Protégé – Ne pas partager ce fichier
   ============================================================ */

const CONFIG = {

    // ---- INFORMATIONS DU SITE ----
    SITE_NAME: 'Tala Menu',
    SITE_SLOGAN: 'Votre menu en un clic',
    ADRESSE: 'Lubumbashi, Centre ville',

    // ---- LIENS ----
    SITE_URL: 'https://heartfelt-baklava-93f4ef.netlify.app',
    BOUTIQUE_URL: 'https://heartfelt-baklava-93f4ef.netlify.app/boutique.html',

    // ---- NUMÉROS WHATSAPP (Format international) ----
    ADMIN_WHATSAPP: '243993636691',
    SUPPORT_WHATSAPP: '243993636691',

    // ---- NUMÉROS DE PAIEMENT ----
    ORANGE_MONEY_NUMBER: '0847764989',
    AIRTEL_MONEY_NUMBER: '0993636691',

    // ---- CODES USSD ----
    ORANGE_USSD: '*144#',
    AIRTEL_USSD: '*501#',

    // ---- OFFRES ET PRIX ----
    DUREE_GRATUIT_JOURS: 7,
    MAX_QR_GRATUIT: 5,
    MAX_PRODUITS_GRATUIT: 10,

    PRIX_STANDARD: 5,
    DUREE_STANDARD_JOURS: 30,
    MAX_QR_STANDARD: Infinity,
    MAX_PRODUITS_STANDARD: 15,

    PRIX_PREMIUM_PLUS: 8,
    DUREE_PREMIUM_PLUS_JOURS: 30,
    MAX_QR_PREMIUM_PLUS: Infinity,
    MAX_PRODUITS_PREMIUM_PLUS: 20,

    // ---- DÉLAI D'ACTIVATION ----
    DELAI_ACTIVATION: '2 à 12 heures',

    // ---- EMAIL ADMIN ----
    ADMIN_EMAIL: 'talaimenu@gmail.com',

    // ---- FIREBASE ----
    FIREBASE_API_KEY: 'AIzaSyBSBN_KU4XhgDyE1CGxWQ9gxs8AZVkYB40',
    FIREBASE_PROJECT_ID: 'tala-menu',
    FIREBASE_APP_ID: '1:846092031156:web:30c2c792f1c17fe37c33e1'
};

const MESSAGES = {
    // Message après inscription
    BIENVENUE: function(prenom, codeSecret) {
        return 'Bonjour ' + prenom + ', bienvenue sur Tala Menu ! 🎉\n\n' +
            'Votre code secret est : ' + codeSecret + '\n' +
            'Gardez-le précieusement. Il vous sert à vous connecter.\n\n' +
            '✅ 7 jours gratuits\n' +
            '✅ 5 QR codes maximum\n' +
            '✅ 10 produits par QR\n\n' +
            '👉 Connectez-vous ici : ' + CONFIG.SITE_URL;
    },

    // Message code oublié
    CODE_OUBLIE: function(nouveauCode) {
        return '🔐 Tala Menu – Nouveau code secret\n\n' +
            'Votre nouveau code secret est : ' + nouveauCode + '\n' +
            'Gardez-le précieusement.\n\n' +
            '👉 Connectez-vous ici : ' + CONFIG.SITE_URL;
    },

    // Message après paiement (utilisateur)
    PAIEMENT_CONFIRME: function() {
        return '✅ *Paiement enregistré avec succès !*\n\n' +
            'Votre transaction a bien été reçue.\n' +
            'Votre compte sera activé sous *' + CONFIG.DELAI_ACTIVATION + '*\n' +
            'après vérification par notre équipe.\n\n' +
            'Vous recevrez une confirmation par WhatsApp\n' +
            'dès que votre compte passera en premium.\n\n' +
            'Merci de votre patience et de votre confiance !';
    },

    // Message notification admin (nouveau paiement)
    PAIEMENT_ADMIN: function(prenom, nom, boutique, codeTransaction, operateur, offre) {
        return '🔔 *NOUVEAU PAIEMENT !*\n\n' +
            '👤 Client : ' + prenom + ' ' + nom + '\n' +
            '🏪 Boutique : ' + boutique + '\n' +
            '💳 Opérateur : ' + operateur + '\n' +
            '📦 Offre : ' + offre + '\n' +
            '🏷️ Code transaction : ' + codeTransaction + '\n' +
            '📅 Date : ' + new Date().toLocaleDateString('fr-FR') + '\n\n' +
            '👉 Valide ce paiement dans ta page admin : ' + CONFIG.SITE_URL + '/admin.html';
    },

    // Message rappel expiration (admin → utilisateur)
    RAPPEL_EXPIRATION: function(prenom, joursRestants, dateExpiration, offre) {
        return '📱 *Tala Menu – Rappel d\'abonnement*\n\n' +
            'Bonjour ' + prenom + ',\n\n' +
            'Votre abonnement *' + offre + '* expire dans *' + joursRestants + ' jour' + (joursRestants > 1 ? 's' : '') + '*\n' +
            'le *' + dateExpiration + '*.\n\n' +
            'Pour continuer à profiter de votre QR menu sans interruption,\n' +
            'pensez à renouveler votre abonnement.\n\n' +
            '👉 Contactez-nous : ' + CONFIG.SUPPORT_WHATSAPP + '\n\n' +
            'Merci de votre confiance !';
    },

    // Message alerte dashboard (5 jours ou moins)
    ALERTE_EXPIRATION: function(joursRestants) {
        return '🔔 Votre abonnement expire dans *' + joursRestants + ' jour' + (joursRestants > 1 ? 's' : '') + '*.\nPassez premium pour continuer sans interruption.';
    },

    // Message limite QR atteinte
    ALERTE_LIMITE_QR: function(max) {
        return '⚠️ Vous avez atteint la limite de *' + max + ' QR gratuits*.\nPassez premium pour des QR illimités.';
    },

    // Message compte expiré
    ALERTE_EXPIRE: '⏳ Votre essai gratuit est terminé.\nPassez premium pour continuer à utiliser votre QR menu.',

    // Message support WhatsApp (bouton flottant)
    CONTACT_SUPPORT: 'Bonjour Tala Menu, j\'ai besoin d\'aide concernant votre service.',

    // Message commande client (bouton WhatsApp sur page boutique)
    COMMANDE_CLIENT: function(boutique) {
        return 'Bonjour ' + boutique + ', je viens de scanner votre QR Tala Menu. Je souhaite commander.';
    }
};