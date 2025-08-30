import React from "react";

export default function ConditionsUtilisationPage() {
  return (
    <main className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-3xl font-semibold mb-6">Conditions d'utilisation</h1>
      <div className="text-sm leading-relaxed text-black space-y-4">
        <p>
          En accédant au site ELARAIN ou en effectuant un achat, vous acceptez les présentes conditions d'utilisation.
        </p>

        <p className="font-medium">1. Utilisation du site</p>
        <ul className="list-none pl-5 space-y-1">
          <li>Vous vous engagez à ne pas utiliser le site à des fins illégales ou non autorisées.</li>
          <li>Vous acceptez de ne pas perturber le fonctionnement du site ni d'en compromettre la sécurité.</li>
        </ul>

        <p className="font-medium">2. Propriété intellectuelle</p>
        <p>
          Tous les contenus présents sur le site (textes, images, marques et logos) sont la propriété exclusive d'ELARAIN ou de ses partenaires. Toute reproduction ou utilisation sans autorisation écrite est strictement interdite.
        </p>

        <p className="font-medium">3. Limitation de responsabilité</p>
        <p>
          ELARAIN ne pourra être tenu responsable des dommages directs ou indirects résultant de l'utilisation ou de l'impossibilité d'utiliser le site.
        </p>

        <p className="font-medium">4. Modifications</p>
        <p>
          ELARAIN se réserve le droit de modifier ces conditions à tout moment. Les nouvelles conditions seront publiées sur cette page.
        </p>

        <p className="mt-4">Dernière mise à jour : 01/06/2024.</p>
      </div>
    </main>
  );
}