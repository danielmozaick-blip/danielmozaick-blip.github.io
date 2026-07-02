/* ============================================================
   TALA MENU – SCRIPT PRINCIPAL (Firestore)
   Siège : Lubumbashi, Centre ville – RDC
   ============================================================ */

// ---- 0. INITIALISATION FIREBASE & FIRESTORE ----
firebase.initializeApp({
    apiKey: CONFIG.FIREBASE_API_KEY,
    projectId: CONFIG.FIREBASE_PROJECT_ID,
    appId: CONFIG.FIREBASE_APP_ID
});
const db = firebase.firestore();

// ---- 1. INITIALISATION GLOBALE ----
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    initMenuHamburger();
    initTheme();
    initNavigation();
    initWhatsAppButton();
    afficherPageAccueil();
}

// ---- 3. MENU HAMBURGER (corrigé) ----
function initMenuHamburger() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const closeMenuBtn = document.getElementById('close-menu');
    const menuLinks = document.querySelectorAll('#mobile-menu a');
    if (!menuToggle || !mobileMenu || !mobileOverlay) return;
    function openMenu() { mobileMenu.classList.add('active'); mobileOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
    function closeMenu() { mobileMenu.classList.remove('active'); mobileOverlay.classList.remove('active'); document.body.style.overflow = ''; }
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        openMenu();
    });
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);
    mobileOverlay.addEventListener('click', closeMenu);
    menuLinks.forEach(link => { link.addEventListener('click', function(e) { const href = this.getAttribute('href'); if (href && href.startsWith('#')) closeMenu(); }); });
    window.addEventListener('resize', function() { 
        if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// ---- 4. MODE SOMBRE ----
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    if (!themeToggle) return;
    const savedTheme = localStorage.getItem('tala-theme');
    if (savedTheme === 'dark') { body.classList.add('dark-mode'); themeToggle.textContent = '☀️'; }
    themeToggle.addEventListener('click', function() { body.classList.toggle('dark-mode'); const isDark = body.classList.contains('dark-mode'); themeToggle.textContent = isDark ? '☀️' : '🌙'; localStorage.setItem('tala-theme', isDark ? 'dark' : 'light'); });
}

// ---- 5. NAVIGATION ----
function initNavigation() { document.querySelectorAll('.nav-links a').forEach(link => { link.addEventListener('click', function(e) { document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active')); this.classList.add('active'); }); }); }

// ---- 6. BOUTON WHATSAPP FLOTTANT ----
function initWhatsAppButton() { const btn = document.getElementById('btn-whatsapp-float'); if (!btn) return; btn.addEventListener('click', function() { window.open('https://wa.me/' + CONFIG.SUPPORT_WHATSAPP.replace(/[^0-9]/g, '') + '?text=' + encodeURIComponent(MESSAGES.CONTACT_SUPPORT), '_blank'); }); }

// ---- 7. LOADER ----
function showLoader() { const l = document.getElementById('global-loader'); if (l) l.classList.remove('loader-hidden'); }
function hideLoader() { const l = document.getElementById('global-loader'); if (l) l.classList.add('loader-hidden'); }

// ---- 8. AFFICHAGE PAGE ACCUEIL (Firestore + localStorage) ----
async function afficherPageAccueil() {
    const mc = document.getElementById('main-content');
    if (!mc) return;
    // Vérifier d'abord localStorage
    const ud = JSON.parse(localStorage.getItem('tala-user'));
    if (ud && ud.codeSecret) {
        // Recharger depuis Firestore pour avoir la dernière version
        try {
            const doc = await db.collection('users').doc(ud.whatsapp + '_' + ud.boutique).get();
            if (doc.exists) {
                const fresh = doc.data();
                localStorage.setItem('tala-user', JSON.stringify(fresh));
                afficherEspaceConnecte(fresh);
                return;
            }
        } catch(e) {
            // Si Firestore échoue, utiliser localStorage
            afficherEspaceConnecte(ud);
            return;
        }
        afficherEspaceConnecte(ud);
    } else {
        afficherPagePublique();
    }
}

// ---- 9. PAGE PUBLIQUE ----
function afficherPagePublique() { const mc = document.getElementById('main-content'); const tv = document.getElementById('template-visiteur'); if (!mc || !tv) return; mc.innerHTML = ''; mc.appendChild(tv.content.cloneNode(true)); initFormulaireInscription(); initFormulaireConnexion(); hideLoader(); }

// ---- 10. SÉLECTIONNER UN ESPACE ----
function selectionnerEspace(valeur, texte) { const s = document.getElementById('ins-espace'); if (s) s.value = valeur; const f = document.getElementById('inscription'); if (f) f.scrollIntoView({ behavior: 'smooth' }); document.querySelectorAll('.carte-espace').forEach(c => { c.style.border = '2px solid transparent'; c.style.transform = 'scale(1)'; }); document.querySelectorAll('.carte-espace').forEach(c => { const n = c.querySelector('.nom-espace'); if (n && texte.includes(n.textContent)) { c.style.border = '3px solid var(--secondary)'; c.style.transform = 'scale(1.05)'; } }); }

// ---- 11. FORMULAIRE D'INSCRIPTION ----
function initFormulaireInscription() {
    const form = document.getElementById('form-inscription');
    const btnConnexion = document.getElementById('btn-afficher-connexion');
    if (!form) return;
    if (btnConnexion) { btnConnexion.addEventListener('click', function(e) { e.preventDefault(); const sc = document.getElementById('section-connexion'); if (sc) { sc.classList.toggle('hidden'); sc.scrollIntoView({ behavior: 'smooth' }); } }); }
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        const nom = document.getElementById('ins-nom').value.trim();
        const postnom = document.getElementById('ins-postnom').value.trim();
        const prenom = document.getElementById('ins-prenom').value.trim();
        const boutique = document.getElementById('ins-boutique').value.trim();
        const espace = document.getElementById('ins-espace').value;
        const whatsapp = document.getElementById('ins-whatsapp').value.trim();
        const adresse = document.getElementById('ins-adresse').value.trim();
        let isValid = true;
        if (!nom) { document.getElementById('err-nom').textContent = 'Le nom est obligatoire.'; document.getElementById('ins-nom').classList.add('error'); isValid = false; }
        if (!postnom) { document.getElementById('err-postnom').textContent = 'Le post-nom est obligatoire.'; document.getElementById('ins-postnom').classList.add('error'); isValid = false; }
        if (!prenom) { document.getElementById('err-prenom').textContent = 'Le prénom est obligatoire.'; document.getElementById('ins-prenom').classList.add('error'); isValid = false; }
        if (!boutique) { document.getElementById('err-boutique').textContent = 'Le nom de l\'établissement est obligatoire.'; document.getElementById('ins-boutique').classList.add('error'); isValid = false; }
        if (!espace) { document.getElementById('err-espace').textContent = 'Veuillez choisir un espace.'; document.getElementById('ins-espace').classList.add('error'); isValid = false; }
        if (!whatsapp || !/^\d{10}$/.test(whatsapp)) { document.getElementById('err-whatsapp').textContent = 'Numéro WhatsApp invalide (10 chiffres).'; document.getElementById('ins-whatsapp').classList.add('error'); isValid = false; }
        if (!adresse) { document.getElementById('err-adresse').textContent = 'L\'adresse est obligatoire.'; document.getElementById('ins-adresse').classList.add('error'); isValid = false; }
        if (!isValid) return;

        db.collection('users').doc(whatsapp + '_' + boutique).get().then(function(doc) {
            if (doc.exists) {
                const ed = document.getElementById('inscription-error');
                ed.textContent = '❌ Cette boutique est déjà inscrite avec ce numéro WhatsApp.';
                ed.classList.remove('hidden');
                ed.scrollIntoView({ behavior: 'smooth' });
                return;
            }
            const codeSecret = Math.floor(100000 + Math.random() * 900000).toString();
            const userData = { nom, postnom, prenom, boutique, espace, whatsapp, adresse, codeSecret, dateInscription: new Date().toISOString().split('T')[0], dateExpiration: new Date(Date.now() + CONFIG.DUREE_GRATUIT_JOURS * 24 * 60 * 60 * 1000).toISOString().split('T')[0], statut: 'gratuit', nbQR: 0, produits: [], qrCodes: [], logo: '' };
            sauvegarderUtilisateur(userData);
            document.getElementById('inscription-success').innerHTML = '✅ <strong>Inscription réussie !</strong><br>Votre code secret : <strong style="font-size:1.5rem;color:#E74C3C;">' + codeSecret + '</strong><br><br>Notez-le précieusement !';
            document.getElementById('inscription-success').classList.remove('hidden');
            form.style.display = 'none';
            alert('✅ Votre code secret : ' + codeSecret + '\n\nNotez-le précieusement !');
            setTimeout(() => { afficherEspaceConnecte(userData); }, 3000);
        }).catch(function(e) {
            console.log('Erreur inscription:', e);
        });
    });
}

// ---- 12. FORMULAIRE DE CONNEXION ----
function initFormulaireConnexion() {
    const form = document.getElementById('form-connexion');
    const btnCodeOublie = document.getElementById('btn-code-oublie');
    if (!form) return;
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const whatsapp = document.getElementById('con-whatsapp').value.trim();
        const code = document.getElementById('con-code').value.trim();
        const errorDiv = document.getElementById('connexion-error');
        if (!whatsapp || !code) { errorDiv.textContent = '❌ Veuillez remplir tous les champs.'; errorDiv.classList.remove('hidden'); return; }
        db.collection('users').where('whatsapp', '==', whatsapp).where('codeSecret', '==', code).get().then(function(snapshot) {
            if (!snapshot.empty) {
                const user = snapshot.docs[0].data();
                localStorage.setItem('tala-user', JSON.stringify(user));
                errorDiv.classList.add('hidden');
                afficherEspaceConnecte(user);
            } else {
                errorDiv.textContent = '❌ Numéro WhatsApp ou code secret incorrect.';
                errorDiv.classList.remove('hidden');
            }
        }).catch(function(e) {
            errorDiv.textContent = '❌ Erreur de connexion. Réessayez.';
            errorDiv.classList.remove('hidden');
        });
    });
    if (btnCodeOublie) {
        btnCodeOublie.addEventListener('click', function(e) {
            e.preventDefault();
            const w = document.getElementById('con-whatsapp').value.trim();
            if (!w || !/^\d{10}$/.test(w)) { alert('Veuillez entrer votre numéro WhatsApp.'); return; }
            db.collection('users').where('whatsapp', '==', w).get().then(function(snapshot) {
                if (!snapshot.empty) {
                    const doc = snapshot.docs[0];
                    const nc = Math.floor(100000 + Math.random() * 900000).toString();
                    db.collection('users').doc(doc.id).update({ codeSecret: nc }).then(function() {
                        alert('✅ Nouveau code secret : ' + nc + '\n\nNotez-le précieusement !');
                    });
                } else { alert('❌ Aucun compte trouvé avec ce numéro WhatsApp.'); }
            });
        });
    }
}

// ---- 13. FONCTIONS FIRESTORE ----
function sauvegarderUtilisateur(userData) {
    localStorage.setItem('tala-user', JSON.stringify(userData));
    db.collection('users').doc(userData.whatsapp + '_' + userData.boutique).set(userData).catch(function(e) { console.log('Firestore save error:', e); });
}
function mettreAJourAllUsers(userData) {
    localStorage.setItem('tala-user', JSON.stringify(userData));
    db.collection('users').doc(userData.whatsapp + '_' + userData.boutique).set(userData).catch(function(e) { console.log('Firestore update error:', e); });
}

// ---- 14. ESPACE CONNECTÉ ----
function afficherEspaceConnecte(userData) {
    const mainContent = document.getElementById('main-content');
    const templateConnecte = document.getElementById('template-connecte');
    if (!mainContent || !templateConnecte) return;

    verifierExpiration(userData);
    mainContent.innerHTML = '';
    mainContent.appendChild(templateConnecte.content.cloneNode(true));

    document.getElementById('welcome-boutique').textContent = userData.boutique;
    document.getElementById('stat-qr').textContent = userData.qrCodes ? userData.qrCodes.length : 0;
    const joursRestants = calculerJoursRestants(userData.dateExpiration);
    document.getElementById('stat-jours').textContent = joursRestants;
    const statutText = userData.statut === 'premium_plus' ? '💎 Premium+' : userData.statut === 'premium' ? '🌟 Standard' : userData.statut === 'expire' ? '⏳ Expiré' : '✅ Gratuit';
    document.getElementById('stat-statut').textContent = statutText;

    if (userData.statut === 'premium') afficherBadgePremium(userData.dateExpiration);
    if (userData.statut === 'premium_plus') afficherBadgePremiumPlus(userData.dateExpiration);

    const nbQR = userData.qrCodes ? userData.qrCodes.length : 0;
    let maxQR, pourcentage;
    if (userData.statut === 'premium' || userData.statut === 'premium_plus') { maxQR = '∞'; pourcentage = 100; }
    else { maxQR = CONFIG.MAX_QR_GRATUIT; pourcentage = Math.min((nbQR / CONFIG.MAX_QR_GRATUIT) * 100, 100); }
    document.getElementById('progress-qr').style.width = pourcentage + '%';
    document.getElementById('progress-text').textContent = (userData.statut === 'premium' || userData.statut === 'premium_plus') ? nbQR + ' QR (illimité)' : nbQR + ' / ' + CONFIG.MAX_QR_GRATUIT + ' QR gratuits';

    const alerte = document.getElementById('alerte-limite-qr');
    if (userData.statut === 'expire') {
        alerte.classList.remove('hidden'); alerte.className = 'alert alert-error';
        alerte.innerHTML = MESSAGES.ALERTE_EXPIRE;
    } else if (userData.statut === 'gratuit' && nbQR >= CONFIG.MAX_QR_GRATUIT) {
        alerte.classList.remove('hidden'); alerte.className = 'alert alert-warning';
        alerte.innerHTML = MESSAGES.ALERTE_LIMITE_QR(CONFIG.MAX_QR_GRATUIT);
    } else if (userData.statut === 'gratuit' && joursRestants <= 5 && joursRestants > 0) {
        alerte.classList.remove('hidden'); alerte.className = 'alert alert-warning';
        alerte.innerHTML = MESSAGES.ALERTE_EXPIRATION(joursRestants);
    }

    afficherQRCodes(userData);
    afficherProduits(userData, null);
    initBoutonsConnecte(userData);

    if (userData.statut === 'premium' || userData.statut === 'premium_plus') {
        const sp = document.getElementById('section-premium');
        if (sp) sp.classList.add('hidden');
    }
    const sectionLogo = document.getElementById('section-logo');
    if (sectionLogo) {
        if (userData.statut === 'premium_plus') sectionLogo.classList.remove('hidden');
        else sectionLogo.classList.add('hidden');
    }
    hideLoader();

    // --- BOUTON D'INSTALLATION PWA (Professionnel) ---
    var deferredPrompt;
    window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        deferredPrompt = e;

        var banner = document.createElement('div');
        banner.className = 'alert alert-info';
        banner.style.cssText = 'position: fixed; bottom: 20px; left: 20px; right: 20px; z-index: 5000; text-align: center; font-size: 0.9rem; padding: 15px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;';
        banner.innerHTML = '<span>📱 Ajoutez Tala Menu à votre écran d\'accueil !</span><div><button id="btn-install-pwa" class="btn-primary btn-sm" style="margin-right: 8px;">📥 Installer</button><button id="btn-close-pwa" class="btn-close" style="position:static;">✕</button></div>';
        document.body.appendChild(banner);

        document.getElementById('btn-install-pwa').addEventListener('click', function() {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(function(choiceResult) {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('Application installée');
                    }
                    deferredPrompt = null;
                    banner.remove();
                });
            }
        });
        document.getElementById('btn-close-pwa').addEventListener('click', function() {
            banner.remove();
        });
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
        // déjà installée, ne rien faire
    }
}

