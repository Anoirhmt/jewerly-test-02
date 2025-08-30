import React from "react";

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-semibold mb-6">Politique de confidentialité</h1>
      <div className="text-sm leading-relaxed text-black space-y-4">
        <p>
          Cette politique de confidentialité explique comment ELARAIN collecte, utilise et protège vos informations personnelles lorsque vous visitez notre site ou effectuez un achat.
        </p>

        <p className="font-medium">1. Données collectées</p>
        <ul className="list-none pl-5 space-y-1">
          <li>Informations d'identification : nom, adresse, email, numéro de téléphone.</li>
          <li>Données de paiement : uniquement les informations nécessaires pour traiter votre transaction, transmises via une connexion chiffrée.</li>
          <li>Données de navigation : pages consultées, durée de visite, adresse IP et type d'appareil.</li>
        </ul>

        <p className="font-medium">2. Utilisation des informations</p>
        <ul className="list-none pl-5 space-y-1">
          <li>Traitement et livraison de vos commandes.</li>
          <li>Service client et réponses à vos demandes.</li>
          <li>Amélioration continue de notre site et de nos offres.</li>
          <li>Envoi d'actualités et d'offres, uniquement avec votre consentement explicite.</li>
        </ul>

        <p className="font-medium">3. Partage des données</p>
        <p>
          Vos informations ne sont jamais vendues. Elles ne sont partagées qu'avec des prestataires de confiance (paiement, logistique) dans la stricte mesure nécessaire à l'exécution de vos commandes.
        </p>

        <p className="font-medium">4. Vos droits</p>
        <ul className="list-none pl-5 space-y-1">
          <li>Droit d'accès, de rectification et de suppression de vos données.</li>
          <li>Droit de vous opposer au traitement ou de demander une limitation.</li>
          <li>Droit à la portabilité de vos informations.</li>
        </ul>

        <p>
          Pour exercer l'un de ces droits, contactez-nous à : 0693-011454.
        </p>

        <p className="mt-4">Dernière mise à jour : 01/06/2024.</p>
      </div>
    </main>
  );
}