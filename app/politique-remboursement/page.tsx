import React from "react";

export default function PolitiqueRemboursementPage() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-semibold mb-6">Politique de remboursement</h1>
      <div className="text-sm leading-relaxed text-black space-y-4">
        <p>
          Chez ELARAIN, aucun remboursement n’est accepté après la livraison de votre commande.
        </p>

        <p>Cependant, nous nous engageons à vous échanger votre article dans les cas suivants&nbsp;:</p>
        <ul className="list-none pl-5 space-y-1">
          <li>Le produit est arrivé endommagé,</li>
          <li>Il y a eu une erreur de modèle ou de couleur de notre part.</li>
        </ul>

        <p>📦 Dans ces cas-là, veuillez nous contacter dans un délai de 48&nbsp;heures après réception avec&nbsp;:</p>
        <ul className="list-none pl-5 space-y-1">
          <li>Une photo du produit concerné,</li>
          <li>Votre numéro.</li>
        </ul>

        <p>⚠️ Aucun échange ne sera accepté si&nbsp;:</p>
        <ul className="list-none pl-5 space-y-1">
          <li>L’article a été utilisé,</li>
          <li>La demande dépasse le délai indiqué,</li>
          <li>L’erreur provient d’une mauvaise sélection lors de la commande.</li>
        </ul>

        <p className="mt-4">Nous vous remercions pour votre confiance.</p>
      </div>
    </main>
  );
}