// ---- 15. BADGE PREMIUM STANDARD ----
function afficherBadgePremium(dateExpiration) {
    const container = document.getElementById('badge-premium-container');
    if (!container) return;
    const joursRestants = calculerJoursRestants(dateExpiration);
    container.innerHTML = '<div class="badge-premium"><span class="badge-pro">STANDARD</span><span class="badge-icon">👑</span><h3>PREMIUM ACTIF</h3><p>💎 QR illimités • 15 produits par QR</p><p class="badge-expire">📅 Expire le ' + formaterDate(dateExpiration) + ' • ⏳ ' + joursRestants + ' jours restants</p></div>';
    container.classList.remove('hidden');
}

// ---- 16. BADGE PREMIUM+ ----
function afficherBadgePremiumPlus(dateExpiration) {
    const container = document.getElementById('badge-premium-container');
    if (!container) return;
    const joursRestants = calculerJoursRestants(dateExpiration);
    container.innerHTML = '<div class="badge-premium-plus"><span class="badge-pro">PREMIUM+</span><span class="badge-icon">💎</span><h3>PREMIUM+ ACTIF</h3><p>💠 QR illimités • 20 produits par QR • Logo perso</p><p class="badge-expire">📅 Expire le ' + formaterDate(dateExpiration) + ' • ⏳ ' + joursRestants + ' jours restants</p></div>';
    container.classList.remove('hidden');
}

