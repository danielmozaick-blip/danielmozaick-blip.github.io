const CONFIG = {
    SITE_NAME: 'Tala Menu',
    SITE_SLOGAN: 'Votre menu en un clic',
    ADRESSE: 'Lubumbashi, Centre ville',

    SITE_URL: 'https://danielmozaick-blip.github.io',
    BOUTIQUE_URL: 'https://danielmozaick-blip.github.io/boutique.html',

    ADMIN_WHATSAPP: '243993636691',
    SUPPORT_WHATSAPP: '243993636691',

    ORANGE_MONEY_NUMBER: '0847764989',
    AIRTEL_MONEY_NUMBER: '0993636691',
    ORANGE_USSD: '*144#',
    AIRTEL_USSD: '*501#',

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

    DELAI_ACTIVATION: '2 à 12 heures',
    ADMIN_EMAIL: 'talaimenu@gmail.com',

    FIREBASE_API_KEY: 'AIzaSyBSBN_KU4XhgDyE1CGxWQ9gxs8AZVkYB40',
    FIREBASE_PROJECT_ID: 'tala-menu',
    FIREBASE_APP_ID: '1:846092031156:web:30c2c792f1c17fe37c33e1'
};

const MESSAGES = {
    BIENVENUE: function(prenom, codeSecret) {
        return 'Bonjour ' + prenom + ', bienvenue sur Tala Menu ! 🎉\n\n' +
            'Votre code secret est : ' + codeSecret + '\n' +
            'Gardez-le précieusement.\n\n' +
            '✅ 7 jours gratuits\n✅ 5 QR codes\n✅ 10 produits/QR\n\n' +
            '👉 ' + CONFIG.SITE_URL;
    },

    CODE_OUBLIE: function(nouveauCode) {
        return '🔐 Tala Menu – Nouveau code secret\n\n' +
            'Votre nouveau code secret : ' + nouveauCode + '\n\n' +
            '👉 ' + CONFIG.SITE_URL;
    },

    PAIEMENT_CONFIRME: function() {
        return '✅ *Paiement enregistré avec succès !*\n\n' +
            'Votre transaction a bien été reçue.\n' +
            'Activation sous *' + CONFIG.DELAI_ACTIVATION + '*.\n\n' +
            'Vous recevrez une confirmation WhatsApp.\n\n' +
            'Merci de votre patience et de votre confiance !';
    },

    PAIEMENT_ADMIN: function(prenom, nom, boutique, whatsapp, offre, nomSIM, montant, codeTransaction) {
        var maintenant = new Date();
        var dateHeure = maintenant.toLocaleDateString('fr-FR') + ' à ' + maintenant.toLocaleTimeString('fr-FR');
        return '🔔 *NOUVEAU PAIEMENT*\n\n' +
            '👤 ' + prenom + ' ' + nom + '\n' +
            '🏪 ' + boutique + '\n' +
            '📱 ' + whatsapp + '\n' +
            '📦 ' + offre + '\n' +
            '💳 SIM : ' + nomSIM + '\n' +
            '💰 Montant : ' + montant + '\n' +
            '🏷️ Code : ' + codeTransaction + '\n' +
            '📅 ' + dateHeure + '\n\n' +
            '👉 ' + CONFIG.SITE_URL + '/admin.html';
    },

    RAPPEL_EXPIRATION: function(prenom, joursRestants, dateExpiration, offre) {
        return '📱 *Tala Menu – Rappel*\n\n' +
            'Bonjour ' + prenom + ',\n\n' +
            'Votre abonnement *' + offre + '* expire dans *' + joursRestants + ' jour' + (joursRestants > 1 ? 's' : '') + '*\n' +
            'le *' + dateExpiration + '*.\n\n' +
            'Pensez à renouveler.\n\n' +
            '👉 ' + CONFIG.SUPPORT_WHATSAPP;
    },

    ALERTE_EXPIRATION: function(joursRestants) {
        return '🔔 Votre abonnement expire dans *' + joursRestants + ' jour' + (joursRestants > 1 ? 's' : '') + '*.\nPassez premium pour continuer.';
    },

    ALERTE_LIMITE_QR: function(max) {
        return '⚠️ Limite de *' + max + ' QR gratuits* atteinte.\nPassez premium pour des QR illimités.';
    },

    ALERTE_EXPIRE: '⏳ Votre essai gratuit est terminé.\nPassez premium pour continuer.',

    CONTACT_SUPPORT: 'Bonjour Tala Menu, j\'ai besoin d\'aide.',

    COMMANDE_CLIENT: function(boutique) {
        return 'Bonjour ' + boutique + ', je viens de scanner votre QR Tala Menu. Je souhaite commander.';
    }
};