// ---- 17. AFFICHER QR CODES ----
function afficherQRCodes(userData) {
    const container = document.getElementById('qr-liste');
    if (!container) return;
    const qrCodes = userData.qrCodes || [];
    const estPayant = userData.statut === 'premium' || userData.statut === 'premium_plus';
    const estExpire = userData.statut === 'expire';
    const limiteAtteinte = !estPayant && qrCodes.length >= CONFIG.MAX_QR_GRATUIT;

    const btnCreer = document.getElementById('btn-creer-qr');
    if (btnCreer) {
        if (estExpire || (!estPayant && limiteAtteinte)) btnCreer.style.display = 'none';
        else btnCreer.style.display = '';
    }
    if (qrCodes.length === 0) { container.innerHTML = '<p style="text-align:center;color:var(--text-muted);">Aucun QR code créé.</p>'; return; }

    container.innerHTML = '';
    qrCodes.forEach((qr, index) => {
        const div = document.createElement('div');
        div.className = 'card';
        div.style.cssText = 'display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;';
        const qrId = 'qr-div-' + index;
        const btnSupprimer = estPayant ? '<button class="btn-danger btn-sm" onclick="supprimerQR(\'' + qr.id + '\')">🗑️</button>' : '';
        const btnProduits = '<button class="btn-success btn-sm" onclick="selectionnerQRcourant(\'' + qr.id + '\')">📋 Produits</button>';
        div.innerHTML = '<div style="display:flex;align-items:center;gap:12px;"><div id="' + qrId + '" style="width:100px;height:100px;border-radius:8px;border:2px solid #ddd;background:#fff;display:flex;align-items:center;justify-content:center;"></div><div><strong>📋 ' + qr.nom + '</strong><br><span style="font-size:0.80rem;color:var(--text-muted);">Créé le ' + qr.dateCreation + '</span></div></div><div style="display:flex;gap:6px;flex-wrap:wrap;">' + btnProduits + '<button class="btn-success btn-sm" onclick="voirQR(\'' + qr.id + '\')">👁️</button><button class="btn-secondary btn-sm" onclick="telechargerQRdiv(\'' + qrId + '\',\'' + qr.nom + '\')">📥</button>' + btnSupprimer + '</div>';
        container.appendChild(div);

        (function(cid, lien) {
            setTimeout(function() {
                var divQR = document.getElementById(cid);
                if (divQR && window.QRCode) {
                    divQR.innerHTML = '';
                    try {
                        new QRCode(divQR, { text: lien, width: 100, height: 100, colorDark: '#000000', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.H });
                        var ud = JSON.parse(localStorage.getItem('tala-user'));
                        if (ud && ud.statut === 'premium_plus' && ud.logo) {
                            setTimeout(function() {
                                var canvas = divQR.querySelector('canvas');
                                if (canvas) {
                                    var ctx = canvas.getContext('2d');
                                    var img = new Image();
                                    img.onload = function() {
                                        var size = 25;
                                        var x = (100 - size) / 2;
                                        var y = (100 - size) / 2;
                                        ctx.fillStyle = '#ffffff';
                                        ctx.fillRect(x-2, y-2, size+4, size+4);
                                        ctx.drawImage(img, x, y, size, size);
                                    };
                                    img.src = ud.logo;
                                }
                            }, 300);
                        }
                    } catch(e) { divQR.innerHTML = '<span style="color:red;">Erreur</span>'; }
                }
            }, 400);
        })(qrId, qr.lien || CONFIG.SITE_URL);
    });
}

// ---- 18. QR COURANT ----
var qrCourant = null;
function selectionnerQRcourant(qrId) {
    const userData = JSON.parse(localStorage.getItem('tala-user'));
    qrCourant = userData.qrCodes.find(q => q.id === qrId);
    afficherProduits(userData, qrCourant);
    alert('✅ QR « ' + qrCourant.nom + ' » sélectionné. Ajoutez vos produits.');
}

// ---- 19. AFFICHER PRODUITS ----
function afficherProduits(userData, qrCible) {
    const container = document.getElementById('produits-liste');
    const limiteText = document.getElementById('produits-limite');
    if (!container) return;
    const qr = qrCible || qrCourant;
    if (!qr) { container.innerHTML = '<p style="text-align:center;color:var(--text-muted);">Cliquez sur 📋 Produits d\'un QR pour voir ses produits.</p>'; if (limiteText) limiteText.textContent = ''; return; }
    const produits = qr.produits || [];
    const maxProduits = userData.statut === 'premium_plus' ? CONFIG.MAX_PRODUITS_PREMIUM_PLUS : userData.statut === 'premium' ? CONFIG.MAX_PRODUITS_STANDARD : CONFIG.MAX_PRODUITS_GRATUIT;
    if (limiteText) limiteText.textContent = produits.length + ' / ' + maxProduits + ' produits (' + qr.nom + ')';
    if (produits.length === 0) { container.innerHTML = '<p style="text-align:center;color:var(--text-muted);">Aucun produit pour ce QR.</p>'; return; }
    container.innerHTML = '';
    produits.forEach((p, index) => {
        const div = document.createElement('div');
        div.className = 'produit-item';
        div.innerHTML = '<span class="produit-nom">' + p.nom + '</span><span class="produit-prix">' + p.prix + '</span><button class="btn-danger btn-sm" onclick="supprimerProduit(' + index + ')">🗑️</button>';
        container.appendChild(div);
    });
}

// ---- 20. BOUTONS ESPACE CONNECTÉ ----
function initBoutonsConnecte(userData) {
    const btnCreerQR = document.getElementById('btn-creer-qr');
    if (btnCreerQR) btnCreerQR.addEventListener('click', function() { creerQRCode(userData); });

    const btnAjouterProduit = document.getElementById('btn-ajouter-produit');
    if (btnAjouterProduit) btnAjouterProduit.addEventListener('click', function() { ajouterProduit(userData); });

    const btnPayerStandard = document.getElementById('btn-payer-standard');
    if (btnPayerStandard) btnPayerStandard.addEventListener('click', function() { ouvrirPaiement(userData, 'standard'); });

    const btnPayerPlus = document.getElementById('btn-payer-premium-plus');
    if (btnPayerPlus) btnPayerPlus.addEventListener('click', function() { ouvrirPaiement(userData, 'premium_plus'); });

    const btnFermerPaiement = document.getElementById('btn-fermer-paiement');
    if (btnFermerPaiement) btnFermerPaiement.addEventListener('click', function() { document.getElementById('section-paiement').classList.add('hidden'); });

    const btnFermerInstructions = document.getElementById('btn-fermer-instructions');
    if (btnFermerInstructions) btnFermerInstructions.addEventListener('click', function() { document.getElementById('instructions-paiement').classList.add('hidden'); });

    const btnOrange = document.getElementById('btn-orange');
    const btnAirtel = document.getElementById('btn-airtel');
    if (btnOrange) btnOrange.addEventListener('click', function() { afficherInstructionsPaiement('orange'); });
    if (btnAirtel) btnAirtel.addEventListener('click', function() { afficherInstructionsPaiement('airtel'); });

    const btnConfirmer = document.getElementById('btn-confirmer-paiement');
    if (btnConfirmer) btnConfirmer.addEventListener('click', function() { confirmerPaiement(userData); });

    const logoUpload = document.getElementById('logo-upload');
    if (logoUpload) logoUpload.addEventListener('change', function() { uploaderLogo(userData, this); });

    const btnDeconnexion = document.getElementById('btn-deconnexion');
    if (btnDeconnexion) btnDeconnexion.addEventListener('click', function() { if (confirm('Déconnexion ?')) { localStorage.removeItem('tala-user'); location.reload(); } });
}

var offreEnCours = 'standard';
function ouvrirPaiement(userData, offre) {
    offreEnCours = offre;
    const sp = document.getElementById('section-paiement');
    const nomOffre = document.getElementById('paiement-offre-nom');
    if (sp) sp.classList.remove('hidden');
    if (nomOffre) nomOffre.textContent = offre === 'premium_plus' ? 'Premium+ (8 $)' : 'Standard (5 $)';
    sp.scrollIntoView({ behavior: 'smooth' });
}

function uploaderLogo(userData, input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        userData.logo = e.target.result;
        sauvegarderUtilisateur(userData);
        mettreAJourAllUsers(userData);
        document.getElementById('logo-status').textContent = '✅ Logo enregistré !';
    };
    reader.readAsDataURL(file);
}

// ---- 21. CRÉER QR CODE ----
function creerQRCode(userData) {
    const estPayant = userData.statut === 'premium' || userData.statut === 'premium_plus';
    const estExpire = userData.statut === 'expire';
    const maxQR = estPayant ? Infinity : CONFIG.MAX_QR_GRATUIT;
    const nbQR = userData.qrCodes ? userData.qrCodes.length : 0;
    if (estExpire) { alert('⏳ Votre essai gratuit est terminé. Passez premium.'); return; }
    if (!estPayant && nbQR >= maxQR) { alert('⚠️ Limite de ' + CONFIG.MAX_QR_GRATUIT + ' QR gratuits atteinte.'); return; }
    const nomQR = prompt('📷 Nom du QR code :', 'Menu principal');
    if (!nomQR) return;
    const idQR = 'qr_' + Date.now();
    const lienQR = CONFIG.BOUTIQUE_URL + '?id=' + userData.whatsapp;
    const nouveauQR = { id: idQR, nom: nomQR, dateCreation: new Date().toISOString().split('T')[0], dateExpiration: userData.dateExpiration, statut: userData.statut, lien: lienQR, produits: [] };
    if (!userData.qrCodes) userData.qrCodes = [];
    userData.qrCodes.push(nouveauQR);
    userData.nbQR = userData.qrCodes.length;
    sauvegarderUtilisateur(userData);
    qrCourant = nouveauQR;
    afficherEspaceConnecte(userData);
    alert('✅ QR code « ' + nomQR + ' » créé ! Ajoutez vos produits maintenant.');
}

// ---- 22. AJOUTER PRODUIT ----
function ajouterProduit(userData) {
    if (!qrCourant) { alert('Veuillez d\'abord sélectionner un QR code en cliquant sur 📋 Produits.'); return; }
    const maxProduits = userData.statut === 'premium_plus' ? CONFIG.MAX_PRODUITS_PREMIUM_PLUS : userData.statut === 'premium' ? CONFIG.MAX_PRODUITS_STANDARD : CONFIG.MAX_PRODUITS_GRATUIT;
    const nbProduits = qrCourant.produits ? qrCourant.produits.length : 0;
    if (nbProduits >= maxProduits) { alert('⚠️ Limite de ' + maxProduits + ' produits atteinte pour ce QR.'); return; }

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:3000;display:flex;align-items:center;justify-content:center;';
    const modal = document.createElement('div');
    modal.style.cssText = 'background:#fff;border-radius:16px;padding:28px;max-width:400px;width:90%;';
    modal.innerHTML = '<h3 style="text-align:center;margin-bottom:20px;">📋 Ajouter un produit à « ' + qrCourant.nom + ' »</h3><div style="margin-bottom:16px;"><label style="font-weight:600;">Nom *</label><input type="text" id="modal-nom" placeholder="Ex : Poulet braisé" style="width:100%;padding:12px;border:2px solid #ddd;border-radius:10px;"></div><div style="margin-bottom:16px;"><label style="font-weight:600;">Prix *</label><input type="text" id="modal-prix" placeholder="Ex : 5 000 FC" style="width:100%;padding:12px;border:2px solid #ddd;border-radius:10px;"></div><div style="display:flex;gap:10px;justify-content:center;margin-top:20px;"><button id="modal-annuler" style="background:transparent;color:#1A3B5C;padding:10px 24px;border:2px solid #1A3B5C;border-radius:30px;font-weight:600;">Annuler</button><button id="modal-valider" style="background:#F5A623;color:#fff;padding:10px 24px;border:none;border-radius:30px;font-weight:700;">✅ Ajouter</button></div>';
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    document.getElementById('modal-nom').focus();
    document.getElementById('modal-annuler').onclick = function() { document.body.removeChild(overlay); };
    document.getElementById('modal-valider').onclick = function() {
        const nom = document.getElementById('modal-nom').value.trim();
        const prix = document.getElementById('modal-prix').value.trim();
        if (!nom) { alert('Nom requis.'); return; }
        if (!prix) { alert('Prix requis.'); return; }
        if (!qrCourant.produits) qrCourant.produits = [];
        qrCourant.produits.push({ nom: nom, prix: prix });
        const userDataFresh = JSON.parse(localStorage.getItem('tala-user'));
        const idx = userDataFresh.qrCodes.findIndex(q => q.id === qrCourant.id);
        if (idx !== -1) userDataFresh.qrCodes[idx] = qrCourant;
        sauvegarderUtilisateur(userDataFresh);
        document.body.removeChild(overlay);
        afficherEspaceConnecte(userDataFresh);
        selectionnerQRcourant(qrCourant.id);
    };
    overlay.onclick = function(e) { if (e.target === overlay) document.body.removeChild(overlay); };
}

// ---- 23. SUPPRIMER PRODUIT ----
function supprimerProduit(index) {
    if (!qrCourant) { alert('Aucun QR sélectionné.'); return; }
    if (!confirm('Supprimer ce produit ?')) return;
    const userData = JSON.parse(localStorage.getItem('tala-user'));
    const idx = userData.qrCodes.findIndex(q => q.id === qrCourant.id);
    if (idx !== -1) {
        userData.qrCodes[idx].produits.splice(index, 1);
        qrCourant = userData.qrCodes[idx];
        sauvegarderUtilisateur(userData);
        afficherEspaceConnecte(userData);
        selectionnerQRcourant(qrCourant.id);
    }
}

// ---- 24. SUPPRIMER QR CODE ----
function supprimerQR(id) {
    const userData = JSON.parse(localStorage.getItem('tala-user'));
    if (!userData || (userData.statut !== 'premium' && userData.statut !== 'premium_plus')) { alert('❌ Premium requis.'); return; }
    if (!confirm('Supprimer ce QR ?')) return;
    userData.qrCodes = userData.qrCodes.filter(qr => qr.id !== id);
    userData.nbQR = userData.qrCodes.length;
    sauvegarderUtilisateur(userData);
    if (qrCourant && qrCourant.id === id) qrCourant = null;
    afficherEspaceConnecte(userData);
}

// ---- 25. VOIR QR ----
function voirQR(id) {
    const userData = JSON.parse(localStorage.getItem('tala-user'));
    const qr = userData.qrCodes.find(q => q.id === id);
    if (qr && qr.lien) window.open(qr.lien, '_blank');
}

// ---- 26. TÉLÉCHARGER QR ----
function telechargerQRdiv(divId, nomQR) {
    var div = document.getElementById(divId);
    if (!div) { alert('QR introuvable.'); return; }
    var canvas = div.querySelector('canvas');
    if (!canvas) { alert('QR pas encore généré.'); return; }
    var link = document.createElement('a');
    link.download = 'QR-' + nomQR.replace(/[^a-z0-9]/gi,'_') + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// ---- 27. PAIEMENT (Firestore) ----
function afficherInstructionsPaiement(operateur) {
    const container = document.getElementById('instructions-paiement');
    const titre = document.getElementById('instructions-titre');
    const contenu = document.getElementById('instructions-contenu');
    const codeContainer = document.getElementById('code-transaction-container');
    if (!container || !titre || !contenu || !codeContainer) return;
    container.classList.remove('hidden');
    codeContainer.classList.remove('hidden');
    if (operateur === 'orange') {
        titre.textContent = '🟠 Orange Money';
        contenu.innerHTML = '<p><strong>📱 Numéro :</strong> ' + CONFIG.ORANGE_MONEY_NUMBER + '</p><p><strong>📲 USSD :</strong> ' + CONFIG.ORANGE_USSD + '</p><ol style="padding-left:20px;line-height:2;"><li>Composez ' + CONFIG.ORANGE_USSD + '</li><li>Envoyer de l\'argent</li><li>Numéro : ' + CONFIG.ORANGE_MONEY_NUMBER + '</li><li>Montant : ' + (offreEnCours === 'premium_plus' ? CONFIG.PRIX_PREMIUM_PLUS : CONFIG.PRIX_STANDARD) + ' $ exactement</li><li>Validez</li></ol>';
    } else {
        titre.textContent = '🔴 Airtel Money';
        contenu.innerHTML = '<p><strong>📱 Numéro :</strong> ' + CONFIG.AIRTEL_MONEY_NUMBER + '</p><p><strong>📲 USSD :</strong> ' + CONFIG.AIRTEL_USSD + '</p><ol style="padding-left:20px;line-height:2;"><li>Composez ' + CONFIG.AIRTEL_USSD + '</li><li>Envoyer de l\'argent</li><li>Numéro : ' + CONFIG.AIRTEL_MONEY_NUMBER + '</li><li>Montant : ' + (offreEnCours === 'premium_plus' ? CONFIG.PRIX_PREMIUM_PLUS : CONFIG.PRIX_STANDARD) + ' $ exactement</li><li>Validez</li></ol>';
    }
}

function confirmerPaiement(userData) {
    const codeTransaction = document.getElementById('code-transaction').value.trim();
    if (!codeTransaction) { alert('Code transaction requis.'); return; }
    var paiement = {
        userWhatsapp: userData.whatsapp,
        prenom: userData.prenom,
        nom: userData.nom,
        boutique: userData.boutique,
        codeTransaction: codeTransaction,
        date: new Date().toISOString(),
        valide: false,
        offre: offreEnCours
    };
    db.collection('paiements').add(paiement).then(function() {
        document.getElementById('paiement-success').innerHTML = MESSAGES.PAIEMENT_CONFIRME().replace(/\n/g, '<br>');
        document.getElementById('paiement-success').classList.remove('hidden');
        document.getElementById('code-transaction').value = '';
        setTimeout(() => { document.getElementById('paiement-success').classList.add('hidden'); }, 10000);
    }).catch(function(e) {
        alert('❌ Erreur lors de l\'enregistrement. Réessayez.');
    });
}

// ---- 28. UTILITAIRES ----
function calculerJoursRestants(dateExpiration) {
    if (!dateExpiration) return 0;
    const maintenant = new Date();
    const expiration = new Date(dateExpiration);
    const diff = Math.ceil((expiration - maintenant) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
}
function formaterDate(dateStr) { const date = new Date(dateStr); return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
function verifierExpiration(userData) {
    if (!userData || !userData.dateExpiration) return;
    const maintenant = new Date();
    const expiration = new Date(userData.dateExpiration);
    if (maintenant > expiration && userData.statut !== 'expire' && userData.statut !== 'premium' && userData.statut !== 'premium_plus') {
        userData.statut = 'expire';
        sauvegarderUtilisateur(userData);
    }
}

// ---- 29. AVIS, CONTACT, COMMENTAIRES (Firestore) ----
function sauvegarderAvis(prenom, message) {
    db.collection('avisAttente').add({ prenom, message, date: new Date().toISOString() });
}
function sauvegarderContact(nom, email, sujet, message) {
    db.collection('messagesContact').add({ nom, email, sujet, message, date: new Date().toISOString() });
}
function sauvegarderCommentaire(prenom, message) {
    db.collection('commentairesPrives').add({ prenom, message, date: new Date().toISOString() });
}

// ---- 30. SERVICE WORKER ----
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() { navigator.serviceWorker.register('/sw.js').then(function(r) { console.log('SW ok'); }).catch(function(e) {}); });
}

// ---- 31. DÉTECTION CONNEXION ----
window.addEventListener('online', function() { const b = document.getElementById('offline-banner'); if (b) b.remove(); });
window.addEventListener('offline', function() {
    const mc = document.getElementById('main-content');
    if (mc && !document.getElementById('offline-banner')) {
        const banner = document.createElement('div');
        banner.className = 'alert alert-warning';
        banner.textContent = '⚠️ Vous êtes hors ligne.';
        banner.id = 'offline-banner';
        mc.insertBefore(banner, mc.firstChild);
    }
});

/* ============================================================
   FIN DU FICHIER script.js – Tala Menu Lubumbashi – Firestore
   ============================================================ */